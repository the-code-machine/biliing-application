import { Customer } from "@/lib/types";
import { formatPhoneNumber } from "react-phone-number-input";


export default function CashInvoiceContentGenerator({
    customer,
    invoiceDate,
    amount
}:{
    customer:Customer,
    invoiceDate:Date,
    amount:number
}) {
    return (
        `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"></script>


    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js"
        integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js"
        integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
        crossorigin="anonymous"></script>
 


    <style>
        .memo-table th,
        .memo-table td {
            text-align: center;
        }

        .memo-header {
            border-bottom: 1px dashed #000;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }

        .memofooter {
            border-bottom: 1px dashed #000;
            margin-bottom: 20px;
            display: inline-block;
            width: 100%;
        }
    </style>

</head>

<body>


    <!-- Print Estimation -->
    <div class="container my-4">
        <div class="memo-header text-center">
            <h5>ESTIMATE Bill</h5>
        </div>

        <div class="row mb-3">
            <div class="col-6">
                <p class="mb-1"><strong>Name:</strong> ${customer.name}</p>
                <p class="mb-1"><strong>Address:</strong> ${customer.address}</p>
            </div>
            <div class="col-6 text-end">
                <p class="mb-1 text-right"><strong>Date:</strong>${invoiceDate.toDateString()}</p>
                <p class="mb-1 text-right"><strong>Mobile No.:</strong>${formatPhoneNumber(customer.mobileNumber)}</p>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-6">
                <p class="mb-1"><strong>Cash:</strong> ${amount.toFixed(2)}</p>
            </div>
        </div>
        <span class="memofooter"></span>
        <div class="row">
            <div class="col-12 text-end">
                <h5><strong>Grand Total:</strong> ${amount.toFixed(2)}</h5>
            </div>
        </div>
    </div>
</body>
</html>`
    );
}