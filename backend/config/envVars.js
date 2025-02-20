import dotenv from "dotenv";

dotenv.config();  // This loads environment variables from .env

console.log("DEBUG - MONGO_URI:", process.env.MONGO_URI);  // Debugging statement

export const ENV_VARS = {
    MONGO_URI: process.env.MONGO_URI,  // This should NOT be undefined
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
};


