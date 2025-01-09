import pymysql
connection = pymysql.connect(host='localhost', user='root', password='', database='oncoinsight')
print("Database connection successful")
connection.close()
