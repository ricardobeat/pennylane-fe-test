import { useCallback, useState, useMemo } from 'react'
import type { Product, InvoiceLine } from '../../../types'

import Stack from 'react-bootstrap/Stack'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

import ProductAutocomplete from '../ProductAutocomplete'
import { formatCurrency, formatCurrencyValue } from 'app/lib/formatting'

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
    <Card>
      <Card.Header>Add product</Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Form.Group as={Col} sm={9}>
            <Form.Label>Product</Form.Label>
            <ProductAutocomplete
              onChange={setSelectedProduct}
              value={selectedProduct}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="inputTax">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(+e.target.value)}
            />
          </Form.Group>
        </Row>

        {!!selectedProduct && (
          <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="inputTax">
                <Form.Label>Product ID</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  defaultValue={selectedProduct?.id}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="inputTax">
                <Form.Label>Unit</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  defaultValue={selectedProduct?.unit}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="inputTax">
                <Form.Label>Unit Price</Form.Label>
                <InputGroup>
                  <InputGroup.Text>€</InputGroup.Text>
                  <Form.Control
                    type="text"
                    readOnly
                    defaultValue={formatCurrency(
                      selectedProduct?.unit_price_without_tax
                    )}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} controlId="inputTax">
                <Form.Label>VAT</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    readOnly
                    defaultValue={selectedProduct?.vat_rate}
                  />
                  <InputGroup.Text>%</InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} controlId="inputTax">
                <Form.Label>With Tax</Form.Label>
                <InputGroup>
                  <InputGroup.Text>€</InputGroup.Text>
                  <Form.Control
                    type="text"
                    readOnly
                    defaultValue={formatCurrency(selectedProduct?.unit_price)}
                  />
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="inputTax">
                <Form.Label>Taxes</Form.Label>
                <InputGroup>
                  <InputGroup.Text>€</InputGroup.Text>
                  <Form.Control type="text" readOnly value={invoiceLine.tax} />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} controlId="inputTax">
                <Form.Label>Total</Form.Label>
                <InputGroup>
                  <InputGroup.Text>€</InputGroup.Text>
                  <Form.Control
                    type="text"
                    readOnly
                    value={invoiceLine?.price}
                  />
                </InputGroup>
              </Form.Group>
            </Row>
          </>
        )}

        <Row>
          <Col>
            <Stack
              direction="horizontal"
              gap={2}
              className="justify-content-end"
            >
              <Button
                variant="dark"
                onClick={() => addProduct(invoiceLine)}
                disabled={!selectedProduct}
              >
                Add product
              </Button>
            </Stack>
          </Col>
        </Row>
      </Card.Body>
    </Card>
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
