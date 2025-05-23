import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
import { Customer } from "./customer.model";

export class CashInvoice extends Model {}

CashInvoice.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Customer,
                key: 'id',
            },
        },
        date:{
            type:DataTypes.DATE,allowNull:false
        },
        amount:{
            type:DataTypes.FLOAT,allowNull:false
        }
    },
    { sequelize, modelName: "cash_invoice", timestamps: true }
);

