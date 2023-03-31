import ReactDatePicker from 'react-datepicker'
import { Invoice } from 'types'

export function InvoiceDetails({
  invoice,
  editing,
  setDeadline,
}: {
  invoice: Invoice
  editing: boolean
  setDeadline: (date: Date) => void
}) {
  return (
    <dl className="invoice-details mb-3">
      <div>
        <dt>Invoice #</dt>
        <dd>{invoice.id || '--'}</dd>
      </div>
      <div>
        <dt>Date</dt>
        <dd>{invoice.date}</dd>
      </div>
      <div>
        <dt>Deadline</dt>
        <dd>
          {editing ? (
            <ReactDatePicker
              className="form-control"
              value={invoice.deadline ? invoice.deadline : undefined}
              onChange={(date) => date && setDeadline(date)}
            />
          ) : (
            invoice.deadline
          )}
        </dd>
      </div>
    </dl>
  )
}
