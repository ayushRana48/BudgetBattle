import {useEffect} from 'react'
import React, { useState } from 'react'
import axios from "axios";
import { usePlaidLink } from 'react-plaid-link';
// import './App.css'


 function PlaidAuth({publicToken,getToken,currUser,bankName,bankBrand,reRender,resetMore,userBanks}) {
  const [account, setAccount] = useState();

  useEffect(() => {
    
    if(publicToken){
    async function fetchData() {
      let resp = await axios.post("/exchange_public_token", {public_token: publicToken});
      getToken({accessToken:resp.data.accessToken,bankName:bankName})
      const auth = await axios.post("/auth", {access_token: resp.data.accessToken});
      console.log(auth.data.numbers.ach[0])
      let acctNum=auth.data.numbers.ach[0].account.toString();
      console.log(acctNum)
      acctNum=acctNum.slice(-4)
      setAccount(acctNum);
      console.log(acctNum)



      let bName;
      if(bankName==""){
          const randInt = Math.floor(Math.random() * 100000)
          bName="Bank " + randInt
      }
      else{
          bName=bankName
      }
      console.log("bankName")
      console.log(bName)
      console.log("current User from in")
      console.log(currUser)
      const url = `http://localhost:3500/users/addBank`;
      fetch(url, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body:JSON.stringify({
              "user":currUser,
              "bankName":bName,
              "accessToken":resp.data.accessToken,
              "accountNum":acctNum,
              "bankBrand":bankBrand,
              "account_id":auth.data.numbers.ach[0].account_id
          }),
      })
      .then(response => response.json())
      .then(data => {
          console.log("yaydkjsdhfkjsdhfviks/lkzfcMOON")
          resetMore()
          console.log(data)
          reRender()
      })
      .catch(err => console.log(err));

      }

    fetchData();
    }
  }, [publicToken]);

}



function PlaidToken({getToken,currUser,bankName,reRender,resetMore,userBanks}) {
    axios.defaults.baseURL ="http://localhost:3500/plaid"

    const [linkToken, setLinkToken] = useState();
    const [publicToken, setPublicToken] = useState();
    const [bankBrand,setbankBrand]=useState("")


    console.log(currUser)

    useEffect(() => {
      async function fetch() {
        const response = await axios.post("/create_link_token");
        setLinkToken(response.data.link_token);
        console.log("respnse", response.data)
      }
      fetch();
    }, []);

    const x = linkToken

    const { open, ready } = usePlaidLink({
      token: linkToken,
      onSuccess: (public_token, metadata) => {
        console.log("success",public_token,metadata)
        setPublicToken(public_token)
        setbankBrand(metadata.institution.name)
        console.log(metadata.institution.name)
      },
    });
    console.log(bankBrand)

    function go(){
        if(userBanks.length>=3){
          alert("Too many banks")
          return;
        }

        for(let i=0;i<userBanks.length;i++){
          if(userBanks[i].bankName===bankName){
              alert("Bank Name Already Taken")
              return;
          }
      }

      open()
    }

      
    return publicToken? (<PlaidAuth currUser={currUser} bankName={bankName} bankBrand={bankBrand} getToken={getToken} publicToken={publicToken} reRender={reRender} resetMore={resetMore} userBanks={userBanks}></PlaidAuth>):
     (<div>
        <button  className="rounded-md bg-purple px-4 py-1 text-white mt-2" onClick={go} disabled={!ready}>
            Connect a bank account
        </button>
      </div>)

    
  }  
  
  

export default PlaidToken