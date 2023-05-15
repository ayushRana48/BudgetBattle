import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GroupSetting from "./GroupSetting";
import Main from "./Main/Main";

export default function Group({currentUser,groupName,groupId}){
    const navigate=useNavigate()
    const [members,setMembers]=useState([])
    const [host,setHost]=useState([])
    const [startDate,setStartDate]=useState()
    const [endDate,setEndDate]=useState()
    const [sentInvites,setSentInvites]=useState()

    const [setting,setSetting]=useState(false)
    const [loading,setLoading]=useState(true)

    

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
        const url = `http://localhost:3500/group/getAllMembersWithBank?groupId=${groupId}`;
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
            setLoading(false)
        })
        .catch(err => console.log(err));
        console.log("call four")
    },[])

    console.log(host)
    console.log(members)


    return(
        setting?
        <div>
            <GroupSetting currentUser={currentUser} groupName={groupName} groupId={groupId}></GroupSetting>
            <button onClick={settingFalse}className="absolute top-4 left-8 py-1 hover:bg-darkPurple rounded-md bg-purple px-6 text-white mt-2 ml-2">
            <img src="/goBack.svg" className="w-10" alt="Go Back" />
            </button>
        </div>
        :
        <div className="">
            {!loading?
                <Main settingTrue={settingTrue} groupName={groupName} host={host} members={members} groupId={groupId} currentUser={currentUser} setting={setting}></Main>
                :
                <h1>loading</h1>}
        </div>
        
    )
}