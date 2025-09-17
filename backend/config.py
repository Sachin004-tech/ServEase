import mysql.connector

def connection():
    return mysql.connector.connect(
        host ="localhost",
        user="root",
        password="Yash@2150",
        database="servease_db"

    )
