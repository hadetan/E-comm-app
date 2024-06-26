import dotenv from "dotenv";

dotenv.config();

const config = {
    //port
    PORT: process.env.PORT || 5000,

    //mongodb connection
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/ecomm",

    //json web token
    JWT_SECRET: process.env.JWT_SECRET || "jwtsecretkeyishere",
    JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
    
    //AWS
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,

    //mail service
    SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
    SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
    SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
    SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
    SMTP_SENDER_EMAIL: process.env.SMTP_SENDER_EMAIL,

    //razorpay
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_SECRET: process.env.RAZORPAY_SECRET

    
}

export default config;