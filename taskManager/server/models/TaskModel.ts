import mongoose, { Schema, model } from 'mongoose';


const TaskModel = new Schema({
    owner: { type: Schema.Types.ObjectId, required:true},
    content: { type:String, required:true },
    isCompleted: { type:Boolean, required:true, default:false}
});

export default model("Task", TaskModel);