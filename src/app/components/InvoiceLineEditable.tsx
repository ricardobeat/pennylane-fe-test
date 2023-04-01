import { formatCurrency } from 'app/lib/formatting'
import Col from 'react-bootstrap/esm/Col'
import Form from 'react-bootstrap/esm/Form'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import Row from 'react-bootstrap/esm/Row'
import type { InvoiceLine } from 'types'

interface Props {
  invoiceLine: InvoiceLine
}

export default function InvoiceLineEditable({ invoiceLine }: Props) {
  const product = invoiceLine.product
  return (
    <Row className="mb-3">
      <Form.Group as={Col}>
        <Form.Label>Product ID</Form.Label>
        <Form.Control type="text" readOnly defaultValue={product?.id} />
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label>Unit</Form.Label>
        <Form.Control type="text" readOnly defaultValue={product?.unit} />
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label>Unit Price</Form.Label>
        <InputGroup>
          <InputGroup.Text>€</InputGroup.Text>
          <Form.Control
            type="text"
            readOnly
            defaultValue={formatCurrency(product?.unit_price_without_tax)}
          />
        </InputGroup>
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label>VAT</Form.Label>
        <InputGroup>
          <Form.Control type="text" readOnly defaultValue={product?.vat_rate} />
          <InputGroup.Text>%</InputGroup.Text>
        </InputGroup>
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label>With Tax</Form.Label>
        <InputGroup>
          <InputGroup.Text>€</InputGroup.Text>
          <Form.Control
            type="text"
            readOnly
            defaultValue={formatCurrency(product?.unit_price)}
          />
        </InputGroup>
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label>Total taxes</Form.Label>
        <InputGroup>
          <InputGroup.Text>€</InputGroup.Text>
          <Form.Control
            type="text"
            readOnly
            value={formatCurrency(invoiceLine?.tax)}
          />
        </InputGroup>
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label className="fw-semibold">Total</Form.Label>
        <InputGroup>
          <InputGroup.Text>€</InputGroup.Text>
          <Form.Control
            type="text"
            readOnly
            value={formatCurrency(invoiceLine?.price)}
          />
        </InputGroup>
      </Form.Group>
    </Row>
  )
}
