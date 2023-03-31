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
