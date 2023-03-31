import { useCallback } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'

import { Customer } from 'types'
import { useApi } from 'api'

interface Props {
  value?: Customer
  onChange: (Customer: Customer) => void
}

const defaultAdditional = { page: 1 }

const getCustomerLabel = (customer: Customer) => {
  return `${customer.first_name} ${customer.last_name}`
}

const getOptionValue = (customer: Customer) => {
  return customer.id
}

const CustomerAutocomplete = ({ value, onChange }: Props) => {
  const api = useApi()

  const loadOptions = useCallback(
    async (search, loadedOptions, { page }) => {
      const { data } = await api.getSearchCustomers({
        query: search,
        per_page: 30,
        page,
      })

      return {
        options: data.customers,
        hasMore: data.pagination.page < data.pagination.total_pages,
        additional: { page: page + 1 },
      }
    },
    [api]
  )

  return (
    <AsyncPaginate
      placeholder={`ex: "Alejandro"`}
      getOptionLabel={getCustomerLabel}
      getOptionValue={getOptionValue}
      additional={defaultAdditional}
      value={value}
      onChange={onChange}
      loadOptions={loadOptions}
      shouldLoadMore={shouldLoadMore}
      debounceTimeout={100}
    />
  )
}

/**
 * Start loading halfway through the current "page", instead of only when you reach the bottom
 *
 * TODO: use react-windowed-select, get total count from API, and render a virtualized list with placeholders,
 * then on view, calculate current page to load. Would make scrolling feel more natural when loading the full dataset
 */
function shouldLoadMore(
  scrollHeight: number,
  clientHeight: number,
  scrollTop: number
) {
  const bottom = scrollHeight - clientHeight - clientHeight / 2
  return bottom < scrollTop
}

export default CustomerAutocomplete
