import { useCallback, useRef, useState } from 'react'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Stack from 'react-bootstrap/Stack'
import Table from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'
import Pagination from 'react-bootstrap/Pagination'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'

import { useApi } from 'api'
import { useHistory } from 'react-router-dom'

import { useFetch } from 'app/hooks/use-fetch'
import {
  formatCurrency,
  formatCustomerAddress,
  formatCustomerFullName,
} from 'app/lib/formatting'
import Container from 'react-bootstrap/esm/Container'

type FilterState = { finalized?: boolean; paid?: boolean }

const PAGE_SIZE = 10

const InvoicesList = (): React.ReactElement => {
  const api = useApi()
  const history = useHistory()

  const totalPages = useRef(1)
  const totalEntries = useRef(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState<string>() // prototype

  const [filter, setFilter] = useState<FilterState>({}) // prototype
  const toggleFilter = (input: FilterState) => {
    setFilter((f) => ({ ...f, ...input }))
    setCurrentPage(1)
  }

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices({
      page: currentPage,
      per_page: PAGE_SIZE,
      filter: getQueryFilters(query, filter),
    })
    totalPages.current = data.pagination.total_pages
    totalEntries.current = data.pagination.total_entries
    return data.invoices
  }, [api, totalPages, currentPage, query, filter])

  const { data: invoices, loading } = useFetch(fetchInvoices, [])

  const [batchEditing, setBatchEditing] = useState(false)
  const [batchIds, setBatchIds] = useState<Record<number, boolean>>({})

  const toggleBatchEdit = () => {
    setBatchEditing((state) => !state)
    setBatchIds({})
  }

  const addToBatch = (invoiceId: number) => {
    setBatchIds((ids) => ({ ...ids, [invoiceId]: true }))
  }

  const removeFromBatch = (invoiceId: number) => {
    setBatchIds((ids) => {
      ids = { ...ids }
      delete ids[invoiceId]
      return ids
    })
  }

  const selectRow = (invoiceId: number) => {
    if (batchIds[invoiceId]) {
      removeFromBatch(invoiceId)
    } else {
      addToBatch(invoiceId)
    }
  }

  const handleRowClick = (invoiceId: number) => {
    if (batchEditing) {
      selectRow(invoiceId)
    } else {
      history.push(`/invoice/${invoiceId}`)
    }
  }

  return (
    <Container>
      <Stack gap={3}>
        <Stack
          direction="horizontal"
          className="justify-content-between"
          gap={3}
        >
          <h2>Invoices</h2>

          <Stack direction="horizontal" gap={2}>
            {/* example - not implemented */}
            <input
              type="search"
              className="form-control"
              style={{ width: '14em' }}
              placeholder="Search by Customer ID..."
              hidden={batchEditing}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Button
              onClick={toggleBatchEdit}
              variant="light"
              hidden={batchEditing}
            >
              Batch edit
            </Button>

            <Button
              onClick={() => history.push(`/invoice/new`)}
              hidden={batchEditing}
            >
              Create invoice
            </Button>

            {/* prototype */}
            {batchEditing && (
              <BatchEditingActions
                batchIds={batchIds}
                onCancel={toggleBatchEdit}
              />
            )}
          </Stack>
        </Stack>

        <Stack
          direction="horizontal"
          gap={2}
          className="justify-content-end align-items-baseline"
        >
          <Form.Text>Show only</Form.Text>
          <Form.Check
            type="switch"
            label="Paid"
            onChange={(e) => toggleFilter({ paid: e.target.checked })}
          />
          <Form.Check
            type="switch"
            label="Finalized"
            onChange={(e) => toggleFilter({ finalized: e.target.checked })}
          />
        </Stack>

        <Table striped bordered hover>
          <thead>
            <tr>
              {batchEditing && <th>&nbsp;</th>}
              <th>Invoice #</th>
              <th>Customer</th>
              <th>CID</th>
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
                onClick={() => handleRowClick(invoice.id)}
              >
                {batchEditing && (
                  <td>
                    <input
                      type="checkbox"
                      checked={!!batchIds[invoice.id]}
                      onChange={() => selectRow(invoice.id)}
                    />
                  </td>
                )}
                <td>{invoice.id}</td>
                <td>{formatCustomerFullName(invoice.customer)}</td>
                <td>{invoice.customer_id}</td>
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
            <p>{getResultsRange(currentPage, totalEntries.current)}</p>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}

function BatchEditingActions(props: {
  onCancel: () => void
  batchIds: Record<number, boolean>
}) {
  const notImplemented = () =>
    alert('Edit: ' + Object.keys(props.batchIds).join(', '))

  return (
    <Stack direction="horizontal" gap={2} className="justify-content-end">
      <span className="me-2">
        {Object.keys(props.batchIds).length} invoices selected
      </span>
      <Dropdown>
        <Dropdown.Toggle variant="warning" id="dropdown-basic">
          Batch actions
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={notImplemented}>
            Set all as paid
          </Dropdown.Item>
          <Dropdown.Item onClick={notImplemented}>
            Set all as finalized
          </Dropdown.Item>
          <Dropdown.Item onClick={notImplemented}>Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Button onClick={props.onCancel} variant="light">
        Cancel
      </Button>
    </Stack>
  )
}

function getResultsRange(current: number, total: number) {
  const first = PAGE_SIZE * (current - 1) + 1
  const last = Math.min(PAGE_SIZE * current, total)
  return `Results ${first}-${last} of ${total}`
}

function getQueryFilters(query?: string, filters?: Record<string, boolean>) {
  const payload = []

  if (query) {
    payload.push({ field: 'customer_id', operator: 'eq', value: query })
  }

  if (filters?.finalized) {
    payload.push({ field: 'finalized', operator: 'eq', value: true })
  }

  if (filters?.paid) {
    payload.push({ field: 'finalized', operator: 'eq', value: true })
  }

  return payload.length > 0 ? JSON.stringify(payload) : undefined
}

export default InvoicesList
