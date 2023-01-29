import { google } from 'googleapis';
import { useRouter } from 'next/router';
import {Nav} from './layout';

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

function pad(n: string,length: number){
  var len = length - (''+n).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n
}
export default function Details({data}){
    const router = useRouter();
    const row = Number(router.query.info); //row number of the user's information
    const name = data[row][0];//grab the user's name for greeting message
    const lottery_id = pad(data[row][6],3); //grab the user's lottery number and convert to 3 digits

    const d0 = lottery_id.charAt(0);
    const d1 = lottery_id.charAt(1);
    const d2 = lottery_id.charAt(2);

    //console.log(data[row]);
    return(
      <div className='bg-gradient-to-tl from-rose-400 to-orange-300 h-screen flex flex-col items-center justify-center'>
        <Nav></Nav>
        <iframe src="https://giphy.com/embed/iehOstHSrp1XUYvXFZ" width="480" height="219" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
        <h1 className="text-center text-3xl font-medium text-white mt-12 pt-0">您好 {name},</h1>
        <h1 className="text-center text-2xl font-medium text-white mt-1 pb-10">Welcome, {name}</h1>
        {lottery_id ?
            (<div>
              <h2 className="text-center text-2xl font-medium text-white mt-4">您的抽奖号码是：</h2>
              <h2 className="text-center text-xl font-medium text-white pb-3">Your lottery number is: </h2>
              <div className="flex gap-3 justify-center">
                <div className="font-mono text-9xl bg-slate-200 shadow-inner rounded p-2 text-center opacity-60">{d0}</div>
                <div className="font-mono text-9xl bg-slate-200 shadow-inner rounded p-2 text-center opacity-60">{d1}</div>
                <div className="font-mono text-9xl bg-slate-200 shadow-inner rounded p-2 text-center opacity-60">{d2}</div>
              </div>
            </div>
            
            ) 
            : (<h2 className="text-center text-xl font-medium text-white mt-4">暂时没有抽奖号喔～</h2>)
        }
      </div>

    );
}