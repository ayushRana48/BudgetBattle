import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Transactions from "./Transactions";
import NewGroup from "./NewGroup"
import { Route, Routes, Outlet } from 'react-router-dom'; // Import the Outlet component
import Group from "./Group";


export default function Invite({currentUser,groupName,groupId,inviter,reRenderInvites}){
    
    function acceptInvite(){
        console.log("accept")

        const url = `http://localhost:3500/users/acceptInvites`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "user":currentUser,
                "groupName":groupName,
                "groupId":groupId
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            reRenderInvites()
        })
        .catch(err => console.log(err));
    }
    console.log("user from IUnvite ")
    console.log(currentUser)

    function declineInvite(){
        console.log("decline")
        const url = `http://localhost:3500/users/declineInvite`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "user":currentUser,
                "groupName":groupName,
                "groupId":groupId
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            reRenderInvites()
        })
        .catch(err => console.log(err));
    }


    return(
        <div className="hover:cursor-pointer"> 
            <div className="mx-auto w-[40%] p-2 hover:bg-hoverGray ">
            <div className="flex  mb-2">
                <img className="mr-4" src="/GroupInvite.svg"></img>
                <div className="w-[45%]">
                    <h1 className="text-sm mt-2 truncate">{groupName}</h1>
                    <h1 className="text-xs ml-2 truncate">from {inviter}</h1>
                </div>
                    <div className="flex ml-auto mr-1 gap-x-1"> 
                        <img onClick={acceptInvite} className="w-12 h-10 mt-2 p-1 hover:bg-green hover:cursor-pointer rounded-md" src="/inviteClick/Yes.svg"></img>
                        <img onClick={declineInvite} className="w-12 h-10 mt-2 p-1 hover:bg-red hover:cursor-pointer rounded-md" src="/inviteClick/No.svg"></img>

                    </div>
            </div>
            </div>
            <div className="h-[3px] mx-auto w-[40%] bg-hoverGray" ></div>
        </div>


    ) 
}