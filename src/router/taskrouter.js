const express = require("express")
const Task = require('../models/task')
const router = new express.Router()
const auth = require("../middleware/auth")
router.post('/tasks',auth ,async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })


    try{
        await task.save()
        res.send(task)
   }
   catch(e){
     res.status(400).send(e)
   }


})

router.get('/tasks',auth,async(req,res)=>{
      
  try{ 
    //  await  req.user.populate('tasks').execPopulate()
    const match = {}
    const sort = {}
    if(req.query.Completed){
       match.Completed = req.query.Completed === 'true'
    }
    if(req.query.sortBy){
      const parts = req.query.sortBy.split(':')
      sort[parts[0]] = parts[1] ==='desc' ? -1 : 1
    }
    
  await req.user.populate({
     path:'tasks',
     match,
     options:{
         limit:parseInt(req.query.limit),
         skip:parseInt(req.query.skip),
         sort
     }
    }).execPopulate()
      
      res.send(req.user.tasks)
   }
   catch(e){
     res.status(500).send(e)
   }
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({ _id , owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
   catch(e){
     res.status(500).send(e)
   }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
  const update = Object.keys(req.body)
  const allowedupdates = ['Description' , 'Completed']
  
  const isValid = update.every((updates)=>{
    allowedupdates.includes(updates)
  }) 
  if(!isValid){
    return res.status(400).send('error : Error invalid')
  }
   
    try{
    const user = await Task.findOne({ _id:req.params.id , owner:req.user._id})
    
     
    if(!user){
      return res.status(404).send()
    }

    user.forEach(element => {
      user[element]  = req.body[element]   
    });
   await user.save
   
    console.log(user)
   }
   catch(e){
     return res.status(400).send(e)
   }

})

router.delete('/task/:id',auth, async (req,res)=>{
  try{
    const user = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
    if(!user){
      return res.status(404).send()
    }
    res.send(user)
  }
  catch(e){
    res.status(500).send()
  }
})

module.exports = router