import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar"
import Member from "./Member";
import InviteMember from "./InviteMember";
import DateRangePicker from "./DateRangePicker"

export default function GroupSetting({currentUser,groupName,groupId}){
    const navigate=useNavigate()
    const [members,setMembers]=useState([])
    const [host,setHost]=useState([])
    const [renderMembers,setRenderMembers]= useState(true)

    const [invites,setInvites]=useState([])
    const [lastMember,setLastMember]=useState(false)


    const [dates,setDates]=useState({startDate:"Set Date",endDate:"Set Date"})


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


  useEffect(()=>{
    const url = `http://localhost:3500/group/getStartDate?groupId=${groupId}`;
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
        console.log("fro, liken 88s")

           if(data.startDate){
                let date = new Date(data.startDate);
                const options = {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
                };
                let outputDate = date.toLocaleDateString('en-US', options);

             setDates((y) => ({ ...y, startDate: outputDate }));
           }
       })
       .catch(err => console.log(err));

       const url2 = `http://localhost:3500/group/getEndDate?groupId=${groupId}`;
       fetch(url2, {
           method: 'GET',
           headers: {
               'Authorization': `Bearer ${groupId}`,
               'Content-Type': 'application/json'
           }
       })
       .then(response => response.json())
       .then(data => {
         if(data.endDate){

            let date = new Date(data.endDate);
                const options = {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
                };
                let outputDate = date.toLocaleDateString('en-US', options);

             setDates((y) => ({ ...y, endDate: outputDate }));
         }
       })
       .catch(err => console.log(err));

   },[])

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

    console.log("user and host")
    console.log(currentUser)
    console.log(host)
    console.log(currentUser===host)

    function getStartDate(x){
        setDates((y) => ({ ...y, startDate: x }));
    }

    console.log(dates.endDate)
    function getEndDate(x){
        setDates((y) => ({ ...y, endDate: x }));
    }



    return(
        <div>
                <div>
                    <h1 className="text-lg mt-8 mb-1">{groupName}</h1>
                    <h1 className="text-m  mb-8">By: {host}</h1>
                    {currentUser===host?
                    <div>
                       <DateRangePicker groupId={groupId} getStartDate={getStartDate} getEndDate={getEndDate} startDate1={dates.startDate} endDate1={dates.endDate}></DateRangePicker>
                    </div>
                        :
                        <div className="flex justify-center gap-x-20">
                            <div>
                                <h1 className="text-sm">{dates.startDate.toString()}</h1>
                                <h1 className="text-xs">Start Date</h1>
                            </div>
                            <div>
                                <h1 className="text-sm">{dates.endDate}</h1>
                                <h1 className="text-xs">End Date</h1>
                            </div>
                        </div>
                    
                    }
                    <h1 className="text-m">Members</h1>
                    <Member username={host}></Member>
                    {memberCompList}
                    {inviteMemberCompList.length?<h1 className="text-sm">Pending</h1>:null}
                    {inviteMemberCompList}
                    <SearchBar reRender={reRender} currentUser={currentUser} groupId={groupId} groupName={groupName}></SearchBar>

                    <button onClick ={leave}className="mt-20 bg-red rounded-md px-6 py-2 text-white font-bold">{lastMember?"Delete Group":"Leave Group"}</button>
                </div>         
        </div>
        
    ) 
}