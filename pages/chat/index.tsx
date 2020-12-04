import DefaultLayout from '~/layouts/default'
import Message from '~/components/message'
import { useState, FormEvent } from 'react'

export default function ChatIndex() {
  const [messages, setMessages] = useState(
    [] as { author: string; content: string }[]
  )
  const [currentMessage, setCurrentMessage] = useState('')

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessages([
      ...messages,
      {
        author: 'Robert',
        content: currentMessage,
      },
    ])
    setCurrentMessage('')
  }

  return (
    <DefaultLayout path_name='Chat'>
      <div className='flex justify-center items-center flex-grow p-2 md:p-8 xl:px-64'>
        <div className='w-full h-full bg-gray-200 shadow dark:bg-gray-700 rounded overflow-hidden flex flex-col p-3 gap-3'>
          <div className='flex-grow flex-shrink-0 px-2 overflow-y-scroll relative'>
            <div className='absolute'>
              {messages.map((m, i) => (
                <Message key={i} authorName={m.author} className='mb-2'>
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
