import { PropsWithChildren } from 'react'

export default function Message(
  props: PropsWithChildren<{
    authorName: string
    className?: string
  }>
) {
  return (
    <div className={`${props.className}`}>
      <div className='pl-0.5 dark:text-white'>{props.authorName}</div>
      <div className='dark:text-gray-200'>{props.children}</div>
    </div>
  )
}
