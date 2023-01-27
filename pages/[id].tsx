import { google } from 'googleapis';
import { useRouter } from 'next/router';

export  async function getServerSideProps() {
    // auth
    const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
    const sheets = google.sheets({ version: 'v4', auth });
  
    // query
    const range = 'test!D2:J302';
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




export default function Details({data}){
    const router = useRouter();
    const row = Number(router.query.info);
    const name = data[row][0];
    const lottery_id = data[row][6];

    //console.log(data[row]);
    return(
        <div className='container'>
            <h1>Hello {name}</h1>
            <h2>Your lottery number is {lottery_id} </h2>
        </div>
    );
}