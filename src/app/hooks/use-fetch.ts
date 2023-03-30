import { useEffect, useMemo, useState } from 'react'

export function useFetch<T>(fn: () => Promise<T>, initialData: T) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T>(initialData)

  useEffect(() => {
    fn().then((result) => {
      setData(result)
      setLoading(false)
    })
    // either we assume load functions can't change, or they will have to be wrapped
    // in useCallback everywhere. going for ergonomics
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return useMemo(() => {
    return {
      data,
      loading,
    }
  }, [data, loading])
}
