
import Nav from "./layout";
import Image from "next/image";

export default function program(){
    return(
        <div className='bg-gradient-to-tl from-red-400 via-red-700 to-orange-300 h-screen flex flex-col'>
            <Nav></Nav>
            <div className="container w-full max-w-lg mt-24">
                <Image className= "justify-center" src = "/program.webp" width = {450} height = {300} alt = "节目单加载失败，请尝试刷新"></Image>
            </div>
        </div>
    );
} 