import { NewInvoiceLine, Product } from '../../types'
import { formatCurrencyValue } from './formatting'

export function getTotal(
  product: Pick<Product, 'unit_price'> | undefined,
  quantity: number
) {
  if (!product) return 0
  return Number(product.unit_price) * quantity
}

export function getTotalTax(
  product: Pick<Product, 'unit_tax'> | undefined,
  quantity: number
) {
  if (!product) return 0
  return Number(product.unit_tax) * quantity
}

export function invoiceLineFromProduct(
  product: Product,
  quantity: number
): NewInvoiceLine {
  return {
    quantity,
    product_id: product.id,
    unit: product.unit,
    label: product.label,
    vat_rate: product.vat_rate,
    price: formatCurrencyValue(getTotal(product, quantity)),
    tax: formatCurrencyValue(getTotalTax(product, quantity)),
  }
}

export function markInvoiceLineForDeletion(invoiceLine: NewInvoiceLine) {
  return {
    ...invoiceLine,
    _destroy: true,
  }
}
