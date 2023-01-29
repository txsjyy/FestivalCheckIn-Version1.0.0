import React, { use, useState } from 'react';
import { google } from 'googleapis';
import { useRouter } from 'next/router';
import {Nav} from './layout';
import Link from 'next/link';

export  async function getServerSideProps() {
  // auth
  const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
  const sheets = google.sheets({ version: 'v4', auth });

  // query
  const range = 'test!I2:J302';
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

export default function Home({ data }) {
  const [input, setValue] = useState('');
  const [match, setMatch] = useState(true);
  const [pressed, setPressed] = useState(false);
  const router = useRouter();
  let redirect_url = "/";

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(data);
    setPressed(true);
    //check match for lottery number, if found then redirect
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === input) {
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
    <div className='bg-gradient-to-tl from-rose-400 to-orange-300 h-screen flex flex-col justify-center'>
      <Nav></Nav>
      <h1 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-amber-600 from-red-700 mt-12 pt-0">欢迎来到UTCSSA兔年新春晚会！</h1>
      <h1 className="text-center text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r to-amber-600 from-red-700 mt-1 pb-10">Welcome to the UTCSSA Spring Gala!</h1>
      <div className="container w-full max-w-xs bg-white bg-opacity-50 mx-auto shadow-md">
        <form className="justify-center items-center rounded px-8 pt-6 pb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className=" block text-gray-700 text-lg font-bold pb-2">
              请输入4位数邀请码
              </label>
              <label className=" block text-gray-700 text-sm font-bold mb-2 pb-2">
              Input 4-digit Invitation Code
              </label>
              <input className="shadow appearance-none border py-2 px-3 leading-tight focus:outline-none focus:shadow-outline rounded-lg p-2 text-xl text-red-800 w-48 outline outline-offset-2 outline-2 outline-red-800"
              type="text"
              pattern="[0-9A-Za-z!@#\$%\^&\*]{4}"
              minLength="4"
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
        < Link className="inline-block align-baseline font-bold text-sm text-red-900 hover:text-red-600 mt-3 mx-auto" href="#">
                没有注册？点击这里。
                <br></br>
                Not registered? Click here.
        </Link>
      </div>
    </div>
  );
}
