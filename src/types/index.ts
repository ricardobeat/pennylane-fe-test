import { OperationMethods } from 'api/gen/client'
import { Awaited } from './helpers'

export type Invoice = Awaited<
  ReturnType<OperationMethods['getInvoices']>
>['data']['invoices'][0]

export type InvoiceLine = Invoice['invoice_lines'][0]

export type InvoiceCreatePayload = NonNullable<
  NonNullable<Parameters<OperationMethods['postInvoices']>[1]>['invoice']
>

export type Product = Awaited<
  ReturnType<OperationMethods['getSearchProducts']>
>['data']['products'][0]

export type Customer = Awaited<
  ReturnType<OperationMethods['getSearchCustomers']>
>['data']['customers'][0]
