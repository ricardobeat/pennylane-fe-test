import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ApiProvider } from '../api'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
  <React.StrictMode>
    <ApiProvider
      url="https://jean-test-api.herokuapp.com/"
      token="c1f880f2-ca2e-451b-a0eb-caf4354a328f" // TODO: this should be session based
    >
      <App />
    </ApiProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
