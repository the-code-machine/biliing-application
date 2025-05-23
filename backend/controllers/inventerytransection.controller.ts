import { sequelize } from "../database";
import { Company } from "../models/company.model";
import { InventoryTransaction } from "../models/inventerytransection.model";
import { Product } from "../models/product.model";
import { ApiError, ApiResponse, asynchandler } from "../utils/apihandler";
import { customerListControllerValidator, removeCustomerControllerValidator } from "../validators/customer.validator";
import { insertInventeryTransectionControllerValidator } from "../validators/inventerytransection.model";

export const insertInventeryTransectionHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = insertInventeryTransectionControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        await InventoryTransaction.create(dataValidation.data);
        await Product.update(
            {
                stock: sequelize.literal(`stock + ${dataValidation.data.quantity}`)
            },
            {
                where: {
                    id: dataValidation.data.productId
                }
            }
        );
        return event.returnValue = new ApiResponse(201, null, "Sucess");
    }
})

export const insernteryTransectionListHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = customerListControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        const offset = (dataValidation.data.page - 1) * dataValidation.data.pageSize;
        const { count, rows: inventery } = await InventoryTransaction.findAndCountAll({
            include: [{ model: Product, as: 'product', include: [{ model: Company, as: 'company' }] }],
            limit: dataValidation.data.pageSize,
            offset: offset,
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true
        });
        const totalPages = Math.ceil(count / dataValidation.data.pageSize);
        return event.returnValue = new ApiResponse(200, {
            data: inventery,
            pagination: {
                totalItems: count,
                currentPage: dataValidation.data.page,
                pageSize: dataValidation.data.pageSize,
                totalPages: totalPages,
            },
        }, "Inventery Fetched");
    }
})

export const removeStockHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = removeCustomerControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        await InventoryTransaction.destroy({
            where: {
                id: dataValidation.data.id
            }
        });
        return event.returnValue = new ApiResponse(200, null, "Stock Deleted");
    }
})
