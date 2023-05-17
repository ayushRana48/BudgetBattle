import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GroupSetting from "./GroupSetting";
import Main from "./Main/Main";

export default function Group({currentUser,groupName,groupId}){
    const [members,setMembers]=useState([])
    const [host,setHost]=useState([])
    const [startDate,setStartDate]=useState("Set Date")
    const [endDate,setEndDate]=useState("Set Date")
    const [sentInvites,setSentInvites]=useState()
    const [renderMembers,setRenderMembers]= useState(true)



    const [setting,setSetting]=useState(false)
    const [loading,setLoading]=useState(true)

    

    function settingTrue(){
        setSetting(true)
        localStorage.setItem('settingGroup', JSON.stringify(true));

    }

    function settingFalse(){
        setSetting(false)
        localStorage.setItem('settingGroup', JSON.stringify(false));

    }




    //change this url name later
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
            setLoading(false)

            if(data.startDate){
                let date = new Date(data.startDate);
                const options = {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric'
                };
                let startDate = date.toLocaleDateString('en-US', options);
                setStartDate(startDate)
            }
            
            if(data.endDate){
                let date = new Date(data.endDate);
                const options = {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric'
                };
                let endDate = date.toLocaleDateString('en-US', options);
                setEndDate(endDate)
            }
            
            setSentInvites(data.sentInvites)
            console.log("yysdiasdj")
            console.log(startDate)

        })
        .catch(err => console.log(err));
        console.log("call four")
    },[renderMembers])

    function reRender(){
        setRenderMembers((x)=>!x)
    }

    return(
        setting?
        <div>
            {!loading?
                <GroupSetting currentUser={currentUser} groupName={groupName} groupId={groupId} 
                hostP={host} guests={members} startDate={startDate} endDate={endDate} sentInvitesP={sentInvites}></GroupSetting>
                :
                <h1>loading</h1>
            }

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