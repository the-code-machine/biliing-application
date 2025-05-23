import { z } from "zod";


export const insertProductControllerValidator = z.object({
    companyId: z.number({
        message: "Company is required"
    }),
    name: z.string({
        message: "Name is required"
    }),
    description: z.string({
        message: "description is required"
    }).optional(),
    image: z.object({
        name: z.string({
            message: "Name is required"
        }),
        buffer: z.any({
            message: "Buffer is required"
        })
    }).optional(),
    measurement: z.string({
        message: "Measurement is required"
    })
});


export const updateProductControllerValidator = z.object({
    id: z.number({
        message: "Id is required"
    }),
    companyId: z.number({
        message: "Company is required"
    }),
    name: z.string({
        message: "Name is required"
    }),
    description: z.string({
        message: "description is required"
    }),
    measurement: z.string({
        message: "Measurement is required"
    })
})

export const productCheckControllerValidator = z.object({
    name: z.string({
        message: "Product Name is required"
    }),
    companyId: z.number({
        message: "Company Id is required"
    })
})