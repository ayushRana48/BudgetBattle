import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Logout from "./Logout";
import MyGroups from "./MyGroups";
import MyInvites from "./MyInvites";


export default function In({currentUser,resetUser,getGroups}){


  const nav=useNavigate()

  useEffect(()=>{
    console.log("user from IN")
    console.log(currentUser)
  },[currentUser])

  function redirectSetting(){
    nav("/in/settings")

  }

    return(
      <div className="">
        <Logout resetUser={resetUser}></Logout>
        <MyGroups className="bg-red min-width-40"currentUser={currentUser} getGroups={getGroups}></MyGroups>

        <button onClick={redirectSetting} className="absolute top-2 left-8 hover:bg-darkPurple hover:rounded-md rounded-md w-12 h-8 bg-purple text-white mt-2 ml-2">
              <img className="w-6 ml-[0.75rem] mb-[0.25rem]" src="/Setting.svg"/>
        </button>
      </div>
    

    )
}
  