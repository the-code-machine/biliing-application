export const companyListQueryHandler = async ({ pageParam = 1 }) => {
  const response = await global.api.sendSync("company-list", {
    page: pageParam,
    pageSize: 10,
  });
  return response.data;
};
export const productListQueryHandler = async () => {
  const response = await global.api.sendSync("product-list");
  return response.data;
};

export const customerListQueryHandler = async ({ pageParam = 1 }) => {
  const response = await global.api.sendSync("customer-list", {
    page: pageParam,
    pageSize: 10,
  });
  return response.data;
};
export const productListPaginationQueryHandler = async ({ pageParam = 1 }) => {
  const response = await global.api.sendSync("product-list", {
    page: pageParam,
    pageSize: 10,
  });
  return response.data;
};
export const cashInvoicePaginationQueryHandler = async ({ pageParam = 1 }) => {
  const response = await global.api.sendSync("cash-invoice-list", {
    page: pageParam,
    pageSize: 10,
  });
  return response.data;
};

export const stockPaginationQueryHandler = async ({ pageParam = 1 }) => {
  const response = await global.api.sendSync("stock-list", {
    page: pageParam,
    pageSize: 10,
  });
  return response.data;
};

export const invoiceListQueryHandler = async ({ pageParam = 1 }) => {
  const response = await global.api.sendSync("invoice-list", {
    page: pageParam,
    pageSize: 10,
  });
  return response.data;
};
export const draftInvoiceListQueryHandler = async ({ pageParam = 1 }) => {
  const response = await global.api.sendSync("draft-invoice-list", {
    page: pageParam,
    pageSize: 10,
  });
  return response.data;
};

export const analyticsQueryHandler = async () => {
  const response = await global.api.sendSync("invoice-analytics");
  console.log(response.data);
  return response.data;
};
