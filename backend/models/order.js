import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  orderId:{type:String, required:true},
  name:{type:String, required:true},
  items:{type:Array, required:true},
  amount:{type:Number, required:true},
  phone:{type:Number, required:true},
  email:{type:String, required:true},
  address:{type:Object, required:true},
  status:{type:String, default:"Pending"},
  data:{type:Date, default:Date.now()},
  payment:{type:Boolean, default:true},
},{timestamps:true})

const Order =  mongoose.model("Order", orderSchema);
export default Order;