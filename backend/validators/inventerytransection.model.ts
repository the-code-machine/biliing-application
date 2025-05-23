import { z } from "zod";


export const insertInventeryTransectionControllerValidator=z.object({
    productId:z.number({
        message:"Product Id is required"
    }),
    quantity:z.number({
        message:"Quantity is required"
    }),
    remainingQuantity:z.number().optional(),
    purchasePrice:z.number({
        message:"Price is required"
    }),
    type:z.enum(["IN","OUT"]).default("IN"),
})