import { useState } from 'react'
import type { Product } from '../../../types'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'

import ProductAutocomplete from '../ProductAutocomplete'

export function InvoiceLineForm() {
  const [selectedProduct, setSelectedProduct] = useState<Product>()

  return (
    <Card className="mt-3">
      <Card.Header>Add product</Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <ProductAutocomplete onChange={setSelectedProduct} />
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="inputTax">
            <Form.Label className="text-end">Quantity</Form.Label>
            <Form.Control type="text" />
          </Form.Group>

          <Form.Group as={Col} controlId="inputTax">
            <Form.Label>Unit</Form.Label>
            <Form.Control type="text" />
          </Form.Group>

          <Form.Group as={Row} controlId="inputTax">
            <Form.Label>Label</Form.Label>
            <Form.Control type="text" />
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="inputTax">
            <Form.Label column sm={2}>
              VAT Rate
            </Form.Label>
            <Form.Control type="text" />
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="inputTax">
            <Form.Label column sm={2}>
              Price
            </Form.Label>
            <Form.Control type="text" readOnly />
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="inputTax">
            <Form.Label column sm={2}>
              Tax
            </Form.Label>
            <Form.Control type="text" />
          </Form.Group>
        </Row>
      </Card.Body>
    </Card>
  )
}
