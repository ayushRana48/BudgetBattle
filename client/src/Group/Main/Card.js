import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


export default function Card({groupId,entireUser,currentUser,host,connectBank,getConnect,setting}){
    
    const [rem,setRem]=useState(40)

    const [isCurrent,setisCurrent] = useState(entireUser.name===currentUser)

    const[isEdit,setIsEdit] = useState(false)

    const[userBanks,setUserBanks]=useState([])

    const[currentBank,setCurrentBank]=useState(entireUser.bankName)

    const[show,setShow]= useState(connectBank)

    const[accessToken,setAccessToken]=useState()

    const[budget,setBudget]=useState()




    const options = userBanks.map(x => {
        if (x.bankName.length > 15) {
            return x.bankName.substring(0, 15) + "...";
        } else {
            return x.bankName;
        }
    });


    // //get bankName
    // useEffect(()=>{
    //     const url = `http://localhost:3500/group/getBankName?groupId=${groupId}&user=${currentUser}&host=${host}`;
    //     let bank="";
    //     fetch(url, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${groupId}`,
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         bank=data
    //         console.log(bank)
    //         setCurrentBank(bank)
            

    //     })
    //     .catch(err => console.log(err));

    // },[])

    //get AccessToken
    useEffect(()=>{


    },[currentBank])

    // //get budget
    // useEffect(()=>{
    //     const url = `http://localhost:3500/group/getBudget?user=${entireUser.name}&groupId=${groupId}&host=${host}`;
    //     fetch(url, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${groupId}`,
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(`${entireUser.name} ${data}`)
    //         setBudget(data)
    //     })
    //     .catch(err => console.log(err));
    // },[])


    const optionList=options.map(x=><option className="w-8" value={x}>{x}</option>)
    
    useEffect(()=>{
        const url = `http://localhost:3500/users/getBanks?username=${entireUser.name}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${entireUser.name}`,
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
            console.log("yait work")
            setShow(false)
            getConnect(false)
        }
        else{
            console.log("nooppork")
            setShow(true)
            getConnect(true)

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
            

        })
        .catch(err => console.log(err));
        setIsEdit(false)
        console.log(`show ${show}`)

    }

    //in here pass username and bank name
    //return percentage
    function calcPercent(){
        const url = `http://localhost:3500/group/getAccessToken?user=${entireUser.name}&bankName=${currentBank}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${groupId}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(`${entireUser.name} ${data}`)
            setAccessToken(data)
            if(data){
                console.log("callwawawa111")
                const url2=`http://localhost:3500/plaid/transactions?accessTokens=${data}`;
                fetch(url2, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${data}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data=>{
                    console.log(data)
                    console.log("callwawawa")
                })
                .catch(err=>console.log(err))
            }
        })
        .catch(err => console.log(err));
    }

    useEffect(()=>{
        calcPercent()
    },[currentBank])




    return(
        <div className="w-48 justify p-4 border-black h-68 border mb-6 rounded-lg"> 
            <img className="w-[80%] ml-[10%]" src="/MemberIcon.svg"></img>
            <h1 className="w-[80%] ml-[10%] text-ellipsis overflow-hidden font-semibold text-m">{entireUser.name}</h1>
            {isCurrent?
                isEdit || !connectBank?
                    <div>
                    <div className="flex mt-2">
                        <select value={currentBank} className="w-24 mr-2 mb-6 h-6 border border-black rounded-md" onChange={e=>setCurrentBank((x)=>(e.target.value))}>
                            <option value="Select...">{"Select..."}</option>
                            {optionList}
                        </select>
                        <button onClick={saveBankk}  className="h-6 px-1 text-xs text-white bg-purple hover:bg-darkPurple hover:cursor-pointer rounded-md">save</button>
    
                    </div>
                        {connectBank&&
             <div className="bg-[#b0acac] w-100%  h-6 p-[0.2rem] rounded-md mb-6">
             <div className="h-[100%] w-[100%]  bg-purple rounded-md justify-start">
                 <p className="text-white mr-[70%] text-xs">100%</p>
             </div>
         </div> 
                        }
                    </div>
                    :
                    <div>
                        <div className="flex mt-2">
                            <h1 className="mb-6 w-28 mr-2 text-ellipsis overflow-hidden h-6">{currentBank}</h1>
                            <button onClick={()=>setIsEdit(true)} className="w-6 h-6 px-1 bg-purple hover:bg-darkPurple hover:cursor-pointer rounded-md">
                                <img className="w-4"src='/Edit.svg'></img>
                            </button>                    
                        </div>
                        <div className="bg-[#b0acac] w-100%  h-6 p-[0.2rem] rounded-md mb-6">
                            <div className="h-[100%] w-[100%]  bg-purple rounded-md justify-start">
                                <p className="text-white mr-[70%] text-xs">100%</p>
                            </div>
                        </div>  
                    </div>

            :
                entireUser.bankName?

                    connectBank?
                    <div>
                        <h1 className="mb-6 w-28  ml-6 mt-2 text-ellipsis overflow-hidden h-6">{entireUser.bankName}</h1>
                        <div className="bg-[#b0acac] w-100%  h-6 p-[0.2rem] rounded-md mb-6">
                                <div className="h-[100%] w-[100%]  bg-purple rounded-md justify-start">
                                    <p className="text-white mr-[70%] text-xs">100%</p>
                                </div>
                        </div>  
                    </div>
                    :
                    <div className="w-100% h-20 p-[0.2rem] rounded-md mb-6">

                        <h1 className="text-[15px] mt-8">Select Bank Account</h1>
                    </div>
                    
                :
                <div className="w-100% h-20 p-[0.2rem] rounded-md mb-6">
 
                        <h1 className="text-[15px] mt-8">No Bank Connected</h1>
                    </div>  


            }

            
            {/* {show ?
            <div className="bg-[#b0acac] w-100%  h-6 p-[0.2rem] rounded-md mb-6">
                <div className="h-[100%] w-[100%]  bg-purple rounded-md justify-start">
                    <p className="text-white mr-[70%] text-xs">100%</p>
                </div>
            </div>  
            :
                !connectBank || isCurrent?
                    <div className="w-100% h-6 p-[0.2rem] rounded-md mb-6">
                        <h1 className="text-[15px]">Select Bank Account</h1>
                    </div>
                    :
                    <div className="w-100% h-6 p-[0.2rem] rounded-md mb-6">
                        <h1 className="text-[15px]">No Bank Connected</h1>
                    </div>  
            }
             */}

        </div>



    ) 
}