import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Transactions from "./Transactions";
import NewGroup from "./NewGroup"
import SearchBar from "./SearchBar"
import Member from "./Member";

export default function Group({currentUser,groupName,groupId}){
    const navgate=useNavigate()
    const [members,setMembers]=useState([])
    const [host,setHost]=useState([])
    const [renderMembers,setRenderMembers]= useState(true)



    useEffect(()=>{
        const url = `http://localhost:3500/group/getAllMembers?groupId=${groupId}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${groupId}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setHost(data.host)
            setMembers(data.guests)
        })
        .catch(err => console.log(err));
        console.log("call thjree")
    },[renderMembers])


    function reRender(){
        setRenderMembers((x)=>!x)
    }
    const memberCompList=members.map(x=><Member username={x}></Member>)


    return(
        <div>
            <h1 className="text-lg mt-8 mb-1">{groupName}</h1>
            <h1 className="text-m  mb-8">By: {host}</h1>
            <h1 className="text-m">Members</h1>
            <Member username={host}></Member>
            {memberCompList}
            <SearchBar reRender={reRender} currentUser={currentUser} groupId={groupId}></SearchBar>
            <button onClick={()=>navgate('/in')}className="absolute top-4 left-8 py-1 hover:bg-darkPurple rounded-md bg-purple px-6 text-white mt-2 ml-2">
                <img src="/goBack.svg" className="w-10" alt="Go Back" />
            </button>

        </div>
    ) 
}