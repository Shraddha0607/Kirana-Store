import mongoose  from "mongoose";
import { DATABASE_NAME } from "../constants.js";

async function connectDataBase(){
      try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DATABASE_NAME}`);
       console.log("DataBase is Connected");     
      }catch(error){
            console.log("MongoDB Connection Error :",error);
            process.exit(1)
      }
}

export default connectDataBase;