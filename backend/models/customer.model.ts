import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export class Customer extends Model {}

Customer.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: true },
        status:{type:DataTypes.BOOLEAN,defaultValue:true},
        mobileNumber:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },

    },
    { sequelize, modelName: "customer", timestamps: true }
);

