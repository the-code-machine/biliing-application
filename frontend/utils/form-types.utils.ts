import { isPossiblePhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export const CompanyForm = z.object({
  name: z
    .string({
      message: "Name is required",
    })
    .refine(
      async (name) => {
        const response = await global.api.sendSync("company-check", {
          name: name,
        });
        return response.data?.status;
      },
      {
        message: "Company Already Exists",
      }
    ),
  description: z.string().optional(),
});

export type CompanyFormType = z.infer<typeof CompanyForm>;

export const ProductForm = z
  .object({
    companyId: z.object(
      {
        id: z.number({
          message: "Company is required",
        }),
        name: z.string({
          message: "Name is required",
        }),
      },
      {
        message: "Company is required",
      }
    ),
    name: z.string({
      message: "Name is required",
    }),
    description: z
      .string({
        message: "description is required",
      })
      .optional(),
    image: z.any().optional(),
    measurement: z.string({
      message: "Measurement is required",
    }),
  })
  .superRefine(async (data, ctx) => {
    const response = await global.api.sendSync("product-check", {
      name: data.name,
      companyId: data.companyId.id,
    });
    if (!response.data?.status)
      ctx.addIssue({
        path: ["name"],
        message: "Product Already Exists",
        code: "custom",
      });
  });

export type ProductFormType = z.infer<typeof ProductForm>;

export const UpdateProductFormSchema = z.object({
  companyId: z.object({
    id: z.number({
      message: "Company is required",
    }),
    name: z.string({
      message: "Name is required",
    }),
  }),
  name: z.string({
    message: "Name is required",
  }),
  description: z
    .string({
      message: "description is required",
    })
    .optional(),
  measurement: z.string({
    message: "Measurement is required",
  }),
});

export type UpdateProductFormType = z.infer<typeof UpdateProductFormSchema>;

export const CustomerFrom = z.object({
  name: z.string({
    message: "Name is required",
  }),
  mobileNumber: z
    .string({
      message: "Mobile number is required",
    })
    .refine((val) => isPossiblePhoneNumber(val), {
      message: "Invalid Phone Number",
    }),
  address: z.string({
    message: "Address is required",
  }),
});

export type CustomerFromType = z.infer<typeof CustomerFrom>;

export const InvoiceForm = z.object({
  customerId: z.object({
    name: z.string(),
    id: z.number(),
    phoneNumber: z.string({
      message: "Phone Number is required",
    }),
    address: z.string({
      message: "Address is required",
    }),
  }),
  products: z
    .array(
      z.object({
        productId: z
          .number({
            message: "Product Id is required",
          })
          .nullable(),
        qty: z.number({
          message: "Quantity is required",
        }),
        units: z.string({
          message: "Unit is required",
        }),
        rate: z.number({
          message: "Rate is required",
        }),
        name: z.string(),
        measurement: z.string(),
        stock: z.number(),
      }),
      {
        message: "Product(s) required",
      }
    )
    .min(1, "At least one product is required")
    .refine(
      (products) => {
        const productIds = products.map((product) => product.productId);
        const uniqueIds = new Set(productIds);
        return productIds.length === uniqueIds.size;
      },
      {
        message: "Duplicate products are not allowed",
        path: ["products"],
      }
    ),
  hammali: z.number({
    message: "Hammali is required",
  }),
  freight: z.number({
    message: "Freight is required",
  }),
  caseAmount: z
    .number({
      message: "Cash Amount is required",
    })
    .min(0, {
      message: "Amount should greater than zero",
    }),
  remark: z.string().optional(),
  date: z.date({
    message: "Date is required",
  }),
  status: z.enum(["hold", "success"]).default("success"),
});

export type InvoiceFormType = z.infer<typeof InvoiceForm>;

export const CashInvoiceForm = z.object({
  customerId: z.object({
    name: z.string({
      message: "Name is required",
    }),
    id: z.number({
      message: "Id is required",
    }),
    mobileNumber: z.string({
      message: "Phone Number is required",
    }),
    address: z.string({
      message: "Address is required",
    }),
  }),
  cashAmount: z.number({
    message: "Amount is required",
  }),
  dateFrom: z.date({
    message: "Date is required",
  }),
});

export type CashInvoiceFormType = z.infer<typeof CashInvoiceForm>;

export const StockForm = z.object({
  product: z.object(
    {
      id: z.number({
        message: "Product Id is required",
      }),
      name: z.string({
        message: "Product Name is required",
      }),
      measurement: z.string({
        message: "Measurement is required",
      }),
    },
    {
      message: "Product is required",
    }
  ),
  price: z.number({
    message: "Price is required",
  }),
  quantity: z.number({
    message: "Quantity is required",
  }),
  date: z.date({
    message: "Date is required",
  }),
});

export type StockFormType = z.infer<typeof StockForm>;

export const LoginFormSchema = z.object({
  email: z
    .string({
      message: "Email is required",
    })
    .email({
      message: "Invalid Email",
    }),
  password: z
    .string({
      message: "Password is required",
    })
    .min(8, {
      message: "Password lenght is 8",
    }),
});

export type LoginFormType = z.infer<typeof LoginFormSchema>;
