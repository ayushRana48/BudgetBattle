import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GroupSetting from "./GroupSetting";

export default function Group({currentUser,groupName,groupId}){
    const navigate=useNavigate()
    const [members,setMembers]=useState([])
    const [host,setHost]=useState([])
    const [setting,setSetting]=useState(false)

    

    useEffect(()=>{
        let set= JSON.parse(localStorage.getItem('settingGroup'));
        if(set){
            setSetting(set)
        }
    })

    function settingTrue(){
        setSetting(true)
        localStorage.setItem('settingGroup', JSON.stringify(true));

    }

    function settingFalse(){
        setSetting(false)
        localStorage.setItem('settingGroup', JSON.stringify(false));

    }


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
        console.log("call four")
    },[])

    return(
        setting?
        <div>
            <GroupSetting currentUser={currentUser} groupName={groupName} groupId={groupId}></GroupSetting>
            <button onClick={settingFalse}className="absolute top-4 left-8 py-1 hover:bg-darkPurple rounded-md bg-purple px-6 text-white mt-2 ml-2">
            <img src="/goBack.svg" className="w-10" alt="Go Back" />
            </button>
        </div>
        :
        <div>
            <button onClick={settingTrue} className="absolute top-4 right-8 hover:bg-darkPurple hover:rounded-md rounded-md w-12 h-8 bg-purple text-white mt-2 ml-2">
                <img className="w-6 ml-[0.75rem] mb-[0.25rem]" src="/Setting.svg"/>
            </button>
            <button onClick={()=>navigate('/in')} className="absolute top-4 left-8 py-1 hover:bg-darkPurple rounded-md bg-purple px-6 text-white mt-2 ml-2">
                <img src="/goBack.svg" className="w-10" alt="Go Back" />
            </button>
            <h1>members</h1>
        </div>
        
    )
}