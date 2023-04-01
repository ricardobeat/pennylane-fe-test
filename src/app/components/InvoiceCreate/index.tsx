import Breadcrumb from 'react-bootstrap/esm/Breadcrumb'
import Container from 'react-bootstrap/esm/Container'

import { formatDate } from 'app/lib/formatting'

import { useApi } from 'api'
import { useHistory } from 'react-router-dom'
import type { InvoiceCreatePayload, InvoiceUpdatePayload } from 'types'

import InvoiceEditor from '../InvoiceEditor'

const InvoiceCreate = () => {
  const api = useApi()
  const history = useHistory()

  const submit = (invoice: InvoiceCreatePayload) => {
    api.postInvoices(null, { invoice }).then((res) => {
      if (res.status === 200) {
        history.push('/invoice/' + res.data.id)
      } else {
        alert('Something went wrong ¯_(ツ)_/¯') //TODO: proper error handling on the page
        console.error('Failed to create invoice: %o', res)
      }
    })
  }

  const draftInvoice: Partial<InvoiceCreatePayload> = {
    date: formatDate(new Date()),
    deadline: formatDate(getInitialDeadline()),
  }

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Create invoice</Breadcrumb.Item>
      </Breadcrumb>

      <h2>New invoice</h2>

      <InvoiceEditor
        invoice={draftInvoice}
        onSubmit={(invoice) => {
          submit(invoice as InvoiceCreatePayload)
        }}
      />
    </Container>
  )
}

function getInitialDeadline() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date
}

export default InvoiceCreate
