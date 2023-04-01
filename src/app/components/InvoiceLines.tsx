import Table from 'react-bootstrap/esm/Table'
import { formatCurrency } from 'app/lib/formatting'
import type { Invoice } from 'types'

interface Props {
  items: Invoice['invoice_lines']
  borderless?: React.ComponentProps<typeof Table>['borderless']
  editable?: boolean
}

export default function InvoiceLines({
  items,
  borderless = false,
  editable,
}: Props) {
  return (
    <Table borderless={borderless}>
      <thead>
        <tr>
          <th>Quantity</th>
          <th>Name</th>
          <th>Product ID</th>
          <th>Unit</th>
          <th>VAT</th>
          <th>Unit Price</th>
          <th>Tax</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 && (
          <tr>
            <td className="text-center text-muted" colSpan={8}>
              No items added
            </td>
          </tr>
        )}
        {items.map((item, i) => {
          return (
            <tr key={`invoice-line-${i}`}>
              <td>
                {editable ? (
                  <input type="text" value={item.quantity} />
                ) : (
                  item.quantity
                )}
              </td>
              <td>{item.label}</td>
              <td>{item.product_id}</td>
              <td>{item.unit}</td>
              <td>{item.vat_rate}%</td>
              <td>{formatCurrency(item.product.unit_price, true)}</td>
              <td>{formatCurrency(item.tax, true)}</td>
              <td>{formatCurrency(item.price, true)}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}
