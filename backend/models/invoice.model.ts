import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
import { Customer } from "./customer.model";

export class Invoice extends Model {
    public id!: number;
    public customerId!: number;
    public castAmount!: number;
    public remark?: string;
    public status!: "hold" | "success";
}

Invoice.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Customer,
                key: "id",
            },
        },
        castAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("hold", "success"),
            defaultValue: "success",
        },
        hammali:{
            type:DataTypes.FLOAT,
            allowNull:false
        },
        freight:{
            type:DataTypes.FLOAT,
            allowNull:false
        },
        date:{
            type:DataTypes.DATE,
            allowNull:false
        }
    },
    {
        sequelize,
        modelName: "invoice",
        timestamps: true,
    }
);


