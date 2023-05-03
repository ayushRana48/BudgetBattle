import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Transactions from "./Transactions";

export default function NewGroup({currentUser,reRender}){
    const [groupName,setGroupName]= useState("")
    const [currUser,setCurrUser]= useState(currentUser)
    const [more,setMore]= useState(false)

   
    function createGroup(){
        let gpName;
        if(groupName==""){
            const randInt = Math.floor(Math.random() * 100000)
            gpName="Finance Flyers " + randInt
        }
        else{
            gpName=groupName
        }
        console.log("current User from in")
        console.log(currentUser)
        const url = `http://localhost:3500/group/new`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "user":currentUser,
                "groupName":gpName
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            reRender()
        })
        .catch(err => console.log(err));
    }
       

   


    return(
        <div className="flex-col">
            {more? 
            <div>
                <div>
                    <input className="rounded-md focus:outline-none border-2 p-1.5 placeholder-ml-4 border-purple mt-2" placeholder="Finance Flyers" type="text" name="Luser" value={groupName} onChange={e=>setGroupName(e.target.value)}></input>
                </div>
                <div>
                    <button onClick ={createGroup}className="rounded-md bg-purple px-4 py-1 text-white  mt-2">Create New Group</button>
                </div>
                <button onClick={()=>setMore(false)}  className="text-red">Cancel</button>
            </div> 
            :
            <button onClick={()=>setMore(true)} className="hover:bg-darkPurple text-m rounded-md bg-purple px-20  text-white mb-8  mt-2">+</button> 
            }              

            
        </div>
    ) 
}