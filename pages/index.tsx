import React, { use, useState } from 'react';
import { google } from 'googleapis';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  let redirect_url = "/";

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(data);

    //check match for lottery number, if found then redirect
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === input) {
        setMatch(true);
        redirect_url += input;
        router.push({
          pathname: redirect_url,
          query:{
            info: (i+2)
          }
        });
      }
    }

    setMatch(false);
  };

  return (
    <div className='bg-gradient-to-tl from-rose-400 to-orange-300 h-screen flex justify-center items-center'>
      <div className="container w-full max-w-xs bg-white bg-opacity-50 mx-auto shadow-md">
        <form className="justify-center items-center rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className=" block text-gray-700 text-lg font-bold mb-2 pb-2">
              请输入4位数邀请码
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
                提交
              </button>
              <a className="inline-block align-baseline font-bold text-sm text-red-900 hover:text-red-600" href="#">
                没有注册？点击这里
              </a>
            </div>
        </form>
        {match ? (
          <p></p>
        ) : (
          <p className="text-red-500 text-center">没有发现您的记录捏🤏</p>
        )}
      </div>
    </div>
  );
}
