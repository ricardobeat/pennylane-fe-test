import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import './app.css'

import InvoicesList from './components/InvoicesList'
import InvoiceShow from './components/InvoiceShow'
import InvoiceCreate from './components/InvoiceCreate'
import InvoiceEdit from './components/InvoiceEdit'
import Header from './components/Header'

function App() {
  return (
    <div className="px-5">
      <Header />
      <Router>
        <Switch>
          <Route path="/invoice/new" component={InvoiceCreate} />
          <Route path="/invoice/:id/edit" component={InvoiceEdit} />
          <Route path="/invoice/:id" component={InvoiceShow} />
          <Route path="/" component={InvoicesList} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
