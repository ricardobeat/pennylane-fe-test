import type { NewInvoiceLine, Product } from 'types'

// keep .product around while editing
export type NewInvoiceLineWithProduct = NewInvoiceLine & {
  product: Product
}
