import React, { useState,useEffect } from 'react';

export default function SearchBar({groupId,currentUser,groupName,addInvite,members,host,invites}) {
  const[people,setPeople]=useState([])
  
  const [query, setQuery] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [more,setMore]= useState(false)


  useEffect(() => {
    fetch('http://localhost:3500/users/getAll')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const list = data.map(x=>x.username)
        const index = list.indexOf(currentUser);
        if(index !=-1){
          list.splice(index, 1);
    
        }  
        setPeople(list)
        setSearchResults(list)
      })
      .catch(err => console.log(err));
    console.log("call two")
  }, []);
  

  function handleQueryChange(event) {
    const newQuery = event.target.value;
    setQuery(newQuery);

    const index = people.indexOf(currentUser);
    if(index !=-1){
      people.splice(index, 1);

    }    
    let results = people.filter((person) =>
      person.toLowerCase().includes(newQuery.toLowerCase()
      || person.toLowerCase()==newQuery.toLowerCase())
    );
    // 
    // 
    if(newQuery.length==0){
      results=people
    }
    setSearchResults(results);

    console.log(results)

  }

  function sendInvite(){
    if(invites.includes(query)){
      alert("Already Invited")
      return;
    }
    if(host.name===query){
      alert("Already in Group")
      return;
    }

    const memberNames= members.map(x=>x.name)
    if(memberNames.includes(query)){
      alert("Already in Group")
      return;
    }

    console.log(memberNames)
    if(!people.includes(query)){
      alert("Not registered user")
    }
    else{
      fetch("http://localhost:3500/users/sendInvite", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "inviter":currentUser,
                "invitee":query,
                "groupName":groupName,
                "groupId":groupId
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            addInvite(query)
        })
        .catch(err => console.log(err));
    }
  }

  const inputStyle= `${searchResults.length > 0? "rounded-none rounded-t-md"
  : "rounded-md"
} focus:outline-none border-2 p-1.5 placeholder-ml-4 border-purple mt-2`

  return (
    <div>

    {more?
      (
        <div>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Search people..."
          className={inputStyle}
        />
        <ul className="border w-48 mx-auto border-hoverGray rounded-b-md divide-y divide-hoverGray">
          {searchResults.slice(0, 3).map((person) => (
            <li onClick={()=>setQuery(person)}
              key={person.id}
              className="px-4 py-2 hover:cursor-pointer hover:bg-hoverGray"
            >
              {person}
            </li>
          ))}
      </ul>
      <button onClick={sendInvite} className="hover:bg-darkPurple rounded-md bg-purple px-4  text-white mb-1  mt-2">send invite</button> 
      <div>
        <button onClick={()=>setMore(false)}  className="text-red">Cancel</button>
      </div>

      </div>
      )
      :
      <button onClick={()=>setMore(true)} className="hover:bg-darkPurple text-m rounded-md bg-purple px-20  text-white mb-8  mt-2">+</button> 

    }
    </div>

  )
}
