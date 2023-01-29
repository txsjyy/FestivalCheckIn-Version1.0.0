import Link from 'next/link';
import Image from 'next/image';

export default function Nav(){
    return(
        <nav className="bg-yellow-50 px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
            <div className="container flex flex-wrap items-center justify-between mx-auto">
                <Link href="https://utcssa.net/" className="flex items-center">
                    <Image width={150} height={50} src="/ut_logo.png" className="h-12" alt="UTCSSA"></Image>
                </Link>
                <div className="flex md:order-2">
                    <Link href="/program" className="text-red-800 bg-transparent hover:text-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">晚会节目单</Link>
                    <Link href="/" className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center md:ml-0 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">首页</Link>
                </div>
            </div>
        </nav>


    );

}