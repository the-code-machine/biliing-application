import schedule from 'node-schedule';
import { CashInvoice } from "../models/cashinvoice.model";
import { Customer } from "../models/customer.model";
import { ApiError, ApiResponse, asynchandler } from "../utils/apihandler";
import { cashInvoiceListValidator, insertCashInvoiceControllerValidator, updateCashInvoiceControllerValidator } from "../validators/cashinvoice.validator";
import { removeCustomerControllerValidator } from '../validators/customer.validator';


export const insertCashInvoiceHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = insertCashInvoiceControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        const deletionDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const invoice = await CashInvoice.create(dataValidation.data);
        schedule.scheduleJob("cash-invoice-job", deletionDate, async () => {
            await CashInvoice.destroy({
                where: {
                    id: invoice.dataValues.id
                }
            })
        })
        return event.returnValue = new ApiResponse(200, null, "Cash Inoice Created");
    }
});

export const cashInvoiceListHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = cashInvoiceListValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        const { page = 1, pageSize = 10 } = data;
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        const { rows: invoices, count: totalItems } = await CashInvoice.findAndCountAll({
            include: [{ model: Customer, as: 'customer' }],
            offset,
            limit,
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true
        });
        const totalPages = Math.ceil(totalItems / pageSize);
        return event.returnValue = new ApiResponse(200, {
            invoices,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                pageSize,
            },
        }, "Invoices retrieved successfully");
    }
});


export const removeCashInvoiceHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = removeCustomerControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        await CashInvoice.destroy({
            where: {
                id: dataValidation.data.id
            }
        });
        return event.returnValue = new ApiResponse(200, null, "Cash Invoice Deleted");
    }
})


export const updateCashInvoiceHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = updateCashInvoiceControllerValidator.safeParse(data);
        if (!dataValidation.success) {
            return event.returnValue = new ApiError(400, "Invalid Data");
        }

        const { id, ...updateData } = dataValidation.data;
        const invoice = await CashInvoice.findByPk(id);

        if (!invoice) {
            return event.returnValue = new ApiError(404, "Invoice not found");
        }

        await invoice.update(updateData);
        return event.returnValue = new ApiResponse(200, invoice, "Cash Invoice Updated");
    }
});
