import { useState } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import Container from 'react-bootstrap/esm/Container'

import CustomerAutocomplete from '../CustomerAutocomplete'
import { Invoice } from 'types'
import { formatCustomerAddress } from 'app/lib/formatting'
import ProductAutocomplete from '../ProductAutocomplete'
import { InvoiceLineForm } from './InvoiceLineForm'

const InvoiceCreate = () => {
  // const api = useApi()
  // const [invoice, setInvoice] = useState<Invoice>()

  const [formState, setFormState] = useState<Invoice>({
    id: 0,
    customer_id: null,
    finalized: false,
    paid: false,
    date: null,
    deadline: null,
    total: null,
    tax: null,
    customer: undefined,
    invoice_lines: [],
  })

  const setCustomer = (customer: NonNullable<Invoice['customer']>) => {
    setFormState((s) => ({
      ...s,
      customer_id: customer.id,
      customer,
    }))
  }

  const addProduct = (product: NonNullable<Invoice['invoice_lines'][0]>) => {
    setFormState((s) => ({
      ...s,
      invoice_lines: [...s.invoice_lines, product],
    }))
  }

  const [addingInvoiceLine, setAddingInvoiceLine] = useState(false)

  return (
    <Container>
      <header className="mb-5">
        <h2>New invoice</h2>
      </header>

      <Form>
        <Form.Group as={Row} className="mb-3" controlId="inputCustomer">
          <Form.Label column sm={2} className="text-end">
            Customer
          </Form.Label>
          <Col sm={10}>
            <CustomerAutocomplete
              value={formState.customer}
              onChange={setCustomer}
            />
            {formState.customer ? (
              <div className="pt-2 pb-2">
                <strong>Address: </strong>
                <pre>
                  {formatCustomerAddress(formState.customer)}
                  <br />
                  {formState.customer.country}
                </pre>
              </div>
            ) : null}
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="inputTotal">
          <Form.Label column sm={2} className="text-end">
            Total Amount
          </Form.Label>

          <Col sm={10}>
            <InputGroup>
              <InputGroup.Text>€</InputGroup.Text>
              <Form.Control
                type="text"
                inputMode="numeric"
                placeholder="0,00"
              />
            </InputGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="inputTax">
          <Form.Label column sm={2} className="text-end">
            Tax
          </Form.Label>

          <Col sm={10}>
            <InputGroup>
              <InputGroup.Text>€</InputGroup.Text>
              <Form.Control
                type="text"
                inputMode="numeric"
                placeholder="0,00"
              />
            </InputGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="inputTax">
          <Form.Label column sm={2} className="text-end">
            Items
          </Form.Label>

          <Col sm={10}>
            {addingInvoiceLine && <InvoiceLineForm />}
            <Button
              variant="secondary"
              onClick={() => setAddingInvoiceLine(true)}
            >
              Add product
            </Button>
          </Col>
        </Form.Group>

        <Row className="mt-5">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button variant="primary" type="submit">
              Create invoice
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

export default InvoiceCreate
