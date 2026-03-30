import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        unique:true
    },

    line:{
        type:String,
        required:true
    },

    order:{
        type:Number,
        required:true
    }
},
{timestamps:true}
);

const Station = mongoose.model("Station",stationSchema);

export default Station; 