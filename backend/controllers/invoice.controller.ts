import { BrowserWindow } from "electron";
import schedule from "node-schedule";
import { Sequelize } from "sequelize";
import { CashInvoice } from "../models/cashinvoice.model";
import { Customer } from "../models/customer.model";
import { Invoice } from "../models/invoice.model";
import { InvoiceProduct } from "../models/invoiceproduct.model";
import { Product } from "../models/product.model";
import { ApiError, ApiResponse, asynchandler } from "../utils/apihandler";
import {
  customerListControllerValidator,
  removeCustomerControllerValidator,
} from "../validators/customer.validator";
import {
  generatePDFInvoiceControllerValidator,
  insertInvoiceControllerValidator,
  updateInvoiceControllerValidator,
} from "../validators/invoice.validator";

export const insertInvoiceHandler = asynchandler({
  fn: async (event, data, win) => {
    const dataValidation = insertInvoiceControllerValidator.safeParse(data);
    if (!dataValidation.success)
      return (event.returnValue = new ApiError(400, "Invalid Data"));

    // 🔍 Log the incoming status (debug)
    console.log("Creating invoice with status:", dataValidation.data.status);

    const deletionDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const invoice = await Invoice.create({
      ...dataValidation.data,
    });

    // 🕒 Auto-delete after 24 hours (optional logic)
    schedule.scheduleJob("invoice-job", deletionDate, async () => {
      await Invoice.destroy({
        where: {
          id: invoice.id,
        },
      });
    });

    // ✅ Deduct stock only for final invoices
    if (dataValidation.data.status === "success") {
      for (const item of dataValidation.data.products) {
        const product = await Product.findByPk(item.productId);
        if (!product) continue;

        const newStock = product.dataValues.stock - item.quantity;

        await Product.update(
          { stock: newStock },
          { where: { id: product.dataValues.id } }
        );

        if (newStock < 10 && win) {
          win.webContents.send("low-stock-warning", {
            productId: product.dataValues.id,
            name: product.dataValues.name,
            remaining: newStock,
          });
        }
      }
    }

    // ✅ Always insert invoice products
    for (const item of dataValidation.data.products) {
      await InvoiceProduct.create({
        invoiceId: invoice.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        units: item.units,
      });
    }

    // ✅ Return after all work is done
    return (event.returnValue = new ApiResponse(201, null, "Invoice Created"));
  },
});

