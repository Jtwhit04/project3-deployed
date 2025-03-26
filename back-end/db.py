import psycopg2
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

load_dotenv()

class Database:
    def __init__(self):
        print("initializing database")
        self.conn = psycopg2.connect(
            database="team_30_db",
            host="csce-315-db.engr.tamu.edu",
            user="team_30",
            password=os.getenv("db_pass"), # place db_pass in your local .env folder
            port="5432"
        )
        
        self.cur = self.conn.cursor()
        
    def execute(self, query, params):
        self.cur.execute(query, params)
        self.conn.commit()
        
    def get(self, query, params):
        self.cur.execute(query, params)
        return self.cur.fetchall()
