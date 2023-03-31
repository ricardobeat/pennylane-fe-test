import { useEffect, useMemo, useState } from 'react'

/**
 * Note that the input function MUST be memoized. Usage example:
 *
 *   const getUser = useCallback(() => api.getUser(id).then(data => data.user), [id])
 *   const { data: user } = useFetch(getUser, {})
 *
 * (I'd use something like react-query for this)
 */

export function useFetch<T>(fn: () => Promise<T>, initialData: T) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T>(initialData)

  useEffect(() => {
    fn().then((result) => {
      setData(result)
      setLoading(false)
    })
  }, [fn])

  return useMemo(() => {
    return {
      data,
      loading,
    }
  }, [data, loading])
}
