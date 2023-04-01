import { useCallback, useRef, useState } from 'react'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Pagination from 'react-bootstrap/Pagination'

import { useApi } from 'api'
import { useHistory } from 'react-router-dom'

import { useFetch } from 'app/hooks/use-fetch'
import {
  formatCurrency,
  formatCustomerAddress,
  formatCustomerFullName,
} from 'app/lib/formatting'
import Container from 'react-bootstrap/esm/Container'

const PAGE_SIZE = 15

const InvoicesList = (): React.ReactElement => {
  const api = useApi()
  const history = useHistory()

  const totalPages = useRef(1)
  const totalEntries = useRef(0)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices({
      page: currentPage,
      per_page: PAGE_SIZE,
    })
    totalPages.current = data.pagination.total_pages
    totalEntries.current = data.pagination.total_entries
    return data.invoices
  }, [api, totalPages, currentPage])

  const { data: invoices, loading } = useFetch(fetchInvoices, [])

  return (
    <Container>
      <Stack gap={3}>
        <Stack
          direction="horizontal"
          className="justify-content-between"
          gap={3}
        >
          <h2>Invoices</h2>
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
                <td>{formatCurrency(invoice.total, true)}</td>
                <td>{formatCurrency(invoice.tax, true)}</td>
                <td>{invoice.finalized ? 'Yes' : 'No'}</td>
                <td>{invoice.paid ? 'Yes' : 'No'}</td>
                <td>{invoice.date}</td>
                <td>{invoice.deadline}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {loading && (
          <Alert style={{ backgroundColor: '#fafafa' }}>
            <Spinner size="sm" />
            <small className="ms-3">loading invoices...</small>
          </Alert>
        )}

        {!loading && (
          <Stack direction="horizontal" className="justify-content-between">
            <Pagination>
              {[...Array(totalPages.current)].map((_, i) => {
                const n = i + 1
                return (
                  <Pagination.Item
                    key={n}
                    active={n === currentPage}
                    onClick={() => setCurrentPage(n)}
                  >
                    {n}
                  </Pagination.Item>
                )
              })}
            </Pagination>
            <p>
              Results {paginationRangeStart(currentPage)}-
              {paginationRangeEnd(currentPage)} of {totalEntries.current}
            </p>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}

function paginationRangeStart(currentPage: number) {
  return PAGE_SIZE * (currentPage - 1) + 1
}

function paginationRangeEnd(currentPage: number) {
  return PAGE_SIZE * currentPage
}

export default InvoicesList
