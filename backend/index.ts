import { ipcMain } from "electron";
import { app, BrowserWindow } from "electron/main";
import { join } from "node:path";
import {
  cashInvoiceListHandler,
  insertCashInvoiceHandler,
  removeCashInvoiceHandler,
  updateCashInvoiceHandler,
} from "./controllers/cashinvoice.controller";
import {
  companyCheckHandler,
  companyListHandler,
  insertCompanyHandler,
  removeCompanyHandler,
  updateCompanyHandler,
} from "./controllers/company.controller";
import {
  customerListHandler,
  insertCustomerHandler,
  removeCustomerHandler,
  updateCustomerHandler,
} from "./controllers/customer.controller";
import {
  insernteryTransectionListHandler,
  insertInventeryTransectionHandler,
  removeStockHandler,
} from "./controllers/inventerytransection.controller";
import {
  generatePDFInvoiceHandler,
  insertInvoiceHandler,
  invoiceAnalytics,
  invoiceListHandler,
  invoiceSuccessUpdateHandler,
  removeInvoiceHandler,
  updateInvoiceHandler,
  draftInvoiceListHandler,
} from "./controllers/invoice.controller";
import {
  insertProductHandler,
  productCheckHandler,
  productListHandler,
  removeProductHandler,
  updateProductHandler,
} from "./controllers/product.controller";
import { loginController } from "./controllers/user.controller";
import { sequelize } from "./database";
import "./models/index";
import { User } from "./models/user.model";
import { isDev } from "./utils/env";
import { initLogs } from "./utils/initLogs";
import { prepareNext } from "./utils/prepareNext";
let win: BrowserWindow;
function createWindow(): void {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:4444/");
    win.webContents.openDevTools();
    win.maximize();
  } else {
    win.loadFile(join(__dirname, "..", "frontend", "out", "index.html"));
    win.setMenu(null);
  }
}

app.whenReady().then(async () => {
  await prepareNext("./frontend", 4444);

  await initLogs();

  await sequelize.sync({
    logging: false,
    alter: true,
    force: false,
  });
  const userCount = await User.count();
  if (!userCount)
    await User.create({
      name: "Default User",
      email: "admin@gmail.com",
      password: "jo230i349",
    });
  console.log("Database synced");

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("insert-company", insertCompanyHandler);
ipcMain.on("company-list", companyListHandler);
ipcMain.on("update-company", updateCompanyHandler);
ipcMain.on("insert-product", insertProductHandler);
ipcMain.on("update-product", updateProductHandler);
ipcMain.on("product-list", productListHandler);
ipcMain.on("insert-invoice", (event, data) =>
  insertInvoiceHandler(event, data, win)
);
ipcMain.on("insert-customer", insertCustomerHandler);
ipcMain.on("customer-list", customerListHandler);
ipcMain.on("generate-pdf", generatePDFInvoiceHandler);
ipcMain.on("insert-cash-invoice", insertCashInvoiceHandler);
ipcMain.on("cash-invoice-list", cashInvoiceListHandler);
ipcMain.on("stock-list", insernteryTransectionListHandler);
ipcMain.on("insert-stock", insertInventeryTransectionHandler);
ipcMain.on("invoice-list", invoiceListHandler);
ipcMain.on("invoice-analytics", invoiceAnalytics);
ipcMain.on("update-customer", updateCustomerHandler);
ipcMain.on("remove-customer", removeCustomerHandler);
ipcMain.on("remove-company", removeCompanyHandler);
ipcMain.on("remove-product", removeProductHandler);
ipcMain.on("product-check", productCheckHandler);
ipcMain.on("company-check", companyCheckHandler);
ipcMain.on("user-login", loginController);
ipcMain.on("remove-invoice", removeInvoiceHandler);
ipcMain.on("remove-cash-invoice", removeCashInvoiceHandler);
ipcMain.on("remove-stock", removeStockHandler);
ipcMain.on("update-cash-invoice", updateCashInvoiceHandler);
ipcMain.on("update-invoice", updateInvoiceHandler);
ipcMain.on("draft-invoice-list", draftInvoiceListHandler);
ipcMain.on("invoice-success", (event, data) =>
  invoiceSuccessUpdateHandler(event, data, win)
);
