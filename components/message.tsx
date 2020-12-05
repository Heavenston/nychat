import { PropsWithChildren, useMemo } from 'react'

export default function Message(
  props: PropsWithChildren<{
    authorName: string
    sentDate: Date
    className?: string
  }>
) {
  const wasToday = useMemo(() => {
    const now = new Date()
    now.setDate(4)

    return (
      props.sentDate.getDate() === now.getDate() &&
      props.sentDate.getMonth() === now.getMonth() &&
      props.sentDate.getFullYear() === now.getFullYear()
    )
  }, [props.sentDate])

  return (
    <div className={`${props.className}`}>
      <div className='pl-0.5 dark:text-white'>
        {props.authorName}{' '}
        <span className='dark:text-gray-400 ml-4'>
          {wasToday
            ? `Today at ${props.sentDate.getHours()}:${props.sentDate.getMinutes()}`
            : props.sentDate.toLocaleDateString()}
        </span>
      </div>
      <div className='dark:text-gray-300'>{props.children}</div>
    </div>
  )
}
