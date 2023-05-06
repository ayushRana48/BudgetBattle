import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Bank from "./Bank";
import NewBank from "./NewBank";


export default function MyBanks({currentUser}){
    const [renderBanks,setRenderBanks]= useState(true)
    const [userBanks,setUserBanks]=useState([])

    //fix this save groups in local storage not workinf
    useEffect(()=>{
        const storedBanks = localStorage.getItem('userBanks');
        if(storedBanks){
            setRenderBanks(storedBanks)
        }
        console.log(storedBanks)
    },[])

    useEffect(()=>{
        console.log("user from Banks")
        console.log(currentUser)

      },[currentUser])

    useEffect(()=>{
        console.log("current User from banks")
        console.log(currentUser)
        const url = `http://localhost:3500/users/getBanks?username=${currentUser}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentUser}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setUserBanks(data)
            localStorage.setItem('userBanks', JSON.stringify(data));
        })
        .catch(err => console.log(err));
        console.log("call two")

    },[renderBanks,currentUser])



    function reRender(){
        setRenderBanks((x)=>!x)
    }


    const filteredUserBanks = userBanks.filter((bank) => Boolean(bank));

    

    const bankList = filteredUserBanks.map(x=><Bank currentUser={currentUser} bankName={x.bankName} accessToken={x.accessToken} reRender={reRender} bankBrand={x.bankBrand} accountNum={x.accountNum}></Bank>)

    return(

        
        <div className="mt-16">
            <h1 className="mb-8 text-lg"><span className="text-purple">{currentUser}'s</span> Banks</h1>
            {bankList.length==0?<h1>no banks</h1>:bankList}
            <NewBank currentUser={currentUser} reRender={reRender} userBanks={filteredUserBanks}></NewBank>  
        </div>

    ) 
}