import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';



export default function GroupClick({currentUser,groupName,groupId}){
    
    const groupPath = "/in/group/" + groupId
    const navigate = useNavigate();


    return(
        <div className="hover:cursor-pointer"> 
            <div onClick={()=>navigate(groupPath)}>
            <div className="mx-auto w-[40%] p-2 hover:bg-hoverGray ">
            <div className="flex  mb-2">
                <img className="mr-4" src="/GroupIcon.svg"></img>
                <h1 className="text-sm mt-2 truncate">{groupName}</h1>
            </div>
            </div>
            <div className="h-[3px] mx-auto w-[40%] bg-hoverGray" ></div>
            </div>
        </div>


    ) 
}