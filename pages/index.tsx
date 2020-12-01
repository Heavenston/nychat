import DefaultLayout from '../layouts/default'

export default function Home() {
  return (
    <DefaultLayout>
      <div className='flex-grow flex justify-center items-center'>
        <div className='min-w-80 px-10 p-8 rounded-md shadow bg-gray-200 dark:bg-gray-900'>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold border-black dark:border-white border-solid border-b-2'>
              Join a chat
            </h3>
          </div>
          <div>
            <h3 className='text-lg font-semibold border-black dark:border-white border-solid border-b-2'>
              Create a chat
            </h3>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