export const generatePDFInvoiceHandler = asynchandler({
  fn: async (event, data) => {
    const dataValidation =
      generatePDFInvoiceControllerValidator.safeParse(data);
    if (!dataValidation.success)
      return (event.returnValue = new ApiError(400, "Invalid Data"));
    const printWindow = new BrowserWindow({ show: false });
    printWindow.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(
        dataValidation.data.content
      )}`
    );
    if (!dataValidation.success)
      return (event.returnValue = new ApiError(400, "Invalid Data"));
    printWindow.webContents.on("did-finish-load", () => {
      printWindow.webContents.print(
        {
          pageSize: "A6",
          printBackground: true,
          landscape: false,
        },
        (success, errorType) => {
          if (!success) console.log(`Print failed: ${errorType}`);
          printWindow.close();
        }
      );
    });
    return (event.returnValue = new ApiResponse(
      200,
      null,
      "Invoice Generated"
    ));
  },
});

export const invoiceListHandler = asynchandler({
  fn: async (event, data) => {
    const dataValidation = customerListControllerValidator.safeParse(data);
    if (!dataValidation.success)
      return (event.returnValue = new ApiError(400, "Invalid Data"));

    const { page, pageSize } = dataValidation.data;
    const offset = (page - 1) * pageSize;

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where: { status: "success" },
      include: [
        { model: Customer, as: "customer" },
        {
          model: Product,
          as: "invoiceProducts",
          through: { attributes: ["quantity", "price", "units"] },
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [["createdAt", "DESC"]],
      distinct: true,
      raw: false,
      subQuery: false,
      nest: true,
    });
    const invoicesWithProducts = invoices.map((invoice: any) => {
      const plainInvoice = invoice.toJSON();

      return {
        ...plainInvoice,
        products: plainInvoice.invoiceProducts.map((product: any) => ({
          productId: product.productId,
          name: product.name,
          description: product.description,
          image: product.image,
          measurement: product.measurement,
          quantity: product.InvoiceProduct.quantity,
          price: product.InvoiceProduct.price,
        })),
      };
    });

    const totalPages = Math.ceil(count / pageSize);
    return (event.returnValue = new ApiResponse(
      200,
      {
        data: invoicesWithProducts,
        pagination: {
          totalItems: count,
          currentPage: page,
          pageSize: pageSize,
          totalPages: totalPages,
        },
      },
      "Invoices Fetched"
    ));
  },
});

export const invoiceAnalytics = asynchandler({
  fn: async (event) => {
    const [
      cashInvoiceCount,
      invoiceCount,
      totalCashReceived,
      monthlyInvoiceData,
    ] = await Promise.all([
      CashInvoice.count(),
      Invoice.count(),
      CashInvoice.sum("amount"),
      Invoice.findAll({
        attributes: [
          [Sequelize.literal(`strftime('%Y-%m', date)`), "month"],
          [Sequelize.fn("SUM", Sequelize.col("castAmount")), "total"],
        ],
        group: [
          Sequelize.literal(`strftime('%Y-%m', date)`),
        ] as unknown as string[], // Cast Literal to string[]
        order: [[Sequelize.literal(`strftime('%Y-%m', date)`), "ASC"]],
        raw: true,
      }) as unknown as { month: string; total: number }[],
    ]);

    const formattedMonthlyData = monthlyInvoiceData.map((item) => ({
      name: new Date(`${item.month}-01`).toLocaleString("en-US", {
        month: "short",
      }),
      total: item.total,
    }));

    event.returnValue = new ApiResponse(
      200,
      {
        cashInvoiceCount,
        invoiceCount,
        totalCashReceived,
        monthlyInvoiceData: formattedMonthlyData,
      },
      "Analytics fetched successfully"
    );
  },
});

export const invoiceSuccessUpdateHandler = asynchandler({
  fn: async (event, data, win) => {
    const dataValidation = removeCustomerControllerValidator.safeParse(data);
    if (!dataValidation.success)
      return (event.returnValue = new ApiError(400, "Invalid Data"));
    const invoice = await Invoice.update(
      { status: "success" },
      { where: { id: dataValidation.data.id } }
    );

    if (!invoice[0])
      return (event.returnValue = new ApiError(404, "Invoice not found"));
    const invoiceProducts = await InvoiceProduct.findAll({
      where: { invoiceId: dataValidation.data.id },
    });
    for (const item of invoiceProducts) {
      const product = await Product.findByPk(item.productId);
      if (!product) continue;

      const newStock = product.dataValues.stock - item.quantity;
      await Product.update(
        { stock: newStock },
        { where: { id: product.dataValues.id } }
      );
      if (newStock < 10 && win) {
        win.webContents.send("low-stock-warning", {
          productId: product.dataValues.id,
          name: product.dataValues.name,
          remaining: newStock,
        });
      }
    }

    event.returnValue = new ApiResponse(
      200,
      null,
      "Invoice Updated Successfully"
    );
  },
});

export const removeInvoiceHandler = asynchandler({
  fn: async (event, data) => {
    const dataValidation = removeCustomerControllerValidator.safeParse(data);
    if (!dataValidation.success)
      return (event.returnValue = new ApiError(400, "Invalid Data"));
    await Invoice.destroy({
      where: {
        id: dataValidation.data.id,
      },
    });
    return (event.returnValue = new ApiResponse(200, null, "Invoice Deleted"));
  },
});

export const updateInvoiceHandler = asynchandler({
  fn: async (event, data, win) => {
    const dataValidation = updateInvoiceControllerValidator.safeParse(data);
    if (!dataValidation.success)
      return (event.returnValue = new ApiError(400, "Invalid Data"));

    const { id, products, status, ...updateData } = dataValidation.data;

    const invoice = await Invoice.findByPk(id);
    if (!invoice)
      return (event.returnValue = new ApiError(404, "Invoice not found"));

    await invoice.update({
      ...updateData,
      status, // ✅ include status update here
    });

    // Only adjust stock if invoice is marked as success
    if (status === "success") {
      for (const item of products) {
        const product = await Product.findByPk(item.productId);
        if (!product) continue;

        const newStock = product.dataValues.stock - item.quantity;

        await Product.update(
          { stock: newStock },
          { where: { id: product.dataValues.id } }
        );

        if (newStock < 10 && win) {
          win.webContents.send("low-stock-warning", {
            productId: product.dataValues.id,
            name: product.dataValues.name,
            remaining: newStock,
          });
        }
      }
    }

    await InvoiceProduct.destroy({ where: { invoiceId: id } });
    for (const item of products) {
      await InvoiceProduct.create({
        invoiceId: id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        units: item.units,
      });
    }

    return (event.returnValue = new ApiResponse(
      200,
      invoice,
      "Invoice Updated"
    ));
  },
});

export const draftInvoiceListHandler = asynchandler({
  fn: async (event, data) => {
    const dataValidation = customerListControllerValidator.safeParse(data);
    if (!dataValidation.success)
      return (event.returnValue = new ApiError(400, "Invalid Data"));

    const { page, pageSize } = dataValidation.data;
    const offset = (page - 1) * pageSize;

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where: { status: "hold" },
      include: [
        { model: Customer, as: "customer" },
        {
          model: Product,
          as: "invoiceProducts",
          through: { attributes: ["quantity", "price", "units"] },
        },
      ],
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
      distinct: true,
      raw: false,
      subQuery: false,
      nest: true,
    });

    const invoicesWithProducts = invoices.map((invoice: any) => {
      const plainInvoice = invoice.toJSON();

      return {
        ...plainInvoice,
        products: plainInvoice.invoiceProducts.map((product: any) => ({
          productId: product.productId,
          name: product.name,
          description: product.description,
          image: product.image,
          measurement: product.measurement,
          quantity: product.InvoiceProduct.quantity,
          price: product.InvoiceProduct.price,
        })),
      };
    });

    const totalPages = Math.ceil(count / pageSize);
    return (event.returnValue = new ApiResponse(
      200,
      {
        data: invoicesWithProducts,
        pagination: {
          totalItems: count,
          currentPage: page,
          pageSize,
          totalPages,
        },
      },
      "Draft Invoices Fetched"
    ));
  },
});
