import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


export default function Card({groupId,entireUser,currentUser,host}){
    
    const [rem,setRem]=useState(40)

    const [isCurrent,setisCurrent] = useState(entireUser.name===currentUser)

    const[isEdit,setIsEdit] = useState(false)

    const[userBanks,setUserBanks]=useState([])

    const[currentBank,setCurrentBank]=useState(entireUser.bankName)

    const[saveBank,setSaveBank]=useState()



    const options = userBanks.map(x => {
        if (x.bankName.length > 15) {
            return x.bankName.substring(0, 15) + "...";
        } else {
            return x.bankName;
        }
    });

    console.log(host)
    console.log(currentUser)
    

    useEffect(()=>{
        console.log(currentBank)
    },[currentBank])

    const optionList=options.map(x=><option className="w-8" value={x}>{x}</option>)
    
    useEffect(()=>{
        console.log("current user banks from card")
        console.log(currentUser)
        const url = `http://localhost:3500/users/getBanks?username=${currentUser}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentUser}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setUserBanks(data)
        })
        .catch(err => console.log(err));
        console.log("call two")
    },[])


    function saveBankk(){
        console.log(currentBank)
        if(currentBank==="Select..."){
            setSaveBank()
           
        }
        else{
            setSaveBank(currentBank)
        }
        const url1="http://localhost:3500/group/updateBankInfo"
        fetch(url1, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${groupId}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "groupId":groupId,
                "bankName":currentBank,
                "user":currentUser,
                "host":host.name
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(err => console.log(err));
        setIsEdit(false)
    }

    console.log(saveBank)


    return(
        <div className="w-48 justify bg-hoverGray p-4 border-black h-68 border-2 rounded-lg"> 
            <img className="w-[80%] ml-[10%]" src="/MemberIcon.svg"></img>
            <h1 className="w-[80%] ml-[10%] text-ellipsis overflow-hidden font-semibold text-m">{entireUser.name}</h1>
            {isCurrent?
                isEdit || !saveBank?
                    <div className="flex mt-2">
                        <select value={currentBank} className="w-24 mr-2 mb-4 h-6 border border-black rounded-md" onChange={e=>setCurrentBank((x)=>(e.target.value))}>
                            <option value="Select...">{"Select..."}</option>
                            {optionList}
                        </select>
                        <button onClick={saveBankk}  className="h-6 px-1 text-xs text-white bg-purple hover:bg-darkPurple hover:cursor-pointer rounded-md">save</button>
                    </div>
                    :
                    <div>
                        <div className="flex mt-2">
                            <h1 className="mb-4 w-28 mr-2 text-ellipsis overflow-hidden h-6">{saveBank}</h1>
                            <button onClick={()=>setIsEdit(true)} className="w-6 h-6 px-1 bg-purple hover:bg-darkPurple hover:cursor-pointer rounded-md">
                                <img className="w-4"src='/Edit.svg'></img>
                            </button>                    
                        </div>
                        <div className="bg-[#b0acac] w-100% h-6 p-[0.2rem] rounded-md">
                            <div className="h-[100%] w-[100%]  bg-purple rounded-md justify-start">
                                <p className="text-white mr-[70%] text-xs">100%</p>
                            </div>
                         </div>  
                    </div>

            :
            saveBank?
            <h1>save Bank {saveBank} d</h1>
            :
            <h1>{saveBank}no Save</h1>
            }

            
            {saveBank ?
    null
            :
                isCurrent?
                    <div className="w-100% h-2 p-[0.2rem] rounded-md mb-6">
                        <h1 className="text-[15px]">Select Bank Account</h1>
                    </div>
                    :
                    <div className="w-100% h-6 p-[0.2rem] rounded-md mb-6">
                        <h1 className="text-[15px]">No Bank Connected</h1>
                    </div>  
            }
            

        </div>


    ) 
}