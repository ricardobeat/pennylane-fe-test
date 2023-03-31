import { Customer } from 'types'

// FIXME: is customer actually optional in the backend / db schema?
// if so it should be non-nullable after receiving the API response
export function formatCustomerAddress(customer?: Customer) {
  if (!customer) return ''
  return `${customer.address}, ${customer.zip_code} ${customer.city}`
}

export function formatCustomerFullName(customer?: Customer) {
  if (!customer) return ''
  return `${customer.first_name} ${customer.last_name}`
}

const displayFormat = new Intl.NumberFormat(window.navigator.language, {
  style: 'decimal',
  useGrouping: true,
  minimumFractionDigits: 2,
})

const apiFormat = new Intl.NumberFormat(window.navigator.language, {
  style: 'decimal',
  useGrouping: false,
  minimumFractionDigits: 1,
})

export function formatCurrency(input: number | string = 0): string {
  return displayFormat.format(Number(input)) //FIXME: should be stricter about input, not assume dot separator
}

/**
 * Formats currency value for API consumption
 * FIXME: rounding needs to match the rounding function used in the backend API
 */
export function formatCurrencyValue(input: number): string {
  return apiFormat.format(input)
}
