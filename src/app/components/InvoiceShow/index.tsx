import { useState, useEffect, useCallback } from 'react'
import { useHistory, useParams } from 'react-router'

import { useApi } from 'api'
import { Invoice } from 'types'
import Table from 'react-bootstrap/esm/Table'
import Container from 'react-bootstrap/esm/Container'
import Breadcrumb from 'react-bootstrap/esm/Breadcrumb'
import Card from 'react-bootstrap/esm/Card'
import Stack from 'react-bootstrap/esm/Stack'
import Button from 'react-bootstrap/esm/Button'

import InvoiceLines from '../InvoiceLines'
import InvoiceCustomer from '../InvoiceCustomer'

const InvoiceShow = () => {
  const { id } = useParams<{ id: string }>()
  const api = useApi()
  const history = useHistory()
  const [invoice, setInvoice] = useState<Invoice>()
  const { refresh, forceRefresh } = useForceRefresh()

  useEffect(() => {
    api.getInvoice(id).then(({ data }) => {
      setInvoice(data)
    })
  }, [api, id, refresh])

  const editInPlace = useCallback(
    async ({ finalized, paid }: { finalized?: true; paid?: true }) => {
      if (!invoice) return
      const payload: NonNullable<Parameters<typeof api.putInvoice>[1]> = {
        invoice: {
          id: invoice.id,
          finalized: finalized || invoice.finalized,
          paid: paid || invoice.paid,
        },
      }

      await api.putInvoice({ id: invoice.id }, payload) // TODO: handle error
      forceRefresh()
    },
    [invoice, api, forceRefresh]
  )

  const setFinalized = () => {
    if (
      window.confirm(
        'Are you sure? An invoice cannot be edited after being finalized.'
      )
    ) {
      editInPlace({ finalized: true })
    }
  }

  const setPaid = () => {
    editInPlace({ paid: true })
  }

  const editInvoice = () => {
    history.push(`/invoice/${invoice?.id}/edit`)
  }

  return !invoice ? (
    <p>loading...</p>
  ) : (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Invoice #{invoice.id}</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="mb-3">
        <Card.Body>
          <Table className="m-0" borderless>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Deadline</th>
                <th>Finalized</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{invoice.id}</td>
                <td>{invoice.date}</td>
                <td>{invoice.deadline}</td>
                <td>{yesOrNo(invoice.finalized)}</td>
                <td>{yesOrNo(invoice.paid)}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>Customer</Card.Header>
        <Card.Body>
          <InvoiceCustomer customer={invoice.customer} />
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>Items</Card.Header>
        <Card.Body>
          <InvoiceLines items={invoice.invoice_lines} />
        </Card.Body>
      </Card>

      <Stack direction="horizontal" gap={2} className="justify-content-end">
        {invoice.finalized === false && (
          <Button variant="warning" onClick={setFinalized}>
            Set as <span className="fw-semibold">finalized</span>
          </Button>
        )}
        {invoice.finalized && invoice.paid === false && (
          <Button variant="success" onClick={setPaid}>
            Set as <span className="fw-semibold">paid</span>
          </Button>
        )}
        <Button
          variant="dark"
          onClick={editInvoice}
          disabled={!invoice || invoice.finalized}
        >
          Edit invoice
        </Button>
      </Stack>
    </Container>
  )
}

function yesOrNo(value: boolean) {
  return value ? 'Yes' : 'No'
}

function useForceRefresh() {
  const [counter, setCounter] = useState(0)
  return {
    forceRefresh: () => setCounter(counter + 1),
    refresh: counter,
  }
}

export default InvoiceShow
