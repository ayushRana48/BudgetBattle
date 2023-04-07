import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Transactions from "./Transactions";
import NewGroup from "./NewGroup"
import GroupClick from "./GroupClick";
import MyInvites from "./MyInvites";


export default function MyGroup({currentUser,getGroups}){
    const [userGroups,setUserGroups]= useState([])
    const [currUser,setCurrUser]= useState(currentUser)
    const [renderGroups,setRenderGroups]= useState(true)

    //fix this save groups in local storage not workinf
    useEffect(()=>{
        const storedGroups = localStorage.getItem('userGroups');
        if(storedGroups){
            setRenderGroups(storedGroups)
        }
        console.log(storedGroups)
    },[])

    useEffect(()=>{
        console.log("current User from groups")
        console.log(currUser)
        const url = `http://localhost:3500/users/getGroups?username=${currUser}`;
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
            setUserGroups(data)
            getGroups(data)
            localStorage.setItem('userGroups', JSON.stringify(data));
        })
        .catch(err => console.log(err));
        console.log("call two")

    },[renderGroups])

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       reRender()
    //     }, 10000)})


    function reRender(){
        setRenderGroups((x)=>!x)
    }

    const groupsList = userGroups.map(x=><GroupClick currentUser={currUser} groupName={x.groupName} groupId={x.groupId}></GroupClick>)

    return(

        
        <div className="">
            <h1 className="mb-8 text-lg"><span className="text-purple">{currentUser}'s</span> Groups</h1>
            {groupsList.length==0?<h1>no groups</h1>:groupsList}
            <NewGroup currentUser={currUser} reRender={reRender}></NewGroup>  
            <MyInvites className="" currentUser={currentUser} reRenderGroups={reRender}></MyInvites>

        </div>

    ) 
}