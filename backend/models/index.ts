import { CashInvoice } from './cashinvoice.model';
import { Company } from './company.model';
import { Customer } from './customer.model';
import { InventoryTransaction } from './inventerytransection.model';
import { Invoice } from './invoice.model';
import { InvoiceProduct } from './invoiceproduct.model';
import { Product } from './product.model';





Company.hasMany(Product, { foreignKey: 'companyId', as: 'products' });
Product.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });


Invoice.belongsToMany(Product, { through: InvoiceProduct, as: 'invoiceProducts',foreignKey:"invoiceId" });
Product.belongsToMany(Invoice, { through: InvoiceProduct, as: 'productInvoices',foreignKey:"productId" });


Customer.hasMany(CashInvoice, { foreignKey: 'customerId', as: 'cashInvoices' });
CashInvoice.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });


Customer.hasMany(Invoice, { foreignKey: 'customerId', as: 'invoices' });
Invoice.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });


Product.hasMany(InventoryTransaction, { foreignKey: 'productId', as: 'inventoryTransactions' });
InventoryTransaction.belongsTo(Product, { foreignKey: 'productId', as: 'product' });


