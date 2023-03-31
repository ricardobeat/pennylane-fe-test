import { useCallback, useState, useMemo } from 'react'
import type { Product, InvoiceLine } from '../../types'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import ProductAutocomplete from './ProductAutocomplete'
import { formatCurrencyValue } from 'app/lib/formatting'
import InvoiceLineEditable from './InvoiceLineEditable'

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

export function InvoiceLineForm({ onAdd }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product>()

  const invoiceLine: NewInvoiceLine | null = useMemo(() => {
    console.log(selectedProduct, quantity)
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
    console.log('clearing form')
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
      <Row className="mb-3 align-items-end">
        <Form.Group as={Col} sm={9}>
          <Form.Label className="fw-semibold">Add product</Form.Label>
          <ProductAutocomplete
            onChange={setSelectedProduct}
            value={selectedProduct}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="inputTax">
          <Form.Label className="fw-semibold">Quantity</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(+e.target.value)}
          />
        </Form.Group>

        <Form.Group as={Col}>
          <div>
            <Button
              variant="dark"
              onClick={() => invoiceLine && addProduct(invoiceLine)}
              disabled={!selectedProduct}
            >
              Add product
            </Button>
          </div>
        </Form.Group>
      </Row>

      {Boolean(selectedProduct) && (
        <InvoiceLineEditable invoiceLine={invoiceLine as InvoiceLine} />
      )}
    </>
  )
}

function getTotal(product: Product | undefined, quantity: number) {
  if (!product) return 0
  return Number(product.unit_price) * quantity
}

function getTotalTax(product: Product | undefined, quantity: number) {
  if (!product) return 0
  return Number(product.unit_tax) * quantity
}
