import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Transactions from "./Transactions";
import NewGroup from "./NewGroup"
import GroupClick from "./GroupClick";
import Invite from "./Invite"

export default function MyInvites({currentUser,reRenderGroups}){
    const [userInvites,setUserInvites]= useState([])
    const [currUser,setCurrUser]= useState(currentUser)
    const [renderInvites,setRenderInvites]= useState(true)

    //fix this save groups in local storage not workinf
    useEffect(()=>{
        const storedInvites = localStorage.getItem('userInvites');
        if(storedInvites){
            setRenderInvites(storedInvites)
        }
        console.log(storedInvites)
    },[])

    useEffect(()=>{
        console.log("current User from groups")
        console.log(currUser)
        const url = `http://localhost:3500/users/getAllInvites?username=${currUser}`;
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
            setUserInvites(data)
            localStorage.setItem('userInvites', JSON.stringify(data));
        })
        .catch(err => console.log(err));
        console.log("call two")

    },[renderInvites])

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       reRender()
    //     }, 10000)})


    function reRenderInvites(){
        setRenderInvites((x)=>!x)
        reRenderGroups()
    }
    

    const inviteList = userInvites.map(x=><Invite currentUser={currUser} groupName={x.groupName} groupId={x.groupId} inviter={x.inviter} reRenderInvites={reRenderInvites}></Invite>)

    return(
        <div>
            <h1 className="mb-8 text-lg">My Invites</h1>
            {inviteList.length==0?<h1>no invites</h1>:inviteList}
        </div>
    ) 
}