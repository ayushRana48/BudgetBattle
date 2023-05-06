import './App.css';
import { useState, useEffect } from "react";
import { Route,Routes } from 'react-router-dom'
import Register from './sign/Register';
import Login from './sign/Login';
import In from './dash/In';
import Group from './Group/Group';
import Setting from './Setting/Setting';


function App() {

  const[currentUser,setCurrentUser]= useState()
  const[userGroups,setUserGroups] = useState([])


  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'));
    const groups = JSON.parse(localStorage.getItem('userGroups'));
    if(groups){
      console.log("yadslidlsa")
      console.log(groups)
      setUserGroups(groups)
    }

    console.log(user)
    if(user){
      console.log("yaa")
      setCurrentUser(user)
    }
    console.log(currentUser)
  },[])

  function getCurrentUser(x){
    setCurrentUser(x)
    console.log(currentUser)
  }

  function resetUser(){
    setCurrentUser()
  }

  function getGroups(x){
    console.log("frim app groups")
    if(x.length==0){
      const groups = JSON.parse(localStorage.getItem('userGroups'));
      console.log(groups)
      setUserGroups(groups)

    }
    else{
      localStorage.setItem('userGroups',x);
      setUserGroups(x)
    }
  }


  const groupRoutesList = !userGroups?null:userGroups.map(x=>{
    const groupPath = "/in/group/" + x.groupId
    return(
      <Route path={groupPath} element={<Group currentUser={currentUser} groupName={x.groupName} groupId={x.groupId}/>}> </Route> 
    )
  })

  console.log(groupRoutesList)

  
  return (
    <div className="App">
      <Routes>
            <Route path="/in" element={<In getGroups={getGroups} resetUser= {resetUser} currentUser={currentUser}/>}></Route>
            <Route path="/" element={<Login getCurrentUser={getCurrentUser}/>}></Route> 
            <Route path="/in/settings" element={<Setting currentUser={currentUser} resetUser={resetUser}/>}></Route> 

            {groupRoutesList}
      </Routes>
    </div>
  );
}

export default App;
