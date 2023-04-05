import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


export default function Logout({resetUser}){

    const navigate = useNavigate();


    function logOut(){
      resetUser()
      localStorage.clear();
      navigate('/')
    }
    
    
    return(
        <div className='in'>
            <button className="rounded-md bg-purple px-4 py-1 text-white flex ml-auto mr-6 mt-4 mb-4 " onClick={logOut}>Log Out</button>
        </div>

    )
}
  