import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
import { Invoice } from "./invoice.model";
import { Product } from "./product.model";

export class InvoiceProduct extends Model {
  public invoiceId!: number;
  public productId!: number;
  public quantity!: number;
  public price!: number;
}

InvoiceProduct.init(
  {
    invoiceId: {
      type: DataTypes.INTEGER,
      references: {
        model: Invoice,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    units:{
      type:DataTypes.STRING,
      allowNull:false
    }
  },
  {
    sequelize,
    modelName: "InvoiceProduct",
    timestamps: false,
  }
);

