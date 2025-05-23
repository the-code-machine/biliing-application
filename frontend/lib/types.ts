import React from "react"


export type InsertCompanyHandler = {
    children: React.ReactNode,
    className?: string,
}

export type UpdateCompanyHandler = {
    defaultValues: Company
} & InsertCompanyHandler

export type Company = {
    id: number
    name: string,
    description?: string
    status: boolean
}

export type Product = {
    id: number,
    name: string,
    description?: string,
    image: string,
    status: boolean,
    companyId: number
    company: Company
    measurement: string,
    stock:number
}

export type Customer = {
    id: number,
    name: string,
    address: string,
    mobileNumber: string,
    status: boolean
}


export type CashInvoice = {
    id: number,
    customer: Customer,
    date: Date,
    amount: number
}

export type Stock = {
    id: number,
    product: Product,
    date: Date,
    quantity: number,
    purchasePrice: number,
    productId: number
}

export type Invoice = {
    id: number,
    customerId: number,
    customer: Customer,
    castAmount: number,
    remark?: string,
    hammali: number,
    freight: number,
    createdAt: Date,
    date: Date,
    invoiceProducts: {
        measurement: string,
        name: string,
        description: string,
        InvoiceProduct: {
            price: number,
            quantity: number,
            units: string
        },
        id?:number,
        stock?:number
    }[],
    status:string
}

export type Notification = {
    productId:number,
    name:number,
    remaining:number,
}