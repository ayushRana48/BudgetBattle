import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Transactions from "./Transactions";
import NewGroup from "./NewGroup"
import SearchBar from "./SearchBar"
import Member from "./Member";
import InviteMember from "./InviteMember";

export default function Group({currentUser,groupName,groupId}){
    const navigate=useNavigate()
    const [members,setMembers]=useState([])
    const [host,setHost]=useState([])
    const [renderMembers,setRenderMembers]= useState(true)

    const [invites,setInvites]=useState([])
    const [lastMember,setLastMember]=useState(false)




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
            if(data.guests.length==0){
                setLastMember(true)
            }
            else{
                setLastMember(false)
            }
        })
        .catch(err => console.log(err));
        console.log("call thjree")

        const url2 = `http://localhost:3500/group/getAllInvites?groupId=${groupId}`;
        fetch(url2, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${groupId}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.invites)
            setInvites(data.invites)
        })
        .catch(err => console.log(err));
        console.log("call thjree")

    },[renderMembers])

    function leave(){
        let url;
        if(lastMember){
            url="http://localhost:3500/group/leaveDeleteGroup"
        }
        else{
            url="http://localhost:3500/group/leaveGroup"
        }
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${groupId}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "user":currentUser,
                "groupId":groupId
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            navigate("/in")
        })
        .catch(err => console.log(err));
        console.log("call four")
    }


    function reRender(){
        setRenderMembers((x)=>!x)
    }

    
    const memberCompList=members.map(x=><Member username={x}></Member>)
    const inviteMemberCompList=invites.map(x=><InviteMember username={x}></InviteMember>)



    return(
        <div>
            <h1 className="text-lg mt-8 mb-1">{groupName}</h1>
            <h1 className="text-m  mb-8">By: {host}</h1>
            <h1 className="text-m">Members</h1>
            <Member username={host}></Member>
            {memberCompList}
            {inviteMemberCompList.length?<h1 className="text-sm">Pending</h1>:null}
            {inviteMemberCompList}
            <SearchBar reRender={reRender} currentUser={currentUser} groupId={groupId} groupName={groupName}></SearchBar>
            <button onClick={()=>navigate('/in')}className="absolute top-4 left-8 py-1 hover:bg-darkPurple rounded-md bg-purple px-6 text-white mt-2 ml-2">
                <img src="/goBack.svg" className="w-10" alt="Go Back" />
            </button>

            <button onClick ={leave}className="mt-20 bg-red rounded-md px-6 py-2 text-white font-bold">{lastMember?"Delete Group":"Leave Group"}</button>

        </div>
    ) 
}