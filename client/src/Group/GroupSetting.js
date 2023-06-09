import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SearchBar from "./SearchBar"
import Member from "./Member";
import InviteMember from "./InviteMember";
import DateRangePicker from "./DateRangePicker"

export default function GroupSetting({currentUser,groupName,groupId,hostP,guests,startDate,endDate,sentInvitesP,personalBudget,reRender,getStartDate,getEndDate,addInvite,getPersonalBudget}){
    const navigate=useNavigate()
    const [members,setMembers]=useState(guests)
    const [host,setHost]=useState(hostP)
    const [renderMembers,setRenderMembers]= useState(true)

    const [invites,setInvites]=useState(sentInvitesP)
    const [lastMember,setLastMember]=useState(false)


    const [dates,setDates]=useState({startDate:startDate,endDate:endDate})

    const [budget,setBudget]=useState(personalBudget)
    const [saveBudget,setSaveBudget]=useState()

    const [editBudget,setEditBudget]=useState(false)


    useEffect(()=>{
        console.log(personalBudget)

        console.log(guests)
        console.log(members)
        console.log(host)


        if(guests.length===0){
            if(host.budget){
                setBudget(host.budget)
            }
        }
        if(guests){
            for(let i=0;i<guests.length;i++){
                if(guests[i].username=currentUser){
                    if(guests[i].budget){
                        setBudget(guests[i].budget)
                    }
                }
            }
            
        }
    },[])

    useEffect(()=>{
        if(guests.length===0){
            setLastMember(true)
        }
        else{
            setLastMember(false)
        }
    },[guests])

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




    function updateBudget(){
        console.log(budget)
        if(budget===""){
            setBudget(saveBudget)
            setEditBudget(false)
            return;
        }
        if(budget<10){
            alert("You shouldn't spend money at all")
            setBudget(saveBudget)
            setEditBudget(false)
            return;
        }
        if(budget>10000000){
            alert("You don't need to budget with all that money")
            setBudget(saveBudget)
            setEditBudget(false)
            return;
        }
        setSaveBudget(budget)
        getPersonalBudget(budget)


        const url="http://localhost:3500/group/setBudget"

        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${groupId}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "user":currentUser,
                "groupId":groupId,
                "budget":budget,
                "host":host.name
            }),
        })
        .then(response => response.json())
        .then(data => {

        })
        .catch(err => console.log(err));
        console.log("call four")
        
        setEditBudget(false)
    }
    
    const memberCompList=members.map(x=><Member username={x.name}></Member>)
    const inviteMemberCompList=invites.map(x=><InviteMember username={x}></InviteMember>)

    // function getStartDate(x){
    //     console.log(x)
    //     setDates((y) => ({ ...y, startDate: x }));
    // }

    // function getEndDate(x){
    //     setDates((y) => ({ ...y, endDate: x }));
    // }

    function addInvite2(x){
        console.log(x)
        console.log("dd")

        setInvites(y=>[...y,x])
    }



    return(
        <div>
                <div>
                    <h1 className="text-lg mt-8 mb-1">{groupName}</h1>
                    <h1 className="text-m  mb-8">By: {host.name}</h1>

                    <div className=" mb-8">
                        {editBudget?
                        <div className="flex">
                            <div className="flex border rounded-md p-[0.75px] w-[15%] ml-[40.5%] mr-4">
                                <h1 className="ml-1 mt-[3px] mr-1">$ </h1>
                                <input value ={budget} type="number" className="w-[80%] rounded-md outline-none" placeholder="500" onChange={(e)=>setBudget(e.target.value)}></input>
                            </div>
                            <button onClick={updateBudget}  className="px-2 py-1 text-white bg-purple hover:bg-darkPurple hover:cursor-pointer rounded-md">save</button>

                        </div>
                        
                        :
                        <div className="flex  mt-2">
                            <div className="w-[15%] ml-[42.5%]">
                                <h1 className="ml-[7.5%] w-[85%] mb-2">${budget}</h1>
                                <h1 className="text-xs">Personal Budget</h1>
                            </div>
                            
                            <button onClick={()=>setEditBudget(true)} className="px-3 h-8 bg-purple hover:bg-darkPurple hover:cursor-pointer rounded-md">
                                <img className="w-5"src='/Edit.svg'></img>
                            </button>
                        </div>
                    }
                    

                    </div>
                    {currentUser===host.name?
                    <div >
                       <DateRangePicker groupId={groupId} getStartDate={getStartDate} getEndDate={getEndDate} startDate1={dates.startDate} endDate1={dates.endDate}></DateRangePicker>
                    </div>
                        :
                        <div className="flex justify-center gap-x-20">
                            <div>
                                <h1 className="text-sm">{dates.startDate}</h1>
                                <h1 className="text-xs">Start Date</h1>
                            </div>
                            <div>
                                <h1 className="text-sm">{dates.endDate}</h1>
                                <h1 className="text-xs">End Date</h1>
                            </div>
                        </div>
                    
                    }
                    <h1 className="text-m mt-8">Members</h1>
                    <Member username={host.name}></Member>
                    {memberCompList}
                    {inviteMemberCompList.length?<h1 className="text-sm">Pending</h1>:null}
                    {inviteMemberCompList}
                    <SearchBar reRender={reRender} currentUser={currentUser} groupId={groupId} groupName={groupName} invites={invites} members={members} host ={host} addInvite={addInvite} addInvite2={addInvite2}></SearchBar>

                    <button onClick ={leave}className="mt-6 mb-12 bg-red rounded-md px-6 py-2 text-white font-bold">{lastMember?"Delete Group":"Leave Group"}</button>
                </div>         
        </div>
        
    ) 
}