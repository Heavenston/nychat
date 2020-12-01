export default function JoinChatForm() {
  return (
    <form className='block min-w-80 px-10 p-8 rounded-md shadow-lg bg-gray-100 dark:bg-gray-900'>
      <h3 className='mb-5 text-lg font-semibold border-black dark:border-white border-solid border-b-2'>
        Join a chat
      </h3>
      <label className='block mb-3'>
        <span className='mr-3'>Chat ID</span>
        <input
          className='form-input mt-1 bg-white dark:bg-gray-800 rounded-lg'
          placeholder='Ex. 69FTT'
        />
      </label>
      <button className='rounded text-lg text-center p-2 px-4 block w-full bg-white hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-600'>
        Join
      </button>
    </form>
  )
}
