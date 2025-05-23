import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Company } from './company.model';

export class Product extends Model {
  public id!: number;
  public name!: string;
  public stock!: number;
  public companyId!: number;
}

Product.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: false },
    measurement: { type: DataTypes.STRING, allowNull: false },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
        key: 'id',
      },
    },
    stock:{
      type:DataTypes.FLOAT,defaultValue:0,
    }
  },
  { sequelize, modelName: 'product', timestamps: true }
);


