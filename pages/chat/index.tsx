import { EventSourcePolyfill } from 'event-source-polyfill'
import DefaultLayout from '~/layouts/default'
import Message from '~/components/message'
import { useState, FormEvent, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import { stringify } from 'querystring'

interface CurrentUser {
  id: string
  name: string
  admin: boolean
  secret: string
  chat: {
    id: string
    name: string
    users: {
      id: string
      name: string
      admin: string
    }[]
  }
}

export default function ChatIndex() {
  const [messagesChanged, setMessagesChanged] = useState(0)
  const [messages, setMessages] = useState(
    {} as {
      [id: string]: { content: string; author: string; date: Date }
    }
  )
  const [currentMessage, setCurrentMessage] = useState('')
  const [currentUser, setCurrentUser] = useState(null as CurrentUser | null)
  const [isSending, setIsSending] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const current = messageRef.current
    if (current) {
      current.scrollTop = current.scrollHeight
    }
  }, [messagesChanged, messageRef])

  useEffect(() => {
    ;(async () => {
      const secret = localStorage.getItem('secret')
      if (!secret) {
        router.push('/')
        return
      }
      let user: CurrentUser
      {
        const r = await fetch(`/api/user/${secret}`)
        if (!r.ok) {
          localStorage.removeItem('user')
          localStorage.removeItem('secret')
          router.push('/')
          return
        }
        user = await r.json()
        user.secret = secret
      }
      setCurrentUser(user)

      const evtSource = new EventSourcePolyfill('/api/chat/listen', {
        headers: {
          authorization: user.secret,
        },
      })

      for (let id in messages) delete messages[id]

      evtSource.onmessage = (e: MessageEvent) => {
        const data = JSON.parse(e.data)
        if (data.type === 'messageSend') {
          messages[data.id] = {
            author: data.author,
            content: data.content,
            date: new Date(),
          }
          setMessagesChanged(Date.now())
        } else if (data.type === 'messageDelete') {
          delete messages[data.id]
          setMessagesChanged(Date.now())
        }
      }

      return () => evtSource.close()
    })()
  }, [])

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (
      isSending ||
      currentMessage.length <= 0 ||
      currentMessage.length >= 1000
    ) {
      return
    }
    setIsSending(true)
    fetch(`/api/chat/message`, {
      method: 'POST',
      body: JSON.stringify({
        content: currentMessage,
      }),
      headers: {
        'content-type': 'application/json',
        authorization: currentUser?.secret || '',
      },
    })
      .then(async r => {
        if (!r.ok) console.error(await r.json())
        else setIsSending(false)
      })
      .catch(e => console.error(e))
    setCurrentMessage('')
  }

  return (
    <DefaultLayout path_name='Chat'>
      <div className='flex justify-center items-center flex-grow p-2 md:p-8 xl:px-64'>
        <div className='w-full h-full bg-gray-200 shadow dark:bg-gray-700 rounded overflow-hidden flex flex-col p-3 gap-3'>
          <div
            className='flex-grow flex-shrink-0 px-2 overflow-y-scroll relative'
            ref={messageRef}
          >
            <div className='absolute'>
              {Object.entries(messages)
                .sort(([, a], [, b]) => a.date.getTime() - b.date.getTime())
                .map(([id, m]) => (
                  <Message
                    key={id}
                    authorName={
                      currentUser?.chat.users.find(u => u.id === m.author)
                        ?.name || 'ERROR'
                    }
                    className='mb-2'
                  >
                    {m.content}
                  </Message>
                ))}
            </div>
          </div>
          <form
            onSubmit={sendMessage}
            className='flex flex-grow-0 flex-shrink-0 gap-3'
          >
            <input
              value={currentMessage}
              onChange={e => {
                setCurrentMessage(e.target.value)
              }}
              className='form-input flex-grow rounded bg-gray-300 dark:bg-gray-600'
            />
            <button className='rounded focus:outline-none focus:ring px-10 text-center align-middle leading-full bg-gray-300 dark:bg-gray-600'>
              Send
            </button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  )
}
