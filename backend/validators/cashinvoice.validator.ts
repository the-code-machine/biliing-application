import { z } from "zod";


export const insertCashInvoiceControllerValidator = z.object({
    customerId: z.number({
        message: "Customer Id is required"
    }),
    date: z.date({
        message: "Date is required"
    }),
    amount: z.number({
        message: "Amount is required"
    })
});

export const updateCashInvoiceControllerValidator=z.object({
    customerId: z.number({
        message: "Customer Id is required"
    }),
    date: z.date({
        message: "Date is required"
    }),
    amount: z.number({
        message: "Amount is required"
    }),
    id:z.number()
})

export const cashInvoiceListValidator=z.object({
    page:z.number().optional(),
    pageSize:z.number().optional()
})