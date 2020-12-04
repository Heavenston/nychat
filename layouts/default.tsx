import { PropsWithChildren } from 'react'
import Header from '~/components/header'

export default function DefaultLayout(
  props: PropsWithChildren<{
    path_name?: string
  }>
) {
  return (
    <div className='w-screen min-h-screen dark:bg-gray-800 dark:text-white flex flex-col'>
      <Header path_name={props.path_name} />
      <div className='flex-grow flex'>{props.children}</div>
    </div>
  )
}
