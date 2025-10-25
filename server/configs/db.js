import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        mongoose.connection.on("connected", () => {
            console.log("Database connected successfully");
        })
        let mongodbURI= process.env.MONGODB_URI;
        const projectName = "resume-builder";
        if(!mongodbURI){
            throw new Error("MongoDB URI is not defined in environment variables");
        }
        if(mongodbURI.endsWith("/")){
            mongodbURI = mongodbURI.slice(0, -1);
        }
        await mongoose.connect(`${mongodbURI}/${projectName}`);
    }
    catch(err){
        console.error("Error connecting to the database:", err);
        // process.exit(1);
    }
}

export default connectDB;