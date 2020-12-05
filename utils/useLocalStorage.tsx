import { useEffect, useState } from 'react'

export function useLocalStorage(
  key: string
): [string | null, (v: string | null) => void] {
  const [value, setValue] = useState(
    typeof localStorage === 'undefined' ? null : localStorage.getItem(key)
  )

  useEffect(() => {
    if (value == null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  }, [value])

  return [value, setValue]
}
