import {useEffect} from 'react'
import React, { useState } from 'react'
import axios from "axios";
import { usePlaidLink } from 'react-plaid-link';
// import './App.css'


 function PlaidAuth({publicToken,getToken,currUser,bankName}) {
  const [account, setAccount] = useState();

  useEffect(() => {
    async function fetchData() {
      let resp = await axios.post("/exchange_public_token", {public_token: publicToken});
      getToken({accessToken:resp.data.accessToken,bankName:bankName})
      const auth = await axios.post("/auth", {access_token: resp.data.accessToken});
      setAccount(auth.data.numbers.ach[0]);

      await axios.put("http://localhost:3500/users/updateUserBankInfo", {
        user: currUser,
        accessToken: resp.data.accessToken,
        bankName: bankName
      });

    }
    fetchData();
  }, []);
  return account && (
      <>
        <p>Account number: {account.account}</p>
        <p>Routing number: {account.routing}</p>
      </>
  );

}

function PlaidToken({getToken,currUser}) {
    axios.defaults.baseURL ="http://localhost:3500/plaid"

    const [linkToken, setLinkToken] = useState();
    const [publicToken, setPublicToken] = useState();
    const [bankName,setBankName]=useState();


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
        setBankName(metadata.institution.name)
        console.log(metadata.institution.name)
      },
    });
      
    return publicToken? (<PlaidAuth currUser={currUser} bankName={bankName} getToken={getToken} publicToken={publicToken}></PlaidAuth>):
     (<div>
        <button  className="rounded-md bg-purple px-4 py-1 text-white mt-6" onClick={() => open()} disabled={!ready}>
            Connect a bank account
        </button>
      </div>)

    
  }  
  
  

export default PlaidToken