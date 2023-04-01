import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router'

import { useApi } from 'api'
import { Invoice, InvoiceUpdatePayload } from 'types'
import Breadcrumb from 'react-bootstrap/esm/Breadcrumb'
import Container from 'react-bootstrap/esm/Container'
import InvoiceEditor from '../InvoiceEditor'

const InvoiceShow = () => {
  const api = useApi()
  const history = useHistory()

  const { id } = useParams<{ id: string }>()
  const [invoice, setInvoice] = useState<Invoice>()

  useEffect(() => {
    api.getInvoice(id).then(({ data }) => {
      setInvoice(data)
    })
  }, [api, id])

  const submit = (invoice: InvoiceUpdatePayload) => {
    console.log('putting', invoice)
    api.putInvoice({ id: invoice.id }, { invoice }).then((res) => {
      if (res.status === 200) {
        history.push('/invoice/' + res.data.id)
      } else {
        alert('Something went wrong ¯_(ツ)_/¯') //TODO: proper error handling on the page
        console.error('Failed to create invoice: %o', res)
      }
    })
  }

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Edit invoice #{invoice?.id}</Breadcrumb.Item>
      </Breadcrumb>

      <h2>Edit invoice</h2>

      {!!invoice && (
        <InvoiceEditor
          invoice={invoice}
          onSubmit={(invoice) => {
            submit(invoice as InvoiceUpdatePayload)
          }}
        />
      )}
    </Container>
  )
}

export default InvoiceShow
