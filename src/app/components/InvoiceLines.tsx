import Table from 'react-bootstrap/esm/Table'
import { formatCurrency } from 'app/lib/formatting'
import type { Product } from 'types'
import Button from 'react-bootstrap/esm/Button'
import { NewInvoiceLineWithProduct } from 'types/invoice'

interface Props {
  items: NewInvoiceLineWithProduct[]
  borderless?: React.ComponentProps<typeof Table>['borderless']
  editable?: boolean
  onDelete?: (index: number) => void
  onChangeQuantity?: (index: number, product: Product, quantity: number) => void
}

export default function InvoiceLines({
  items,
  borderless = false,
  editable,
  onDelete,
  onChangeQuantity,
}: Props) {
  return (
    <Table borderless={borderless} className="align-baseline">
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
          {editable ? <td></td> : null}
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
                  <input
                    className="form-control"
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) =>
                      onChangeQuantity?.(i, item.product, +e.target.value)
                    }
                    style={{ width: 80 }}
                  />
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
              {editable && (
                <td className="text-end">
                  <Button
                    variant="outline-danger"
                    onClick={() => onDelete?.(i)}
                    size="sm"
                    title="Delete line"
                  >
                    {`Ｘ`}
                  </Button>
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}
