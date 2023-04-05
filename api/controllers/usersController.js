const User = require('../model/User')
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


const updateBankInfo = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: req.body.user },
      { "accessToken": req.body.accessToken, "bankName": req.body.bankName },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
};

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




module.exports = { getAllUsers,updateBankInfo,getUserInfo,getUserGroups};