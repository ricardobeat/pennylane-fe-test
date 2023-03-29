import { useApi } from 'api'
import { Invoice } from 'types'
import { useEffect, useCallback, useState } from 'react'
import Table from 'react-bootstrap/Table'
import './InvoicesList.css'
import { useHistory } from 'react-router-dom'

const InvoicesList = (): React.ReactElement => {
  const api = useApi()
  const history = useHistory()

  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices()
    setInvoicesList(data.invoices)
  }, [api])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Customer</th>
          <th>Address</th>
          <th>Total</th>
          <th>Tax</th>
          <th>Finalized</th>
          <th>Paid</th>
          <th>Date</th>
          <th>Deadline</th>
        </tr>
      </thead>
      <tbody>
        {invoicesList.map((invoice) => (
          <tr
            key={invoice.id}
            className="row-clickable"
            onClick={() => history.push(`/invoice/${invoice.id}`)}
          >
            <td>{invoice.id}</td>
            <td>
              {invoice.customer?.first_name} {invoice.customer?.last_name}
            </td>
            <td>
              {invoice.customer?.address}, {invoice.customer?.zip_code}{' '}
              {invoice.customer?.city}
            </td>
            <td>{invoice.total}</td>
            <td>{invoice.tax}</td>
            <td>{invoice.finalized ? 'Yes' : 'No'}</td>
            <td>{invoice.paid ? 'Yes' : 'No'}</td>
            <td>{invoice.date}</td>
            <td>{invoice.deadline}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default InvoicesList
