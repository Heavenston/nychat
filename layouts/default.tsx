import { PropsWithChildren } from 'react'
import Header from '../components/header'

export default function DefaultLayout(
    props: PropsWithChildren<{
        path_name?: string
    }>
) {
    return (
        <div className='w-screen h-screen dark:bg-gray-900 dark:text-white'>
            <Header path_name={props.path_name} />
            <div>{props.children}</div>
        </div>
    )
}
