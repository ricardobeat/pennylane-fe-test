import Container from 'react-bootstrap/Container'

export default function Header() {
  return (
    <header>
      <Container className="mt-5 mb-5">
        <h1>Fern Hill</h1>
        <p className="text-muted">Invoices</p>
      </Container>
    </header>
  )
}
