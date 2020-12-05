import { PropsWithoutRef, useMemo, ReactElement } from 'react'
import { toHTML } from 'discord-markdown'

export default function Message(
  props: PropsWithoutRef<{
    authorName: string
    sentDate: Date
    content: string
    className?: string
  }>
) {
  const wasToday = useMemo(() => {
    const now = new Date()

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
      <div
        className='dark:text-gray-300'
        dangerouslySetInnerHTML={{
          __html: toHTML(props.content),
        }}
      />
    </div>
  )
}
