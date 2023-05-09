import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Card from './Card'

export default function Main({settingTrue,host,members,groupId,currentUser,groupName}){

    const navigate=useNavigate()

    const [allPeople,setAllPeople]=useState([])

    const [connectBank,setConnectBank]=useState(false)

    const [render,setRender]=useState(false)

    function reRender(){
        console.log("rerendddderrr")
        setRender((x)=>!x)
    }

    function getConnect(x){
        console.log(`BANKCONNNEXT ${x}`)
        console.log(x)
        setConnectBank(x)
    }



    useEffect(()=>{
        console.log(host)
        console.log(members)
        console.log(currentUser)

        let list=[]
        list = new Array(host);
        for(let i = 0; i < members.length; i++) {
            list.push(members[i]);
        }
        console.log(list)
        setAllPeople(list)

        for(let i = 0; i < list.length; i++) {
            if(list[i].name===currentUser){
                if(list[i].bankName){
                    setConnectBank(true)
                }
            }
        }

    

    },[render])

    const CardList=allPeople.map(x=><Card host={host} groupId={groupId} currentUser={currentUser} entireUser={x} connectBank={connectBank} reRender={reRender} getConnect={getConnect}></Card>)

    return(
        <div>  
            <button onClick={settingTrue} className="absolute top-4 right-8 hover:bg-darkPurple hover:rounded-md rounded-md w-12 h-8 bg-purple text-white mt-2 ml-2">
                <img className="w-6 ml-[0.75rem] mb-[0.25rem]" src="/Setting.svg"/>
            </button>
            <button onClick={()=>navigate('/in')} className="absolute top-4 left-8 py-1 hover:bg-darkPurple rounded-md bg-purple px-6 text-white mt-2 ml-2">
                <img src="/goBack.svg" className="w-10" alt="Go Back" />
            </button>
            <h1 className="text-lg mt-8 mb-1">{groupName}</h1>
            <h1 className="text-m  mb-8">By: {host.name}</h1>
            <div className="grid grid-cols-2 gap-4 w-[50%] ml-[25%]"> {/* Add this line */}
                {CardList}
            </div>

        </div>
    )
}