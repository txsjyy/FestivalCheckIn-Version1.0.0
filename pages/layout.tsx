import Link from 'next/link';
import Image from 'next/image';

export default function Nav(){
    return(
        <nav className="bg-yellow-50 px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b border-gray-200">
            <div className="container flex flex-wrap items-center justify-between mx-auto">
                <Link href="https://utcssa.net/" className="flex items-center">
                    <Image width={150} height={50} src="/ut_logo.png" className="h-12" alt="UTCSSA"></Image>
                </Link>
                <div className="flex md:order-2">
                    <Link href="/program" className="text-red-800 bg-transparent hover:text-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">晚会节目单</Link>
                    <Link href="https://mp.weixin.qq.com/s?__biz=MzkyODI3NTgxNA==&mid=2247502908&idx=1&sn=89ec6ed7e6790c7b6445ec8ea1ab35e1&chksm=c219c035f56e4923df01f14e4cdb9ea830bc8d586b5f45ea455018128dce80b07324c25f6b38&token=992378576&lang=zh_CN#rd" className="text-red-800 bg-transparent hover:text-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">红包群入口</Link>
                    <Link href="/" className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center md:ml-0 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">首页</Link>
                </div>
            </div>
        </nav>


    );

}