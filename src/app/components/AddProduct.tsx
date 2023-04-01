import { useCallback, useState, useMemo } from 'react'
import type { Product, InvoiceLine } from '../../types'

import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'

import ProductAutocomplete from './ProductAutocomplete'
import { formatCurrency, formatCurrencyValue } from 'app/lib/formatting'
import { getTotal, getTotalTax } from '../lib/invoices'

interface Props {
  onAdd(invoiceLine: NewInvoiceLine): void
}

type NewInvoiceLine = Pick<
  InvoiceLine,
  | 'quantity'
  | 'product_id'
  | 'unit'
  | 'label'
  | 'vat_rate'
  | 'price'
  | 'tax'
  | 'product'
>

export function AddProduct({ onAdd }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product>()

  const invoiceLine: NewInvoiceLine | null = useMemo(() => {
    if (!selectedProduct) return null
    return {
      quantity,
      product_id: selectedProduct.id,
      unit: selectedProduct.unit,
      label: selectedProduct.label,
      vat_rate: selectedProduct.vat_rate,
      price: formatCurrencyValue(getTotal(selectedProduct, quantity)),
      tax: formatCurrencyValue(getTotalTax(selectedProduct, quantity)),
      product: selectedProduct,
    }
  }, [selectedProduct, quantity])

  const reset = () => {
    setQuantity(1)
    setSelectedProduct(undefined)
  }

  const addProduct = useCallback(
    (invoiceLine: NewInvoiceLine) => {
      onAdd(invoiceLine) // TODO: validate
      reset()
    },
    [onAdd]
  )

  return (
    <>
      <Stack
        direction="horizontal"
        gap={2}
        className="align-items-end justify-content-end"
      >
        <Form.Group className="w-100">
          <Form.Label className="fw-semibold">Add product</Form.Label>
          <ProductAutocomplete
            onChange={setSelectedProduct}
            value={selectedProduct}
          />
        </Form.Group>

        <Form.Group controlId="inputQuantity">
          <Form.Label className="fw-semibold">Quantity</Form.Label>
          <Form.Control
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(+e.target.value)}
            style={{ width: 80 }}
          />
        </Form.Group>

        <Button
          variant="dark"
          onClick={() => invoiceLine && addProduct(invoiceLine)}
          disabled={!selectedProduct}
          style={{ whiteSpace: 'nowrap' }}
        >
          Add product
        </Button>
      </Stack>

      {selectedProduct && invoiceLine ? (
        <Table borderless className="table-sm mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Product ID</th>
              <th>Unit</th>
              <th>VAT</th>
              <th>Unit Price</th>
              <th>Tax</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedProduct.label}</td>
              <td>{selectedProduct.id}</td>
              <td>{selectedProduct.unit}</td>
              <td>{selectedProduct.vat_rate}%</td>
              <td>{formatCurrency(selectedProduct.unit_price, true)}</td>
              <td>{formatCurrency(selectedProduct.unit_tax, true)}</td>
            </tr>
          </tbody>
        </Table>
      ) : null}
    </>
  )
}
