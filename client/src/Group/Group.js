import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GroupSetting from "./GroupSetting";
import Main from "./Main/Main";

export default function Group({currentUser,groupName,groupId}){
    const [members,setMembers]=useState([])
    const [host,setHost]=useState([])
    const [startDate,setStartDate]=useState()
    const [endDate,setEndDate]=useState()
    const [sentInvites,setSentInvites]=useState()
    const [renderMembers,setRenderMembers]= useState(true)



    const [setting,setSetting]=useState(false)
    const [loading,setLoading]=useState(true)

    const[personalBudget,setPersonalBudget]=useState()

    // useEffect(()=>{
    //     let x= localStorage.getItem('settingGroup')
    //     if(x){
    //         setSetting(x)
    //     }
    // },[])
    

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
            let budget;
            console.log(data.host.name)
            console.log(currentUser)
            if(data.host.name===currentUser){
                if(data.host.budget){
                    console.log("innn")
                    console.log(data.host.budget)
                    budget=data.host.budget
                }
                else{
                    console.log("outt")
                    budget=500
                }
            }
            else{
                console.log("otu")

                for(let i=0;i<data.guests.length;i++){
                    if(data.guests[i].name===currentUser){
                        if(data.guests[i].budget){
                            budget=data.guests[i].budget
                        }
                        else{
                            budget=500
                        }
                    }
                }
            }
            console.log(budget)


            setPersonalBudget(budget)

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

    function getStartDate(x){
        console.log(x)
        setStartDate(x);
    }

    function getEndDate(x){
        setEndDate(x);
    }

    function addInvite(x){
        setSentInvites(y=>[...y,x])
    }

    function getPersonalBudget(x){
        setPersonalBudget(x)
    }

    return(
        setting?
        <div>
            {!loading?
                <GroupSetting currentUser={currentUser} groupName={groupName} groupId={groupId} 
                hostP={host} guests={members} startDate={startDate} endDate={endDate} sentInvitesP={sentInvites} personalBudget={personalBudget}
                getStartDate={getStartDate} getEndDate={getEndDate} addInvite={addInvite} getPersonalBudget={getPersonalBudget}></GroupSetting>
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