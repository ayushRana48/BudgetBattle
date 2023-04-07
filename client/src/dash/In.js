import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Transactions from "./Transactions";
import Logout from "./Logout";
import MyGroups from "./MyGroups";
import MyInvites from "./MyInvites";


export default function In({currentUser,resetUser,getGroups}){

    return(
      <div className="">
        <Logout resetUser={resetUser}></Logout>
        <MyGroups className="bg-red min-width-40"currentUser={currentUser} getGroups={getGroups}></MyGroups>

        <Transactions currentUser={currentUser} resetUser={resetUser}></Transactions>
      </div>
    

    )
}
  