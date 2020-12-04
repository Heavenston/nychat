import DefaultLayout from '~/layouts/default'

export default function ChatIndex() {
  return (
    <DefaultLayout path_name='Chat'>
      <div className='flex justify-center items-center flex-grow'>
        <h1 className='text-xl text-red-500'>Hello</h1>
      </div>
    </DefaultLayout>
  )
}
