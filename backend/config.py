import mysql.connector

def connection():
    return mysql.connector.connect(
        host ="localhost",
        user="root",
        password="Yash@2150",
        database="servease_db"

    )

# conn = connection()
# cursor = conn.cursor()
# cursor.execute("DESCRIBE users;")
# for row in cursor.fetchall():
#     print(row)
# cursor.close()
# conn.close()
