export default function CreateChatForm() {
  return (
    <form className='block min-w-80 px-10 p-8 rounded-md shadow-lg bg-gray-100 dark:bg-gray-900'>
      <h3 className='mb-5 text-lg font-semibold border-black dark:border-white border-solid border-b-2'>
        Create a chat
      </h3>
      <label className='flex items-center mb-3'>
        <span className='mr-3'>Chat Name</span>
        <input
          className='form-input flex-grow mt-1 bg-white dark:bg-gray-800 rounded-lg'
          placeholder='A cool name'
        />
      </label>
      <label className='flex items-center mb-3'>
        <span className='mr-3'>Number of participants</span>
        <select className='form-select flex-grow mt-1 bg-white dark:bg-gray-800 rounded-lg'>
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <option key={i}>{i + 2}</option>
            ))}
        </select>
      </label>
      <button className='rounded text-lg text-center p-2 px-4 block w-full bg-white hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-600'>
        Create
      </button>
    </form>
  )
}
