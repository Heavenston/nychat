import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import DefaultLayout from '~/layouts/default'

export default function Chat() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (router.query !== {}) {
      const abortController = new AbortController()
      const secret = router.query.id
      if (typeof secret !== 'string') throw 'wtf'
      fetch(`/api/user/${secret}`, {
        method: 'GET',
        signal: abortController.signal,
      })
        .then(async r => {
          if (r.ok) {
            const user = await r.json()
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('secret', secret)
            localStorage.router.push('/chat')
          } else {
            setIsLoading(false)
          }
        })
        .catch(e => {
          if (abortController.signal.aborted) return
          console.error(e)
          setIsLoading(false)
        })
      return () => abortController.abort()
    }
  }, [router.query])

  return (
    <DefaultLayout path_name='Chat join'>
      <div className='flex justify-center items-center flex-grow'>
        {isLoading ? (
          <div className='text-lg'>Loading...</div>
        ) : (
          <div className='flex-shrink-0 flex-grow-0 text-lg w-72 max-w-screen p-4'>
            <h1 className='text-red-500 text-xl font-bold'>OH NO!</h1>
            <div>This chat invite is not valid !</div>
            <div>Maybe it's owner has deleted it</div>
            <div className='w-full flex justify-end mt-4'>
              <Link href='/'>
                <button className='p-2 px-5 bg-gray-900 rounded hover:bg-red-500 focus:outline-none focus:ring'>
                  Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  )
}
