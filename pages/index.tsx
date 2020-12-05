import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import DefaultLayout from '~/layouts/default'
import Link from 'next/link'
import { useLocalStorage } from '~/utils/useLocalStorage'

export default function Home() {
  const router = useRouter()
  const [chatName, setChatName] = useState('')
  const [loading, setLoading] = useState(false)
  const [lsSecret, setLsSecret] = useLocalStorage('secret')
  const [lsUser, setLsUser] = useLocalStorage('secret')

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    ;(async () => {
      e.preventDefault()
      if (loading) return
      if (chatName.length > 2 && chatName.length < 20) {
        setChatName('')
      }
      setLoading(true)
      const r = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: chatName,
        }),
      })
      if (!r.ok) {
        console.error(r.json())
        return
      }
      const { user, userSecret } = await r.json()
      setLsUser(JSON.stringify(user))
      setLsSecret(userSecret)
      router.push('/chat')
    })()
  }

  return (
    <DefaultLayout>
      <div className='flex-grow flex-shrink flex flex-wrap gap-8 justify-center content-center items-center'>
        <form
          className='max-w-screen flex-grow-0 block min-w-80 px-10 p-8 rounded-md shadow-lg bg-gray-100 dark:bg-gray-900'
          onSubmit={onFormSubmit}
        >
          <h3 className='mb-5 text-lg font-semibold border-black dark:border-white border-solid border-b-2'>
            Create a chat
          </h3>
          <label className='flex items-center mb-3'>
            <span className='mr-3 whitespace-nowrap'>Chat Name</span>
            <input
              value={chatName}
              maxLength={20}
              onChange={e => setChatName(e.target.value)}
              className='min-w-0 form-input flex-shrink flex-grow mt-1 bg-white dark:bg-gray-800 rounded-lg'
              placeholder='A cool name'
            />
          </label>
          <button className='focus:outline-none focus:ring rounded text-lg text-center p-2 px-4 block w-full bg-white hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-600'>
            Create
          </button>
        </form>
        {lsSecret !== null && (
          <div className='max-w-screen flex-grow-0 block min-w-80 px-10 p-8 rounded-md shadow-lg bg-gray-100 dark:bg-gray-900'>
            <div className='mb-3'>You are currently in a chat !</div>
            <div className='flex gap-2 flex-wrap items-center'>
              <Link href='/chat'>
                <button className='p-1 px-3 bg-green-400 dark:bg-green-600 rounded'>
                  Go back to it
                </button>
              </Link>
              <span>Or</span>
              <button
                onClick={() => {
                  setLsSecret(null)
                  setLsUser(null)
                }}
                className='p-1 px-3 bg-red-400 dark:bg-red-600 rounded'
              >
                Forget
              </button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  )
}
