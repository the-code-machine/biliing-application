import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
import { Product } from "./product.model";

export class InventoryTransaction extends Model {
    public id!: number;
    public productId!: number;
    public quantity!: number;
    public remainingQuantity!: number;
    public purchasePrice!: number; 
    public type!: 'IN' | 'OUT';
    public createdAt!: Date;
  }
  
  InventoryTransaction.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Product, key: 'id' },
      },
      quantity: { type: DataTypes.FLOAT, allowNull: false },
      remainingQuantity: { type: DataTypes.FLOAT, allowNull: false }, 
      purchasePrice: { type: DataTypes.FLOAT, allowNull: false },
      type: {
        type: DataTypes.ENUM('IN', 'OUT'),
        allowNull: false,
      },
    },
    { sequelize, modelName: 'inventory_transaction', timestamps: true }
  );
  