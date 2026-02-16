import mysql.connector
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
from dotenv import load_dotenv

load_dotenv()  # loads .env

SECRET_KEY = os.getenv("SECRET_KEY")

# Optional check
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env")







def connection(): #databasse connection
    return mysql.connector.connect(
        host ="localhost",
        user="root",
        password="Yash@2150",
        database="servease_db"

    )


def send_email(to_mail, subject, body):# email function
    sender_email = "servease.officials@gmail.com"
    sender_password = "mzaiztnblvgeasjp" # gmail app password

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = to_mail
    message["Subject"] = subject

    message.attach(MIMEText(body,"plain"))
    try:
        server = smtplib.SMTP("smtp.gmail.com",587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(message)
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print("Email sending failed:", str(e))

cloudinary.config(
  cloud_name = "dv5gddq6b",
  api_key = "538757866553379",
  api_secret = "3vts0wYDUot7X_B0MCTHDKToqK8",
  secure = True
)








# cloudinary details
# 3vts0wYDUot7X_B0MCTHDKToqK8         api SECRET
# 538757866553379   api KEY
# dv5gddq6b   cloud name