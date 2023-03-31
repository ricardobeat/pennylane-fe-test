import { useState } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import Container from 'react-bootstrap/esm/Container'
import Breadcrumb from 'react-bootstrap/esm/Breadcrumb'
import Stack from 'react-bootstrap/Stack'

import CustomerAutocomplete from '../CustomerAutocomplete'
import { formatCustomerAddress } from 'app/lib/formatting'
import { InvoiceLineForm } from './InvoiceLineForm'

import type { Invoice, InvoiceLine } from 'types'

import './InvoiceCreate.css'
import InvoiceLines from '../InvoiceLines'

const initialState: Invoice = {
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
}

const InvoiceCreate = () => {
  const [formState, setFormState] = useState<Invoice>(initialState)

  const setCustomer = (customer: NonNullable<Invoice['customer']>) => {
    setFormState((s) => ({
      ...s,
      customer_id: customer.id,
      customer,
    }))
  }

  const addInvoiceLine = (invoiceLine: NonNullable<InvoiceLine>) => {
    setFormState((s) => ({
      ...s,
      invoice_lines: [...s.invoice_lines, invoiceLine],
    }))
  }

  const validateForm = () => {
    return !(formState.customer && formState.invoice_lines.length > 0)
  }

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Create invoice</Breadcrumb.Item>
      </Breadcrumb>

      <Form>
        <Form.Group className="mb-3" controlId="inputCustomer">
          <Form.Label className="fw-semibold">Customer</Form.Label>
          <CustomerAutocomplete
            value={formState.customer}
            onChange={setCustomer}
          />
        </Form.Group>

        {!!formState.customer && (
          <Form.Group>
            <Form.Label className="fw-semibold">Address</Form.Label>
            <p>
              {formatCustomerAddress(formState.customer)}
              <br />
              {formState.customer.country}
            </p>
          </Form.Group>
        )}

        <Form.Group className="mb-3" controlId="inputTax">
          <Form.Label className="fw-semibold">Items</Form.Label>
          <Form.Text> ({formState.invoice_lines.length})</Form.Text>

          <InvoiceLines items={formState.invoice_lines} />

          <div className="mb-3">
            <InvoiceLineForm onAdd={addInvoiceLine} />
          </div>
        </Form.Group>

        <Row>
          <Form.Group as={Col} className="mb-3" controlId="inputTotal">
            <Form.Label>Total Amount</Form.Label>
            <InputGroup>
              <InputGroup.Text>€</InputGroup.Text>
              <Form.Control
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                readOnly
              />
            </InputGroup>
          </Form.Group>

          <Form.Group as={Col} className="mb-3" controlId="inputTax">
            <Form.Label>Tax</Form.Label>

            <InputGroup>
              <InputGroup.Text>€</InputGroup.Text>
              <Form.Control
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                readOnly
              />
            </InputGroup>
          </Form.Group>
        </Row>

        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button
            variant="light"
            type="reset"
            onClick={() => window.location.reload()}
            size="lg"
          >
            Clear
          </Button>
          <Button
            variant="primary"
            type="submit"
            size="lg"
            disabled={validateForm()}
          >
            Create invoice
          </Button>
        </Stack>
      </Form>
    </Container>
  )
}

export default InvoiceCreate
