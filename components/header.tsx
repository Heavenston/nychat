import Link from 'next/link'
import Head from 'next/head'
import { PropsWithoutRef } from 'react'

export default function Header(
    props: PropsWithoutRef<{
        path_name?: string
    }>
) {
    return (
        <header className='block text-xl p-3 px-5 flex-grow-0 flex-shrink-0'>
            <Head>
                {props.path_name ? (
                    <title>Nychat - {props.path_name}</title>
                ) : (
                    <title>Nychat</title>
                )}
            </Head>
            <h1 className='inline font-bold text-2xl'>
                <Link href='/'>Nychat</Link>
            </h1>
            {props.path_name && (
                <>
                    <span className='w-10 inline-block' />
                    <span>{props.path_name}</span>
                </>
            )}
        </header>
    )
}
