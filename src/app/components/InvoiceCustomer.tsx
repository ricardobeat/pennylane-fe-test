import {
  formatCustomerFullName,
  formatCustomerAddress,
} from 'app/lib/formatting'
import type { Invoice } from '../../types'

interface Props {
  customer: Invoice['customer']
}

export default function InvoiceCustomer({ customer }: Props) {
  return customer ? (
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
  ) : null
}
