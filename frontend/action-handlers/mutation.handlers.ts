import {
  CashInvoiceFormType,
  CompanyFormType,
  CustomerFromType,
  InvoiceFormType,
  LoginFormType,
  ProductFormType,
  StockFormType,
  UpdateProductFormType,
} from "@/utils/form-types.utils";

export const inserCompanyMutationHandler = async (data: CompanyFormType) => {
  const response = await global.api.sendSync("insert-company", data);
  return response;
};

export const updateCompanyMutationHandler = async (
  data: CompanyFormType & { id: number; status: boolean }
) => {
  console.log({
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
  });
  const response = await global.api.sendSync("update-company", {
    id: data.id,
    name: data.name,
    description: data.description || "",
    status: data.status,
  });
  return response;
};

export const insertProductMutationHandler = async (
  data: ProductFormType & {
    image:
      | {
          name: string;
          buffer: Buffer;
        }
      | undefined;
  }
) => {
  const response = await global.api.sendSync("insert-product", {
    ...data,
    companyId: data.companyId.id,
  });
  return response;
};
export const updateProductMutationHandler = async (
  data: UpdateProductFormType & {
    status?: boolean;
    id: number;
  }
) => {
  const response = await global.api.sendSync("update-product", {
    ...data,
    status: data.status ? data.status : true,
    companyId: data.companyId?.id,
  });
  return response;
};

export const insertCustomerMutationHandler = async (data: CustomerFromType) => {
  const response = await global.api.sendSync("insert-customer", data);
};

export const insertCashInvoiceHandler = async (data: CashInvoiceFormType) => {
  const response = await global.api.sendSync("insert-cash-invoice", {
    customerId: data.customerId.id,
    date: data.dateFrom,
    amount: data.cashAmount,
  });
};

export const generatePDFInoviceHandler = async (content: string) => {
  const response = await global.api.sendSync("generate-pdf", {
    content: content,
  });
};

export const insertStockMutationHandler = async (data: StockFormType) => {
  const response = await global.api.sendSync("insert-stock", {
    productId: data.product.id,
    quantity: data.quantity,
    purchasePrice: data.price,
    remainingQuantity: data.quantity,
  });
  return response;
};

export const updateCustomerMutationHandler = async (
  data: CustomerFromType & {
    id: number;
  }
) => {
  const response = await global.api.sendSync("update-customer", data);
};
export const removeCustomerMutationHandler = async (data: { id: number }) => {
  const response = await global.api.sendSync("remove-customer", data);
};

export const insertInvoiceHandler = async (data: InvoiceFormType) => {
  const response = await global.api.sendSync("insert-invoice", {
    customerId: data.customerId.id,
    products: data.products.map((product) => ({
      productId: product.productId,
      price: product.rate,
      quantity: product.qty,
      units: product.units,
    })),
    hammali: data.hammali,
    freight: data.freight,
    castAmount: data.caseAmount,
    remark: data.remark,
    date: data.date,
    status: data.status,
  });

  return response;
};

export const removeCompanyMutationHandler = async (id: number) => {
  const response = await global.api.sendSync("remove-company", {
    id: id,
  });
  return response;
};
export const removeProductMutationHandler = async (id: number) => {
  const response = await global.api.sendSync("remove-product", {
    id: id,
  });
  return response;
};

export const loginMutationHandler = async (data: LoginFormType) => {
  const response = await global.api.sendSync("user-login", data);
  return response;
};

export const updateInvoiceStatusMutation = async (id: number) => {
  const response = await global.api.sendSync("invoice-success", {
    id: id,
  });
  return response;
};

export const removeCashInvoiceMutationHandler = async (data: {
  id: number;
}) => {
  const response = await global.api.sendSync("remove-cash-invoice", data);
};
export const removeInvoiceMutationHandler = async (data: { id: number }) => {
  const response = await global.api.sendSync("remove-invoice", data);
};

export const removeSotckmutationHandler = async (id: number) => {
  const response = await global.api.sendSync("remove-stock", {
    id: id,
  });
  return response;
};

export const updateCashInvoiceHandler = async (
  data: CashInvoiceFormType & { id: number }
) => {
  const response = await global.api.sendSync("update-cash-invoice", {
    customerId: data.customerId.id,
    date: data.dateFrom,
    amount: data.cashAmount,
    id: data.id,
  });
  console.log({
    customerId: data.customerId.id,
    date: data.dateFrom,
    amount: data.cashAmount,
    id: data.id,
  });
};

export const updateInvoiceHandler = async (
  data: InvoiceFormType & { id: number }
) => {
  const response = await global.api.sendSync("update-invoice", {
    customerId: data.customerId.id,
    products: data.products.map((product) => ({
      productId: product.productId,
      price: product.rate,
      quantity: product.qty,
      units: product.units,
    })),
    hammali: data.hammali,
    freight: data.freight,
    castAmount: data.caseAmount,
    remark: data.remark,
    date: data.date,
    status: data.status,
    id: data.id,
  });
  console.log(response);
  return response;
};
