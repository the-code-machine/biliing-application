import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export class Company extends Model {
    public id!: number;
    public name!: string;
    public price!: number;
}

Company.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false,unique:true },
        description: { type: DataTypes.STRING, allowNull: true },
        status:{type:DataTypes.BOOLEAN,defaultValue:true}
    },
    { sequelize, modelName: "company", timestamps: true }
);

