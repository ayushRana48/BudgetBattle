import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Transactions from "./Transactions";
import NewGroup from "./NewGroup"
import { Route, Routes, Outlet } from 'react-router-dom'; // Import the Outlet component
import Group from "./Group";


export default function Member({currentUser,username}){
    
    return(
        <div > 
            <div className="mx-auto w-[40%] p-2 hover:bg-hoverGray ">
            <div className="flex  mb-2">
                <img className="mr-4" src="/MemberIcon.svg"></img>
                <h1 className="text-sm mt-2 truncate">{username}</h1>
            </div>
            </div>
            <div className="h-[1px] mx-auto w-[40%] bg-hoverGray" ></div>
        </div>


    ) 
}