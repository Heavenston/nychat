import DefaultLayout from '../layouts/default'
import JoinChatForm from '../components/joinChatForm'
import CreateChatForm from '../components/createChatForm'

export default function Home() {
  return (
    <DefaultLayout>
      <div className='flex-grow flex-shrink flex flex-wrap gap-8 justify-center content-center items-center'>
        <JoinChatForm />
        <CreateChatForm />
      </div>
    </DefaultLayout>
  )
}
