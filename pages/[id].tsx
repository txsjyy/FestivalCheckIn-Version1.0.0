// import { google } from 'googleapis';
// import { useRouter } from 'next/router';
// import Nav from './layout';
// import Image from 'next/image';

// export  async function getServerSideProps(context:any) {  
//   // authorization
//   const auth = await google.auth.getClient({ 
//     credentials:{
//       client_id: process.env.GOOGLE_CLIENT_ID,
//       client_email: process.env.GOOGLE_CLIENT_EMAIL,
//       private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/gm, '\n')     
//       },
//     scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
//   const sheets = google.sheets({ version: 'v4', auth });

//   // query read data for sheets, grabbing everything from name to id
//   const range = 'A2:J500';
//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: process.env.SHEET_ID,
//     range,
//   });


 
//   const sheet_row = String(Number(context.query.info)+2);
//   let value = [true];
//   const request_body = {
//     "range": "H"+sheet_row,
//     "values": [
//       value
//     ]
//   }

//   await sheets.spreadsheets.values.update({
//       spreadsheetId: process.env.SHEET_ID,
//       range: "H"+sheet_row,
//       valueInputOption: "USER_ENTERED",
//       requestBody: request_body,
      
//   })

//   // return the data 
//   const data = response.data.values;
//   return {
//     props: {
//       data,
//     },
//   };
// }
import { google } from 'googleapis';
import { useRouter } from 'next/router';
import Nav from './layout';
import Image from 'next/image';

export  async function getServerSideProps(context:any) {  
  const auth = await google.auth.getClient({ 
    credentials: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/gm, '\n')     
      },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'] 
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const sheet_row = String(Number(context.query.info) + 2);

  // Check if number already exists in column 'I'
  const existingNumberResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "I"+sheet_row,
  });

  const existingNumber = existingNumberResponse.data.values ? existingNumberResponse.data.values[0][0] : null;

  if (!existingNumber) {
    // If number doesn't exist, proceed to find max and generate new number

    // Get max number from column I
    const columnIRange = 'I2:I500';
    const columnIResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: columnIRange,
    });
    
    const columnIValues = columnIResponse.data.values || [];
    let maxNumber = Math.max(0, ...columnIValues.flat().map(Number));

    const nextNumber = maxNumber + 1;

    // Update column 'H'
    const request_body_H = {
      "range": "H"+sheet_row,
      "values": [
        [true]
      ]
    };
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range: "H"+sheet_row,
      valueInputOption: "USER_ENTERED",
      requestBody: request_body_H,
    });
  
    // Update column 'I' if nextNumber is within limit
    if (nextNumber <= 300) {
      const request_body_I = {
        "range": "I"+sheet_row,
        "values": [
          [nextNumber]
        ]
      };
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SHEET_ID,
        range: "I"+sheet_row,
        valueInputOption: "USER_ENTERED",
        requestBody: request_body_I,
      });
    }

    // Add a delay here if you still face issues with data not being updated fast enough
    await new Promise(res => setTimeout(res, 1000));  // 2 second delay
  }

  // Fetch updated data from sheet
  const range = 'A2:J500';
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  const data = response.data.values;
  return {
    props: {
      data,
    },
  };
}

// ... Rest of your code (unchanged)


function pad(n: string,length: number){
  var len = length - (''+n).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n
}

export default function Details({data}:any){
    const router = useRouter();
    const row = Number(router.query.info); //row number of the user's information
    const Cname = data[row][2];//grab the user's Chinese name for greeting message
    const Ename = data[row][3];//grab the user's English name for greeting message
    const lottery_id = data[row][8] ? pad(data[row][8],3):''; //grab the user's lottery number and convert to 3 digits

    const d0 = lottery_id.charAt(0);
    const d1 = lottery_id.charAt(1);
    const d2 = lottery_id.charAt(2);

    //console.log(data[row]);
    
    return(
      <div className='bg-gradient-to-t from-red-800 via-red-600 to-yellow-500 h-screen flex flex-col items-center justify-center'>
        <Nav></Nav>
        <iframe src="https://giphy.com/embed/iehOstHSrp1XUYvXFZ" width="100%" height="219" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
        <h1 className="text-center text-3xl font-medium text-white mt-12 pt-0">您好 {Cname},</h1>
        <h1 className="text-center text-2xl font-medium text-white mt-1 pb-2">Welcome, {Ename}</h1>
        {lottery_id ?
            (<div>
              <h2 className="text-center text-2xl font-medium text-white mt-1">您的抽奖号码是：</h2>
              <h2 className="text-center text-xl font-medium text-white pb-3">Your lottery number is: </h2>
              <div className="flex gap-3 justify-center">
                <div className="font-mono text-9xl bg-slate-200 shadow-inner rounded p-2 text-center opacity-60">{d0}</div>
                <div className="font-mono text-9xl bg-slate-200 shadow-inner rounded p-2 text-center opacity-60">{d1}</div>
                <div className="font-mono text-9xl bg-slate-200 shadow-inner rounded p-2 text-center opacity-60">{d2}</div>
              </div>
            </div>
            
            ) 
            : (<div>
              <h2 className="text-center text-2xl font-medium text-white mt-4">暂时没有抽奖号哦～请在主持人提示后刷新本页面</h2>
              <h2 className="text-center text-xl font-medium text-white pb-3">No lottery number available currently... Please refresh after host announcement. </h2>
              </div>)
        }
        <Image className = "mt-5" src = "/weee.png" width = {300} height = {200} alt = "Weeee"></Image>
      </div>

    );
}