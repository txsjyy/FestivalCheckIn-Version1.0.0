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
  const [match, setMatch] = useState('');
  const [row, setRow] = useState(0);
  const router = useRouter();
  let redirect_url = "/";

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(data);

    //check match
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === input) {
        setMatch(data[i][1]);
        redirect_url += input;
        setRow(i);
        router.push(redirect_url);
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="text"
          pattern="[0-9A-Za-z!@#\$%\^&\*]{4}"
          minLength="4"
          value={input}
          onChange={handleChange}
          placeholder="Enter 4-digit code"
        />
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
      {match ? (
        <p>Match found: {match}</p>
      ) : (
        <p>No match found</p>
      )}
    </div>
  );
}
