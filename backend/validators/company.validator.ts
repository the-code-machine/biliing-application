import { z } from "zod";

export const insertCompanyControllerValidator=z.object({
    name:z.string({
        message:"Name is required"
    }),
    description:z.string().optional(),
    status:z.boolean().default(true)
})

export const updateCompanyControllerValidator=z.object({
    id:z.number({
        message:"Id is required"
    }),
    name:z.string({
        message:"Name is required"
    }),
    description:z.string().optional(),
    status:z.boolean().default(true)
});

export const companyCheckControllerValidator=z.object({
    name:z.string({
        message:"Product Name is required"
    })
})

