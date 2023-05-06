import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import PlaidToken from "./PlaidToken";


export default function NewBank({currentUser,reRender,userBanks}){
    const [accessToken,setAccessToken]=useState()
    const [bankName,setBankName]=useState("")

    const [more,setMore]= useState(false)




    // //Get Access Token
    // useEffect(() => {
    //   console.log("current User from in")
    //   console.log(currentUser)
    //   const url = `http://localhost:3500/users/getUserInfo?username=${currentUser}`;
    //   fetch(url, {
    //       method: 'GET',
    //       headers: {
    //           'Authorization': `Bearer ${currentUser}`,
    //           'Content-Type': 'application/json'
    //       }
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data)
    //     if(data.accessToken){
    //       setAccessToken(data.accessToken)
    //       setBankName(data.bankName)
    //     }
    //   })
    //   .catch(err => console.log(err));
    //   console.log("call two")
    // }, []);

    function getToken(x){
      setAccessToken(x.accessToken)
      console.log(x)
    }

    

    function resetMore(){
        setMore(false)
        setBankName("")
    }

    function moreTrue(){
        if(userBanks.length>3){

        }
    }

    return(
        <div className='in'> 
            {more? 
            <div>
                <div>
                    <input className="rounded-md focus:outline-none border-2 p-1.5 placeholder-ml-4 border-purple mt-2" placeholder="Bank Name" type="text" name="Luser" value={bankName} onChange={e=>setBankName(e.target.value)}></input>
                </div>
                <div>
                    <PlaidToken currUser={currentUser} getToken={getToken} bankName={bankName} reRender={reRender} resetMore={resetMore} userBanks={userBanks}></PlaidToken>
                </div>
           
            <button onClick={()=>setMore(false)}  className="text-red">Cancel</button>

            </div>
            :
            <button onClick={()=>setMore(true)} className="hover:bg-darkPurple text-m rounded-md bg-purple px-20  text-white mb-8  mt-2">+</button>}
        </div>

    )
}
  