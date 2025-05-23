import { app } from 'electron';
import fs from 'fs';
import path from 'node:path';
import { Company } from '../models/company.model';
import { Product } from '../models/product.model';
import { ApiError, ApiResponse, asynchandler } from "../utils/apihandler";
import { customerListControllerValidator, removeCustomerControllerValidator } from '../validators/customer.validator';
import { insertProductControllerValidator, productCheckControllerValidator, updateProductControllerValidator } from "../validators/product.validator";


export const insertProductHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = insertProductControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        const { image, ...productData } = dataValidation.data;
        let imagePath = "";
        if (image) {
            const imageDir = path.join(app.getPath('userData'), 'uploads', 'images');
            await fs.promises.mkdir(imageDir, { recursive: true });

            imagePath = path.join(imageDir, image.name);
            await fs.promises.writeFile(imagePath, Buffer.from(image.buffer));
        }

        await Product.create({ ...productData, image: imagePath });

        return event.returnValue = new ApiResponse(200, null, "Product Created");
    }
});


export const productListHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = customerListControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        const offset = (dataValidation.data.page - 1) * dataValidation.data.pageSize;
        const { count, rows: products } = await Product.findAndCountAll({
            include: [{ model: Company, as: 'company' }],
            limit: dataValidation.data.pageSize,
            offset: offset,
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true
        });
        const totalPages = Math.ceil(count / dataValidation.data.pageSize);
        return event.returnValue = new ApiResponse(200, {
            data: products,
            pagination: {
                totalItems: count,
                currentPage: dataValidation.data.page,
                pageSize: dataValidation.data.pageSize,
                totalPages: totalPages,
            },
        }, "Products Fetched");
    }
})


export const updateProductHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = updateProductControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        const product = await Product.findByPk(dataValidation.data.id);
        if (!product)
            return event.returnValue = new ApiError(404, "Product not found");
        await product.update(dataValidation.data);
        return event.returnValue = new ApiResponse(200, null, "Product Updated");
    }
})

export const removeProductHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = removeCustomerControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        await Product.destroy({
            where: {
                id: dataValidation.data.id
            }
        });
        return event.returnValue = new ApiResponse(200, null, "Product Deleted");
    }
})

export const productCheckHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = productCheckControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        const product = await Product.findOne({
            where: {
                name: dataValidation.data.name,
                companyId: dataValidation.data.companyId

            }
        });
        return event.returnValue = new ApiResponse(200, {
            status: product ? false : true,
        }, "Sucess")
    }
})