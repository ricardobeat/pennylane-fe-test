import { useMemo, useState } from 'react'
import ReactDatePicker from 'react-datepicker'

import './InvoiceCreate.css'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Breadcrumb from 'react-bootstrap/esm/Breadcrumb'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'

import { AddProduct } from '../AddProduct'
import CustomerAutocomplete from '../CustomerAutocomplete'

import {
  formatCurrency,
  formatCustomerAddress,
  formatCustomerFullName,
  formatDate,
} from 'app/lib/formatting'

import type { Invoice, InvoiceLine } from 'types'
import InvoiceLines from '../InvoiceLines'

const initialState: Invoice = {
  id: 0,
  customer_id: null,
  finalized: false,
  paid: false,
  date: formatDate(new Date()),
  deadline: null,
  total: null,
  tax: null,
  customer: undefined,
  invoice_lines: [],
}

function getInitialDeadline() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date
}

const InvoiceCreate = () => {
  const [customer, setCustomer] = useState<Invoice['customer']>()
  const [invoiceLines, setInvoiceLines] = useState<Invoice['invoice_lines']>([])
  const [deadline, setDeadline] = useState<Date>(getInitialDeadline())
  const [date, setDate] = useState<Date>(new Date())
  const [paid, setPaid] = useState(false)

  const editing = true

  const invoice: Invoice = useMemo(() => {
    return {
      ...initialState,
      customer_id: customer?.id || null,
      customer,
      date: deadline ? formatDate(deadline) : null,
      deadline: date ? formatDate(date) : null,
      invoice_lines: invoiceLines,
      paid,
    }
  }, [customer, invoiceLines, deadline, paid])

  const addInvoiceLine = (invoiceLine: InvoiceLine) => {
    setInvoiceLines((s) => [...s, invoiceLine])
  }

  const validateForm = () => {
    return !(invoice.customer && invoice.invoice_lines.length > 0)
  }

  // FIXME: ideally the API would return numbers or a for of currency object with integers,
  // otherwise we end up parsing strings over and over like in this case
  const total = invoiceLines.reduce((p, c) => p + Number(c.price), 0)
  const taxTotal = invoiceLines.reduce((p, c) => p + Number(c.tax), 0)

  const submit: React.FormEventHandler = (e) => {
    e.preventDefault()
    console.log(invoice)
  }

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Create invoice</Breadcrumb.Item>
      </Breadcrumb>

      <h2>New invoice</h2>

      <Form onSubmit={submit}>
        <Card className="mb-5">
          <Card.Body className="p-4">
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Invoice #</Form.Label>
                <Form.Control type="text" readOnly value="--" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Date</Form.Label>
                <div>
                  <ReactDatePicker
                    className="form-control"
                    value={invoice.date ? invoice.date : undefined}
                    onChange={(date) => date && setDate(date)}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Deadline</Form.Label>
                <div>
                  <ReactDatePicker
                    className="form-control"
                    value={invoice.deadline ? invoice.deadline : undefined}
                    onChange={(date) => date && setDeadline(date)}
                  />
                </div>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="inputCustomer">
              <Form.Label className="fw-semibold">Customer</Form.Label>
              <CustomerAutocomplete
                value={invoice.customer}
                onChange={setCustomer}
              />
            </Form.Group>

            {customer !== undefined && (
              <Card className="px-3 pt-2 pb-1 mb-4">
                <dl className="customer-details">
                  <div>
                    <dt>Name</dt>
                    <dd>{formatCustomerFullName(customer)}</dd>
                  </div>
                  <div>
                    <dt>Customer ID</dt>
                    <dd>{customer.id}</dd>
                  </div>
                  <div>
                    <dt>Address</dt>
                    <dd>{formatCustomerAddress(customer)}</dd>
                  </div>
                  <div>
                    <dt>Zip Code</dt>
                    <dd>{customer.zip_code}</dd>
                  </div>
                  <div>
                    <dt>Country</dt>
                    <dd>{customer.country}</dd>
                  </div>
                  <div>
                    <dt>Country code</dt>
                    <dd>{customer.country_code}</dd>
                  </div>
                </dl>
              </Card>
            )}

            <Form.Group className="mb-3" controlId="inputTax">
              <Form.Label className="fw-semibold">Items</Form.Label>
              <Form.Text> ({invoice.invoice_lines.length})</Form.Text>

              <InvoiceLines items={invoice.invoice_lines} />

              <Card className="mb-3 p-3" style={{ background: '#fafafa' }}>
                <AddProduct onAdd={addInvoiceLine} />
              </Card>
            </Form.Group>

            <Stack
              direction="horizontal"
              gap={5}
              className="mt-4 text-end justify-content-end"
            >
              <div>
                <h3 className="m-0">Tax</h3>
                <p className="fs-3 lh-2 m-0">
                  {formatCurrency(taxTotal, true)}
                </p>
              </div>
              <div>
                <h3 className="m-0">Total</h3>
                <p className="fs-3 lh-2 m-0">{formatCurrency(total, true)}</p>
              </div>
            </Stack>
          </Card.Body>

          <Card.Footer>
            <Stack
              direction="horizontal"
              gap={2}
              className="justify-content-end"
            >
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
          </Card.Footer>
        </Card>
      </Form>
    </Container>
  )
}

export default InvoiceCreate
