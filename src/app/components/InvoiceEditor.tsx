import {
  formatCustomerFullName,
  formatCustomerAddress,
  formatCurrency,
  formatDate,
} from 'app/lib/formatting'
import { useState, useMemo } from 'react'
import Alert from 'react-bootstrap/esm/Alert'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import Col from 'react-bootstrap/esm/Col'
import Form from 'react-bootstrap/esm/Form'
import Row from 'react-bootstrap/esm/Row'
import Stack from 'react-bootstrap/esm/Stack'
import ReactDatePicker from 'react-datepicker'
import {
  Invoice,
  InvoiceCreatePayload,
  InvoiceLine,
  InvoiceUpdatePayload,
} from 'types'
import { AddProduct } from './AddProduct'
import CustomerAutocomplete from './CustomerAutocomplete'
import InvoiceLines from './InvoiceLines'

interface Props {
  invoice: Partial<Invoice>
  onSubmit: (invoice: InvoiceCreatePayload | InvoiceUpdatePayload) => void
}

export default function InvoiceEditor({
  invoice: inputInvoice,
  onSubmit,
}: Props) {
  const [customer, setCustomer] = useState(inputInvoice.customer)
  const [invoiceLines, setInvoiceLines] = useState(
    inputInvoice.invoice_lines || []
  )
  const [deadline, setDeadline] = useState(inputInvoice.deadline)
  const [invoiceDate, setInvoiceDate] = useState(inputInvoice.date)
  const [paid, _setPaid] = useState(!!inputInvoice.paid)
  const [finalized, setFinalized] = useState(!!inputInvoice.finalized)

  const setPaid = (value: boolean) => {
    if (invoice.finalized) {
      _setPaid(value)
    } else {
      alert('Cannot set invoice as paid when not finalized')
    }
  }

  const isNewInvoice = !inputInvoice.id

  const invoice: InvoiceCreatePayload | InvoiceUpdatePayload = useMemo(() => {
    return {
      id: inputInvoice.id,
      customer_id: customer?.id || 0,
      date: invoiceDate,
      deadline: deadline,
      finalized,
      paid: finalized && paid,
      invoice_lines_attributes: invoiceLines,
    }
  }, [
    customer,
    invoiceLines,
    deadline,
    invoiceDate,
    paid,
    finalized,
    inputInvoice.id,
  ])

  const addInvoiceLine = (invoiceLine: InvoiceLine) => {
    setInvoiceLines((s) => [...s, invoiceLine])
  }

  const deadlineDays = differenceInDays(deadline, invoiceDate)
  const isValidDeadline = validateDeadline(deadline, invoiceDate)

  const isFormValid =
    isValidDeadline && invoice.customer_id && invoiceLines.length > 0

  // FIXME: ideally the API would return numbers or a for of currency object with integers,
  // otherwise we end up parsing strings over and over like in this case
  const total = invoiceLines.reduce((p, c) => p + Number(c.price), 0)
  const taxTotal = invoiceLines.reduce((p, c) => p + Number(c.tax), 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(invoice)
  }

  if (inputInvoice.finalized) {
    return <Alert variant="danger">Cannot edit finalized invoice.</Alert>
  }

  return (
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
                  onChange={(date) => date && setInvoiceDate(formatDate(date))}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>
                Deadline <Form.Text>({deadlineDays}d)</Form.Text>
              </Form.Label>
              <div>
                <ReactDatePicker
                  className={`form-control ${
                    !isValidDeadline ? 'border-danger' : ''
                  }`}
                  value={invoice.deadline ? invoice.deadline : undefined}
                  onChange={(date) => date && setDeadline(formatDate(date))}
                  dateFormat="yyyy-MM-dd"
                  filterDate={(date) => validateDeadline(date, invoiceDate)}
                />
              </div>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Finalized</Form.Label>
              <Form.Check
                type="checkbox"
                checked={invoice.finalized}
                onChange={(e) => setFinalized(e.target.checked)}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Paid</Form.Label>
              <Form.Check
                type="checkbox"
                checked={invoice.finalized && invoice.paid}
                onChange={(e) => setPaid(e.target.checked)}
              />
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="inputCustomer">
            <Form.Label className="fw-semibold">Customer</Form.Label>
            <CustomerAutocomplete value={customer} onChange={setCustomer} />
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
            <Form.Text> ({invoiceLines.length})</Form.Text>

            <InvoiceLines items={invoiceLines} />

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
              <p className="fs-3 lh-2 m-0">{formatCurrency(taxTotal, true)}</p>
            </div>
            <div>
              <h3 className="m-0">Total</h3>
              <p className="fs-3 lh-2 m-0">{formatCurrency(total, true)}</p>
            </div>
          </Stack>
        </Card.Body>

        <Card.Footer>
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
              disabled={!isFormValid}
            >
              {isNewInvoice ? 'Create invoice' : 'Save invoice'}
            </Button>
          </Stack>
        </Card.Footer>
      </Card>
    </Form>
  )
}

function validateDeadline(
  deadline?: string | null | Date,
  invoiceDate?: string | null | Date
) {
  if (!deadline || !invoiceDate) return true
  return +new Date(deadline) >= +new Date(invoiceDate)
}

function differenceInDays(
  deadline?: string | null,
  invoiceDate?: string | null
) {
  if (!deadline || !invoiceDate) return 0
  const diff = Number(new Date(deadline)) - Number(new Date(invoiceDate))
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
