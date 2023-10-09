import {Schema, model} from 'mongoose'

const UserShchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required:true},
  email:{type:String, required:true, unique:true},
  password:{type:String, required:true}
}) 

const User = model('User', UserShchema)

export default User 