import { useState, useEffect } from 'react'
import { useParams } from 'react-router'

import { useApi } from 'api'
import { Invoice } from 'types'
import Table from 'react-bootstrap/esm/Table'

const InvoiceShow = () => {
  const { id } = useParams<{ id: string }>()
  const api = useApi()
  const [invoice, setInvoice] = useState<Invoice>()

  useEffect(() => {
    api.getInvoice(id).then(({ data }) => {
      setInvoice(data)
    })
  }, [api, id])

  return (
    <div>
      <pre>{JSON.stringify(invoice ?? '', null, 2)}</pre>
      {invoice ? (
        <Table borderless>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer ID</th>
              <th>Finalized</th>
              <th>Paid</th>
            </tr>
          </thead>
          <tbody>
            {invoice?.invoice_lines.map((item) => (
              <tr>
                <td>{item.id}</td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </Table>
      ) : null}
    </div>
  )
}

export default InvoiceShow
