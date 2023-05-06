import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Transactions from "./Transactions";
import MyBanks from "./MyBanks";


export default function Setting({currentUser,resetUser}){


  const nav=useNavigate()

  useEffect(()=>{
    console.log("user from IN")
    console.log(currentUser)
  },[currentUser])


    return(
      <div className="">
        <MyBanks currentUser={currentUser}></MyBanks>
        <button onClick={()=>nav('/in')}className="absolute top-4 left-8 py-1 hover:bg-darkPurple rounded-md bg-purple px-6 text-white mt-2 ml-2">
                <img src="/goBack.svg" className="w-10" alt="Go Back" />
        </button>
      </div>
    

    )
}
  