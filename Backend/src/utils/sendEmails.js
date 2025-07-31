import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config({
      path: ".env"
})

const sendEmail = async(email,subject,text)=>{
      try {
            const transporter = nodemailer.createTransport({
                  host: process.env.HOST,
                  service : process.env.SERVICE,
                  port : Number(process.env.EMAIL_PORT),
                  secure:Boolean(process.env.SECURE),
                  auth:{
                        user:process.env.USER,
                        pass:process.env.PASSWORD
                  } 
            });

            await transporter.sendMail({
                  from: process.env.USER,
                  to:email,
                  subject:subject,
                  text:text
            });
      } catch (error) {
            console.log("Email Utility Error: ",error);
      }
} 

export default sendEmail;