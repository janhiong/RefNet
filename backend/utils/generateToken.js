import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, ENV_VARS.JWT_SECRET, {expiresIn: "15d"});

    res.cookie("jwt-referral",token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //in 15 days in MS
        httpOnly: true, //prevent XSS attacks cross-site scriping attacks, make it not be accessed by JS
        sameSite: "strict",
        secure: ENV_VARS.NODE_ENV !== "development",
    });

    return token;
}