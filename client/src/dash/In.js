import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Transactions from "./Transactions";
import Logout from "./Logout";
import MyGroups from "./MyGroups";


export default function In({currentUser,resetUser,getGroups}){

    return(
      <div>
        <Logout resetUser={resetUser}></Logout>
        <MyGroups currentUser={currentUser} getGroups={getGroups}></MyGroups>
        <Transactions currentUser={currentUser} resetUser={resetUser}></Transactions>
      </div>
    

    )
}
  