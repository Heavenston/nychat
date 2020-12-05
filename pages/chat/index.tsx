import { EventSourcePolyfill } from 'event-source-polyfill'
import DefaultLayout from '~/layouts/default'
import Message from '~/components/message'
import { useState, FormEvent, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import { stringify } from 'querystring'
import { mdiAccount, mdiCrown, mdiDelete, mdiLink, mdiPlus } from '@mdi/js'
import { Icon } from '@mdi/react'
import copy from 'copy-to-clipboard'

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
            date: new Date(data.date),
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

  const deleteUser = (id: string) => () => {
    fetch(`/api/user/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: currentUser?.secret || '',
      },
    }).then(async r => {
      if (!r.ok) {
        console.log(await r.json())
        return
      }
      currentUser?.chat.users.splice(
        currentUser?.chat.users.findIndex(u => u.id === id) || 0,
        1
      )
      currentUser && setCurrentUser({ ...currentUser })
    })
  }
  const createUser = () => {
    fetch(`/api/user`, {
      method: 'POST',
      headers: {
        authorization: currentUser?.secret || '',
      },
    }).then(async r => {
      if (!r.ok) {
        console.log(await r.json())
        return
      }
      const { id, name, admin } = await r.json()
      currentUser?.chat.users.push({
        admin,
        id,
        name,
      })
      currentUser && setCurrentUser({ ...currentUser })
    })
  }
  const copyLink = (id: string) => async () => {
    const url = new URL(location.href)
    const r = await fetch(`/api/user/${id}`, {
      method: 'GET',
      headers: {
        authorization: currentUser?.secret || '',
      },
    })
    const { secret } = await r.json()
    url.pathname = `/chat/${secret}`
    copy(url.toString())
  }

  return (
    <DefaultLayout path_name={`${currentUser?.chat.name || ''}`}>
      <div className='flex justify-center items-center flex-grow p-2 md:p-8 xl:px-64'>
        <div className='w-full h-full bg-gray-200 shadow dark:bg-gray-700 rounded overflow-hidden flex p-3 gap-3'>
          <div className='flex flex-col gap-3 flex-grow'>
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
                      sentDate={m.date}
                      authorName={
                        currentUser?.chat.users.find(u => u.id === m.author)
                          ?.name || 'ERROR'
                      }
                      content={m.content}
                      className='mb-2'
                    />
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
          <div className='w-52 relative overflow-hidden overflow-y-scroll'>
            <div className='absolute inset-0 flex flex-col gap-3 p-2'>
              {currentUser?.admin ? (
                <>
                  {currentUser?.chat.users.map(user => (
                    <div
                      key={user.name}
                      className='p-2 px-3 dark:hover:bg-gray-600 rounded flex items-center'
                    >
                      <span>{user.name}</span>
                      {user.id === currentUser?.id && (
                        <span>
                          <Icon path={mdiAccount} size={0.8} />
                        </span>
                      )}
                      {user.admin && (
                        <span className='px-1'>
                          <Icon
                            path={mdiCrown}
                            size={0.9}
                            className='text-yellow-300 inline'
                          />
                        </span>
                      )}
                      <span className='flex-grow' />
                      <button
                        onClick={copyLink(user.id)}
                        className='focus:outline-none focus:ring text-gray-300 flex-shrink hover:text-white'
                      >
                        <Icon path={mdiLink} size={0.9} />
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={deleteUser(user.id)}
                          className='focus:outline-none focus:ring ml-1 text-gray-300 flex-shrink hover:text-red-400'
                        >
                          <Icon path={mdiDelete} size={0.9} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => createUser()}
                    className='focus:outline-none focus:ring p-2 flex justify-center items-center cursor-pointer dark:hover:bg-gray-600 rounded'
                  >
                    <Icon path={mdiPlus} size={1} />
                  </button>
                </>
              ) : (
                <>
                  {currentUser?.chat.users.map(user => (
                    <div key={user.name} className='p-2 px-3 rounded'>
                      {user.name}
                      {user.id === currentUser?.id && (
                        <Icon path={mdiAccount} size={0.8} className='inline' />
                      )}
                      {user.admin && (
                        <span className='px-1'>
                          <Icon
                            path={mdiCrown}
                            size={0.9}
                            className='text-yellow-300 inline'
                          />
                        </span>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
