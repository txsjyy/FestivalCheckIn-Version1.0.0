import { google } from 'googleapis';
import { useRouter } from 'next/router';

export  async function getServerSideProps({query}) {
    // authorization
    const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    const sheets = google.sheets({ version: 'v4', auth });
  
    // query read data for sheets, grabbing everything from name to id
    const range = 'test!D2:J302';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range,
    });

    //Check in variable is a boolean in column K, we write the cell value to be true whenever check in is successful
    const sheet_row = String(Number(query.info)+2);
    await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: "test!K"+sheet_row,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[true]]
        },
    })

    // return the data 
    const data = response.data.values;
    return {
      props: {
        data,
      },
    };
  }

export default function Details({data}){
    const router = useRouter();
    const row = Number(router.query.info); //row number of the user's information
    const name = data[row][0];//grab the user's name for greeting message
    const lottery_id = data[row][6]; //grab the user's lottery number

    //console.log(data[row]);
    return(
        <div className='container'>
            <h1>Hello {name}</h1>
            <h2>Your lottery number is {lottery_id} </h2>
        </div>
    );
}