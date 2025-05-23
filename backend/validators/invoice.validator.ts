import { z } from "zod";

export const insertInvoiceControllerValidator = z.object({
  customerId: z.number({
    message: "Customer Id is required",
  }),
  products: z.array(
    z.object({
      productId: z.number({
        message: "Product Id is required",
      }),
      price: z.number({
        message: "Price is required",
      }),
      quantity: z.number({
        message: "Quantity is required",
      }),
      units: z.string({
        message: "Units are required",
      }),
    })
  ),
  hammali: z.number({
    message: "Hemmali is required",
  }),
  freight: z.number({
    message: "Freight is required",
  }),
  castAmount: z.number({
    message: "Cash reviced is required",
  }),
  remark: z.string().optional(),
  date: z.date({
    message: "Date is required",
  }),
  status: z.enum(["success", "hold"]),
});
export const updateInvoiceControllerValidator = z.object({
  id: z.number(),
  customerId: z.number({
    message: "Customer Id is required",
  }),
  products: z.array(
    z.object({
      productId: z.number({
        message: "Product Id is required",
      }),
      price: z.number({
        message: "Price is required",
      }),
      quantity: z.number({
        message: "Quantity is required",
      }),
      units: z.string({
        message: "Units are required",
      }),
    })
  ),
  hammali: z.number({
    message: "Hemmali is required",
  }),
  freight: z.number({
    message: "Freight is required",
  }),
  castAmount: z.number({
    message: "Cash reviced is required",
  }),
  remark: z.string().optional(),
  date: z.date({
    message: "Date is required",
  }),
  status: z.enum(["success", "hold"]),
});

export const generatePDFInvoiceControllerValidator = z.object({
  content: z.string({
    message: "Content is required",
  }),
});
