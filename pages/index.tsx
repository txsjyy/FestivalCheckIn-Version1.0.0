import React, { use, useState } from 'react';
import { google } from 'googleapis';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Nav from './layout';

export  async function getServerSideProps() {
  // auth
  const auth = await google.auth.getClient({ 
    credentials:{
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/gm, '\n')      
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
  const sheets = google.sheets({ version: 'v4', auth });

  // query
  const range = 'A2:J500';
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });
  // result
  const data = response.data.values;
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }:any) {
  const [input, setValue] = useState('');
  const [match, setMatch] = useState(true);
  const [pressed, setPressed] = useState(false);
  const router = useRouter();
  let redirect_url = "/";

  const handleChange = (e:any) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    console.log(data);
    setPressed(true);
    //check match for lottery number, if found then redirect
    for (let i = 0; i < data.length; i++) {
      if (data[i][2].trim().toLowerCase() === input.toLowerCase()) {
        setMatch(true);
        redirect_url += input;
        redirect_url = redirect_url.replaceAll('%',',');
        console.log(redirect_url);
        router.push({
          pathname: redirect_url,
          query:{
            info: (i)
          }
        });
        break;
      }
      if(i == data.length - 1){
        setMatch(false);
      }
    }

  };

  return (
    <div className='bg-MidAutumnBg h-screen flex flex-col justify-center' >
      <Nav></Nav>
      <h1 className="text-center justify-center text-2xl font-extrabold text-orange-200 mt-12 pt-0">欢迎来到UTCSSA</h1>
      <h1 className="text-center text-2xl font-extrabold text-orange-200  pt-0 mb-1">2024新春晚会</h1>      
      <h1 className="text-center text-xl font-medium text-orange-200 mt-1">Welcome to the UTCSSA</h1>
      <h1 className="text-center text-xl font-medium text-orange-200 pt-0 pb-4">2024 New Year Gala!</h1>
      <div className="container w-full max-w-xs bg-white bg-opacity-50 mx-auto shadow-md">
        <form className="justify-center items-center rounded px-8 pt-6 pb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className=" block text-orange-200 text-lg font-bold pb-2">
              请输入报名邮箱
              </label>
              <label className=" block text-orange-200 text-sm font-bold mb-2 pb-2">
              Please enter registration email
              </label>
              <input className="shadow appearance-none border py-2 px-3 leading-tight focus:outline-none focus:shadow-outline rounded-lg p-2 text-xl text-red-800 w-48 outline outline-offset-2 outline-2 outline-red-800"
              type="text"
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}"
              minLength= {4}
              value={input}
              onChange={handleChange}></input>
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Submit
              </button>
            </div>
        </form>
        {pressed? (
          <div>
            {match ? (
              <div>
              <p className="text-green-500 text-center text-sm ">签到成功！跳转中……</p>
              <p className="text-green-500 text-center mb-3 text-sm ">Success! Redirecting...</p>
              </div>
            ) : (
              <div>
                <p className="text-red-500 text-center text-sm ">没有发现您的记录捏🤏</p>
                <p className="text-red-500 text-center mb-3 text-sm ">Your record was not found.</p>
              </div>
            )}
          </div> 
          ):(<p></p>)
        }
        
      </div>
      <div className="container w-full max-w-xs mx-auto my-2">
        < Link className="inline-block align-baseline font-bold text-orange-200 text-xs mt-3 mx-auto" href="https://docs.google.com/forms/d/e/1FAIpQLScn5-ikrSBlFlYIzPMA11kmJt4NOmqauO7VqTlu3X6X2Mp7TA/viewform?usp=sf_link">
                没有注册？点击这里。
                <br></br>
                Not registered? Click here.
        </Link>
        {/* <Image className = "mt-7" src = "/wst.jpeg" width = {350} height = {200} alt = "Wall Street Tequila"></Image> */}
      </div>

      <footer className="w-screen text-center mt-6">
        <span className="text-orange-200 text-xs">&copy; <strong>UTCSSA</strong> - Junyu Yao and Tech Department , 2024.</span>
      </footer>

    </div>
  );
}
