import DefaultLayout from '../layouts/default'

export default function Home() {
    return (
        <DefaultLayout>
            <div className='flex-grow flex justify-center items-center'>
                <div className='w-52 h-52 rounded-md shadow bg-gray-200 dark:bg-gray-900'>
                    <div></div>
                </div>
            </div>
        </DefaultLayout>
    )
}
