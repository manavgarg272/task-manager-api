const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sharp = require('sharp')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avtar:{
        type:Buffer
    }

},{
    timestamps:true
})
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.generateAuthToken = async function () {
   const user = this
   const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
   user.tokens = user.tokens.concat({token}) 
   await user.save()
   return token
 
}

userSchema.methods.toJSON = function () {
  const user = this
  const otherUser = user.toObject()

  delete otherUser.password
  delete otherUser.tokens
  delete otherUser.avtar
  return otherUser

}

userSchema.statics.findByCredentials = async (email,password)=>{
  const user = await User.findOne({email})
  if(!user){
      throw  new Error('Unable to logIn')
  }

  const isMatch = await bcrypt.compare(password,user.password)

  if(!isMatch){
      throw new Error('Unable to login ')
  }
  return user

}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove' , async  (next)=>{
   const user = this
     await Task.deleteMany({owner:user._id})
   next()
})

const User = mongoose.model('User', userSchema)

module.exports = User