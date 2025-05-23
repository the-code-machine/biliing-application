import {
  generatePDFInoviceHandler,
  updateInvoiceHandler,
} from "@/action-handlers/mutation.handlers";
import { InsertCompanyHandler, Invoice } from "@/lib/types";
import { cn } from "@/lib/utils";
import { queryClient } from "@/providers/query.provider";
import InvoiceChallanContentGenerator from "@/utils/invoice-challan-content-generator";
import InvoiceEstimationContentGenerator from "@/utils/invoice-estimation-content-generator";
import { zodResolver } from "@hookform/resolvers/zod";
import Sanscript from "@indic-transliteration/sanscript";
import { format } from "date-fns";
import { LoaderCircle, Plus, Trash } from "lucide-react";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useSWRMutation from "swr/mutation";
import { InvoiceForm, InvoiceFormType } from "../../utils/form-types.utils";
import CustomerList from "../customer-list/customer-list";
import ProductList from "../product-list/product-list";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
export default function UpdateInvoiceForm({
  children,
  className,
  invoice,
}: InsertCompanyHandler & { invoice: Invoice }) {
  const [customerPopover, setCustomerPopover] = React.useState(false);
  const [dialogStatus, setDialogStatus] = React.useState(false);
  const [sucessStatus, setSucessStatus] = React.useState(false);
  const invoiceForm = useForm<InvoiceFormType>({
    resolver: zodResolver(InvoiceForm),
    defaultValues: {
      caseAmount: invoice.castAmount,
      customerId: {
        address: invoice.customer.address,
        id: invoice.customer.id,
        name: invoice.customer.name,
        phoneNumber: invoice.customer.mobileNumber,
      },
      date: new Date(invoice.date),
      freight: invoice.freight,
      hammali: invoice.hammali,
      status: "success", // NEW
      products: invoice.invoiceProducts.map((product) => ({
        measurement: product.measurement,
        name: product.name,
        productId: product.id,
        qty: product.InvoiceProduct.quantity,
        rate: product.InvoiceProduct.price,
        stock: product.stock,
        units: product.InvoiceProduct.units,
      })),
      remark: invoice.remark,
    },
  });
  const productField = useFieldArray({
    control: invoiceForm.control,
    name: "products",
    keyName: "id",
  });
  const submiitMutation = useSWRMutation(
    "/customer/list",
    async (
      _,
      {
        arg,
      }: {
        arg: InvoiceFormType;
      }
    ) => {
      let isValid = true;
      let isQuantityValid = true;
      arg.products.map((product) => {
        if (product.productId == null) isValid = false;
        if (product.stock < product.qty) {
          isQuantityValid = false;
          toast.error(
            `You are enter ${product.qty} quantity but currently availabel only  ${product.stock}`
          );
        }
      });
      if (isValid && isQuantityValid) {
        const finalStatus = arg.status === "hold" ? "hold" : "success";
        updateInvoiceHandler({ ...arg, id: invoice.id, status: finalStatus });
        toast.success("Invoice Created");

        // Invalidate correct query cache based on final status
        if (finalStatus === "hold") {
          queryClient.invalidateQueries({
            queryKey: ["/invoice/list", "hold"],
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: ["/invoice/list", "success"],
          });
        }

        // Only trigger print UI if it's not a draft
        if (finalStatus === "success") {
          invoiceForm.reset();
          return setSucessStatus(true);
        } else {
          invoiceForm.reset();
          return setDialogStatus(false); // close dialog after saving draft
        }
      }
      if (!isValid) return toast.error("Please Select Product");
    },
    {
      onError: (err) => {
        console.log(err);
        toast.error("something went wrong");
      },
    }
  );

  const printChallanBillMutation = useSWRMutation(
    "/generate-invoice",
    async () => {
      const total = invoiceForm
        .getValues("products")
        ?.reduce((total: number, product) => {
          const productAmount = product.qty * product.rate;
          return total + productAmount;
        }, 0);
      const content = InvoiceChallanContentGenerator({
        customer: {
          ...invoiceForm.getValues("customerId"),
          status: true,
          mobileNumber: invoiceForm.getValues("customerId.phoneNumber"),
          name: Sanscript.t(
            invoiceForm.getValues("customerId.name"),
            "itrans",
            "devanagari"
          ),
          address: Sanscript.t(
            invoiceForm.getValues("customerId.address"),
            "itrans",
            "devanagari"
          ),
        },
        remark: Sanscript.t(
          invoiceForm.getValues("remark") || "",
          "itrans",
          "devanagari"
        ),
        products: invoiceForm.getValues("products").map((product) => ({
          measurement: product.measurement,
          name: product.name,
          qty: product.qty,
          rate: product.rate,
          units: product.units,
        })),
        cash: invoiceForm.getValues("caseAmount"),
        invoiceDate: new Date(invoiceForm.getValues("date")),
        total: total,
      });
      generatePDFInoviceHandler(content);
    },
    {
      onSuccess: () => {
        setSucessStatus(false);
        invoiceForm.reset();
      },
    }
  );
  const printEstimateBillMutation = useSWRMutation(
    "/generate-invoice",
    async () => {
      const total = invoiceForm
        .getValues("products")
        ?.reduce((total: number, product) => {
          const productAmount = product.qty * product.rate;
          return total + productAmount;
        }, 0);
      const content = InvoiceEstimationContentGenerator({
        customer: {
          ...invoiceForm.getValues("customerId"),
          status: true,
          mobileNumber: invoiceForm.getValues("customerId.phoneNumber"),
          name: Sanscript.t(
            invoiceForm.getValues("customerId.name"),
            "itrans",
            "devanagari"
          ),
          address: Sanscript.t(
            invoiceForm.getValues("customerId.address"),
            "itrans",
            "devanagari"
          ),
        },
        remark: Sanscript.t(
          invoiceForm.getValues("remark") || "",
          "itrans",
          "devanagari"
        ),
        products: invoiceForm.getValues("products").map((product) => ({
          measurement: product.measurement,
          name: product.name,
          qty: product.qty,
          rate: product.rate,
          units: product.units,
        })),
        cash: invoiceForm.getValues("caseAmount"),
        invoiceDate: new Date(invoiceForm.getValues("date")),
        total: total,
        fright: invoiceForm.getValues("freight"),
        hamamli: invoiceForm.getValues("hammali"),
      });
      generatePDFInoviceHandler(content);
    },
    {
      onSuccess: () => {
        setSucessStatus(false);
        invoiceForm.reset();
      },
    }
  );
  const formData = invoiceForm.watch();

  const totalAmount = React.useMemo(() => {
    const { products, hammali, freight } = formData;
    const productTotal = products?.reduce((total: number, product: any) => {
      const productAmount = product.qty * product.rate;
      return total + productAmount;
    }, 0);
    return productTotal + hammali + freight;
  }, [formData, formData.hammali, formData.freight]);

  return (
    <Dialog open={dialogStatus} onOpenChange={(val) => setDialogStatus(val)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn(className)}>
        <Form {...invoiceForm}>
          <form
            onSubmit={invoiceForm.handleSubmit((data) =>
              submiitMutation.trigger(data)
            )}
            className="space-y-4"
          >
            <div className="flex gap-2">
              <FormField
                control={invoiceForm.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      <Popover
                        open={customerPopover}
                        onOpenChange={(val) => setCustomerPopover(val)}
                      >
                        <PopoverTrigger className="block w-60" asChild>
                          <Button variant="outline">
                            {field.value?.name || "Select Customer"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <CustomerList
                            onSelect={(customer) => {
                              field.onChange({
                                name: customer.name,
                                id: customer.id,
                                phoneNumber: customer.mobileNumber,
                                address: customer.address,
                              });
                              setCustomerPopover(false);
                            }}
                            className="h-48"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={invoiceForm.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        disabled={true}
                        defaultCountry="IN"
                        value={field.value?.phoneNumber}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={invoiceForm.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input disabled={true} value={field.value?.address} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {productField.fields?.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <Controller
                  control={invoiceForm.control}
                  name={`products.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1 flex flex-col">
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline">
                              {invoiceForm.watch(`products.${index}.name`) ||
                                "Select Product"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96">
                            <ProductList
                              onSelect={(product) => {
                                invoiceForm.setValue(
                                  `products.${index}.productId`,
                                  product.id
                                );
                                invoiceForm.setValue(
                                  `products.${index}.name`,
                                  product.name
                                );
                                invoiceForm.setValue(
                                  `products.${index}.measurement`,
                                  product.measurement
                                );
                                invoiceForm.setValue(
                                  `products.${index}.stock`,
                                  product.stock
                                );
                              }}
                              disabled={true}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={invoiceForm.control}
                  name={`products.${index}.units`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Units</FormLabel>
                      <FormControl>
                        <Input placeholder="Units" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={invoiceForm.control}
                  name={`products.${index}.measurement`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Measurement</FormLabel>
                      <FormControl>
                        <Input
                          disabled={true}
                          placeholder="Measurement"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={invoiceForm.control}
                  name={`products.${index}.qty`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={invoiceForm.control}
                  name={`products.${index}.rate`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Rate"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="mt-5"
                  disabled={productField.fields.length == 1}
                  type="button"
                  onClick={() => productField.remove(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="mt-5"
                  type="button"
                  onClick={() =>
                    productField.append({
                      productId: null,
                      qty: 1,
                      units: "1",
                      rate: 0,
                      name: "",
                      measurement: "",
                      stock: 0,
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <FormField
                control={invoiceForm.control}
                name="hammali"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Hammali</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={invoiceForm.control}
                name="freight"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Freight</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 items-center h-20  w-40">
                <span className="text-xl font-semibold">Total :</span>
                <span className="text-xl font-semibold">
                  {totalAmount?.toFixed(2) || 0}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <FormField
                control={invoiceForm.control}
                name="caseAmount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Cash Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={invoiceForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild className="block w-full">
                          <Button variant="outline">
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date)}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={invoiceForm.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between text-xl font-bold">
              <span>Total Amount</span>
              <span>
                {(totalAmount - invoiceForm.watch("caseAmount"))?.toFixed(2) ||
                  0}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <FormField
                  control={invoiceForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Save as Draft?</FormLabel>
                      <FormControl>
                        <Switch
                          className="block"
                          checked={field.value === "hold"}
                          onCheckedChange={(val) =>
                            field.onChange(val ? "hold" : "success")
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={submiitMutation.isMutating}
                  type="reset"
                  onClick={() => invoiceForm.reset()}
                  variant="destructive"
                  className="w-full mt-2 flex-1"
                >
                  Cancel
                </Button>
              </div>
              <Button
                disabled={submiitMutation.isMutating}
                className="w-full mt-2 flex-1"
              >
                {!submiitMutation.isMutating ? (
                  "Save"
                ) : (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
