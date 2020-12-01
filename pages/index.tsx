import DefaultLayout from '../layouts/default'

export default function Home() {
  return (
    <DefaultLayout>
      <div className='flex-grow flex flex-wrap gap-8 justify-center items-center'>
        <form className='block min-w-80 px-10 p-8 rounded-md shadow bg-gray-200 dark:bg-gray-900'>
          <h3 className='mb-5 text-lg font-semibold border-black dark:border-white border-solid border-b-2'>
            Join a chat
          </h3>
          <label className='block mb-3'>
            <span className='mr-3'>Chat ID</span>
            <input
              className='form-input mt-1 dark:bg-gray-800 rounded-lg'
              placeholder='Ex. 69FTT'
            />
          </label>
          <button className='rounded text-lg text-center p-2 px-4 block w-full dark:bg-gray-800 dark:hover:bg-gray-600'>
            Join
          </button>
        </form>
        <div className='min-w-80 px-10 p-8 rounded-md shadow bg-gray-200 dark:bg-gray-900'>
          <h3 className='text-lg font-semibold border-black dark:border-white border-solid border-b-2'>
            Create a chat
          </h3>
        </div>
      </div>
    </DefaultLayout>
  )
}
