import { useCallback } from 'react'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'

import { useApi } from 'api'
import { useHistory } from 'react-router-dom'

import './InvoicesList.css'
import { useFetch } from 'app/hooks/use-fetch'
import {
  formatCustomerAddress,
  formatCustomerFullName,
} from 'app/lib/formatting'
import Container from 'react-bootstrap/esm/Container'

const InvoicesList = (): React.ReactElement => {
  const api = useApi()
  const history = useHistory()

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices()
    return data.invoices
  }, [api])

  const { data: invoices, loading } = useFetch(fetchInvoices, [])

  if (loading) {
    return (
      <Alert variant="secondary">
        <Spinner size="sm" />
        <small className="ml-3">loading invoices...</small>
      </Alert>
    )
  }

  return (
    <Container>
      <Stack gap={3}>
        <Stack direction="horizontal" className="justify-content-end" gap={3}>
          <Button onClick={() => history.push(`/invoice/new`)}>
            Create invoice
          </Button>
        </Stack>
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
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="row-clickable"
                onClick={() => history.push(`/invoice/${invoice.id}`)}
              >
                <td>{invoice.id}</td>
                <td>{formatCustomerFullName(invoice.customer)}</td>
                <td>{formatCustomerAddress(invoice.customer)}</td>
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
      </Stack>
    </Container>
  )
}

export default InvoicesList
