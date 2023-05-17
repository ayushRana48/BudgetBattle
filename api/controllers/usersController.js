const User = require('../model/User')
const Group = require('../model/Group')

const url=require('url')
const querystring=require('querystring')


const getAllUsers = (req, res) => {
  User.find({})
  .then(users => {
    console.log(users); // Prints all the documents in the "Group" collection
    res.json(users)
  })
  .catch(err => {
    console.error(err); // Handle any errors that occurred
  });
}

const addBank = async (req, res) => {

  try {

    const foundUser = await User.findOne({username:req.body.user}).exec();
    console.log("lsdkjglkdsjgf;solfjalsdk;fjc;laksdjfhc;klasd")
    console.log(foundUser)
    for(let i=0;i<foundUser.banks.length;i++){
      console.log(foundUser.banks[i].account_id)
      console.log(req.body.account_id)
      if(foundUser.banks[i].account_id === req.body.account_id){
        return;
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: req.body.user },
      { $push: { banks: { "accessToken":req.body.accessToken,"bankName": req.body.bankName,"accountNum": req.body.accountNum ,"bankBrand": req.body.bankBrand,"account_id":req.body.account_id} } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
};


const deleteBank = async (req, res) => {
  try {    
    const updatedUser = await User.findOneAndUpdate(
      { username: req.body.user },
      { $pull: { banks: { "accessToken":req.body.accessToken} } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
};

const getUserBanks=async(req,res)=>{
  const parsedUrl=url.parse(req.url)
  const parsedQuery=querystring.parse(parsedUrl.query)

  const user=parsedQuery.username
  const foundUser = await User.findOne({username:user}).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized 
  let list=[]


  //if not empty
  if(foundUser.banks.length>=1){
    list.push(foundUser.banks[0])
    for(let i=1;i<foundUser.banks.length;i++){
      //get rid of duplicate
      if(foundUser.banks[i].account_id===foundUser.banks[i-1].account_id){
        //do nothing
      }
      else{
        list.push(foundUser.banks[i])
      }    
    }
  }

  const updatedUser = await User.findOneAndUpdate(
    { username: user },
    { banks: list},
    { new: true }
  );

  console.log(list)

  res.json(list)
}


const getUserInfo=async(req,res)=>{
  const parsedUrl=url.parse(req.url)
  const parsedQuery=querystring.parse(parsedUrl.query)

  const user=parsedQuery.username
  const foundUser = await User.findOne({username:user}).exec();

  let newJson;
  if(foundUser && foundUser.bankName){
    newJson={
      username:foundUser.username,
      bankName:foundUser.bankName,
      accessToken:foundUser.accessToken
    }
  }
  else{
    if(foundUser){
      newJson={
        username:foundUser.username
      }
    }
    
  }

  res.json(newJson)
}


const getUserGroups=async(req,res)=>{
  const parsedUrl=url.parse(req.url)
  const parsedQuery=querystring.parse(parsedUrl.query)

  const user=parsedQuery.username
  const foundUser = await User.findOne({username:user}).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized 
  console.log(foundUser)
  res.json(foundUser.groups)
}

const sendInvite=async(req,res)=>{
  const {inviter,invitee,groupName,groupId} = req.body
  //first update invitee 
  const foundUser = await User.findOne({username:invitee}).exec();
  const foundGroup = await Group.findOne({groupId:groupId}).exec();


  const alreadySent = foundUser.groupInvites.some(invite => (
    invite.groupId === groupId && invite.groupName === groupName
  ));

  const inGroup= foundGroup ? foundGroup.guests.includes(invitee):false
  
  if (alreadySent) {
    return res.status(409).json({ error: 'Invite already sent' });
  }
  if (inGroup) {
    return res.status(409).json({ error: 'Already in Group' });
  }

  const updatedUser = await User.findOneAndUpdate(
    { username: invitee },
    { $push: { groupInvites: { inviter:inviter,groupId: groupId, groupName:groupName } } },
    { new: true }
  );
  const updatedGroup = await Group.findOneAndUpdate(
    { groupId: groupId },
    { $push: { sentInvites:invitee} },
    { new: true }
  );

  res.json({inviteUser:updatedUser, inviteGroup:updatedGroup})
}

const getAllInvites=async(req,res)=>{
  const parsedUrl=url.parse(req.url)
  const parsedQuery=querystring.parse(parsedUrl.query)

  const user=parsedQuery.username
  const foundUser = await User.findOne({username:user}).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized 
  res.json(foundUser.groupInvites)
}

const acceptInvites = async (req, res) => {
  const { user, groupId, groupName } = req.body;

  const foundGroup1 = await Group.findOne({groupId:groupId}).exec();

  if (!foundGroup1) {
    const userUpdate = {
      $pull: { groupInvites: { groupId, groupName } }
    };
    const options = { new: true };
  
    const foundUser = await User.findOneAndUpdate(
      { username: user },
      userUpdate,
      options
    ).exec();
    return res.status(404).json({ error: 'Group deletedd' });
  }

  const inGroup= foundGroup1 ? foundGroup1.guests.includes(user):false
  if (inGroup) {
    const userUpdate = {
      $pull: { groupInvites: { groupId, groupName } },
      $push: { groups: { groupId, groupName } }
    };

    const foundUser = await User.findOneAndUpdate(
      { username: user },
      userUpdate,
      options
    ).exec();

    return res.status(409).json({ error: 'Already in Group' });
  }


  const userUpdate = {
    $pull: { groupInvites: { groupId, groupName } },
    $push: { groups: { groupId, groupName } }
  };

  const groupUpdate = {
    $pull: { sentInvites:user },
    $push: { guests: {name:user} }
  };

  const options = { new: true };

  const foundUser = await User.findOneAndUpdate(
    { username: user },
    userUpdate,
    options
  ).exec();

  if (!foundUser) {
    return res.status(404).json({ error: 'User found' });
  }

  const foundGroup = await Group.findOneAndUpdate(
    { groupId: groupId },
    groupUpdate,
    options
  ).exec();

  if (!foundGroup) {
    return res.status(404).json({ error: 'Group not found' });
  }

  return res.json({ groupAccept: foundGroup, userAccept: foundUser });
};


const declineInvite = async (req,res)=>{
    const { user, groupId, groupName } = req.body;

    const userUpdate = {
      $pull: { groupInvites: { groupId, groupName } },
    };
  
    const groupUpdate = {
      $pull: { sentInvites:user },
    };
  
    const options = { new: true };

    const foundUser = await User.findOneAndUpdate(
      { username: user },
      userUpdate,
      options
    ).exec();
  
    if (!foundUser) {
      return res.status(404).json({ error: `User found ${user}` });
    }
  
    const foundGroup = await Group.findOneAndUpdate(
      { groupId: groupId },
      groupUpdate,
      options
    ).exec();

    console.log("deleteGroupss")

    res.json({user:foundUser,group:foundGroup})
}



module.exports = { getAllUsers,addBank,deleteBank,getUserBanks,getUserInfo,
  getUserGroups,sendInvite,getAllInvites,acceptInvites,
  declineInvite};