import { Customer } from "../models/customer.model";
import { ApiError, ApiResponse, asynchandler } from "../utils/apihandler";
import { customerListControllerValidator, insertCustomerControllerValidator, removeCustomerControllerValidator, updateCustomerControllerValidator } from "../validators/customer.validator";


export const insertCustomerHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = insertCustomerControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        await Customer.create(dataValidation.data);
        return event.returnValue = new ApiResponse(201, null, "Sucess")
    }
})

export const customerListHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = customerListControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        const offset = (dataValidation.data.page - 1) * dataValidation.data.pageSize;
        const { count, rows: customers } = await Customer.findAndCountAll({
            limit: dataValidation.data.pageSize,
            offset: offset,
            order: [['createdAt', 'DESC']],
            raw: true
        });
        const totalPages = Math.ceil(count / dataValidation.data.pageSize);
        return event.returnValue = new ApiResponse(200, {
            data: customers,
            pagination: {
                totalItems: count,
                currentPage: dataValidation.data.page,
                pageSize: dataValidation.data.pageSize,
                totalPages: totalPages,
            },
        }, "Customer(s) Fetched");
    }
})


export const updateCustomerHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = updateCustomerControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        await Customer.update(dataValidation.data, {
            where: {
                id: dataValidation.data.id
            }
        });
        return event.returnValue = new ApiResponse(200, null, "Customer Updated");
    }
});


export const removeCustomerHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = removeCustomerControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        await Customer.destroy({
            where: {
                id: dataValidation.data.id
            }
        });
        return event.returnValue = new ApiResponse(200, null, "Customer Deleted");
    }
})