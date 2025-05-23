import { z } from "zod";


export const insertCustomerControllerValidator = z.object({
    name: z.string({
        message: "Name is required"
    }),
    mobileNumber: z.string({
        message: "Mobile number is required"
    }),
    address: z.string({
        message: "Address is required"
    }),
});

export const customerListControllerValidator = z.object({
    page: z.number({
        message: "Page is required"
    }),
    pageSize: z.number({
        message: "Pagesize is required"
    })
});


export const updateCustomerControllerValidator = z.object({
    id: z.number({
        message: "Id is required"
    }),
    name: z.string({
        message: "Name is required"
    }),
    mobileNumber: z.string({
        message: "Mobile number is required"
    }),
    address: z.string({
        message: "Address is required"
    }),
});


export const removeCustomerControllerValidator = z.object({
    id: z.number({
        message: "Id is required"
    }),
})