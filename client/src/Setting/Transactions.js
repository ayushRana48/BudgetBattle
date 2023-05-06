import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import PlaidToken from "./PlaidToken";


export default function Transactions({currentUser,resetUser}){
    const [accessToken,setAccessToken]=useState()
    const [bankName,setBankName]=useState()

    const [transactionsList,setTransactionsList]=useState([])
    const [currUser,setCurrUser]=useState(currentUser)



    useEffect(() => {
      console.log("current User from in")
      console.log(currUser)
      const url = `http://localhost:3500/users/getUserInfo?username=${currUser}`;
      fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${currUser}`,
              'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if(data.accessToken){
          setAccessToken(data.accessToken)
          setBankName(data.bankName)
        }
      })
      .catch(err => console.log(err));
      console.log("call two")
    }, []);

    function getToken(x){
      setAccessToken(x.accessToken)
      setBankName(x.bankName)
      console.log(x)
    }


    function getTransactions(){
      let transactions=""
      const url = `http://localhost:3500/plaid/transactions?accessTokens=${accessToken}`;
      fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        let list=data
        let list2=[]
        for(let i=0;i<10;i++){
          list2.push({"Merchant":list[i].merchant_name,"Amount":list[i].amount})
        }
        setTransactionsList(list2)
      })
      .catch(err => console.log(err));
      console.log("call One")
    }

    function getTransactions2(){
        // Call the function immediately
        getTransactions();
        
        // Call the function again after 3 seconds
        setTimeout(getTransactions, 3000);
        console.log(currUser)
      
    }

    const transactionParagraphs = transactionsList.map(transaction => {
      return <p>Merchant: '{transaction.Merchant?transaction.Merchant:"Anonymous"}', Amount: ${transaction.Amount}</p>
    });

    
    return(
        <div className='in'>            
           {accessToken?
              <div>
                <h1 className="text-m">Bank: {bankName}</h1>
                <button className="rounded-md bg-purple px-4 py-1 text-white mb-8  mt-6" onClick={getTransactions2}>get Transactions</button>
              </div>
              :<PlaidToken currUser={currUser} getToken={getToken}></PlaidToken>}
           {transactionsList?transactionParagraphs:null}
        </div>

    )
}
  