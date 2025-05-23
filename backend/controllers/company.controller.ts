import { Company } from "../models/company.model";
import { ApiError, ApiResponse, asynchandler } from "../utils/apihandler";
import { companyCheckControllerValidator, insertCompanyControllerValidator, updateCompanyControllerValidator } from "../validators/company.validator";
import { customerListControllerValidator, removeCustomerControllerValidator } from "../validators/customer.validator";


export const insertCompanyHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = insertCompanyControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data")
        await Company.create(dataValidation.data);
        return event.returnValue = new ApiResponse(201, null, "Company Inserted")
    }
})

export const companyListHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = customerListControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");

        const offset = (dataValidation.data.page - 1) * dataValidation.data.pageSize;
        const { count, rows: companies } = await Company.findAndCountAll({
            limit: dataValidation.data.pageSize,
            offset: offset,
            order: [['createdAt', 'DESC']],
            raw: true,
            nest: true
        });

        const totalPages = Math.ceil(count / dataValidation.data.pageSize);
        return event.returnValue = new ApiResponse(200, {
            data: companies,
            pagination: {
                totalItems: count,
                currentPage: dataValidation.data.page,
                pageSize: dataValidation.data.pageSize,
                totalPages: totalPages,
            },
        }, "Companies Fetched");
    }
});

export const updateCompanyHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = updateCompanyControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data")
        await Company.update(dataValidation.data, {
            where: {
                id: dataValidation.data.id
            }
        })
        return event.returnValue = new ApiResponse(200, null, "Company Updated");

    }
})

export const removeCompanyHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = removeCustomerControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        await Company.destroy({
            where: {
                id: dataValidation.data.id
            }
        });
        return event.returnValue = new ApiResponse(200, null, "Company Deleted");
    }
});


export const companyCheckHandler = asynchandler({
    fn: async (event, data) => {
        const dataValidation = companyCheckControllerValidator.safeParse(data);
        if (!dataValidation.success)
            return event.returnValue = new ApiError(400, "Invalid Data");
        const product = await Company.findOne({
            where: {
                name: dataValidation.data.name
            }
        });
        return event.returnValue = new ApiResponse(200, {
            status: product ? false : true,
        }, "Sucess")
    }
})