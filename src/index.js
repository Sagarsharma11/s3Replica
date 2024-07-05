import { app } from "./app.js";
import connectToDatabase from "./config/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

connectToDatabase()
.then(()=>{
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`⚙️ Server is running at port: ${process.env.PORT}`);
    })  
}) 

.catch((err)=>{
    console.log("MongoDb connection failed!!", err)
})