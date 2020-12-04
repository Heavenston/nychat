import { FormEvent } from 'react'
import DefaultLayout from '~/layouts/default'

export default function Home() {
  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
              className='min-w-0 form-input flex-shrink flex-grow mt-1 bg-white dark:bg-gray-800 rounded-lg'
              placeholder='A cool name'
            />
          </label>
          <button className='focus:outline-none focus:ring rounded text-lg text-center p-2 px-4 block w-full bg-white hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-600'>
            Create
          </button>
        </form>
      </div>
    </DefaultLayout>
  )
}
