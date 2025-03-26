from db import Database
from datetime import datetime

class reports_controller:
    def __init__(self, db: Database):
        self.conn = db.conn
        self.cur = db.cur

    ''' Product Usage Chart'''

    def get_product_usage(self, name, passed_date):
        year, month, day = self.get_YMD(passed_date)
        querey = self.build_product_usage_querey(name,year,month,day)
        #print("Querey:",querey)
        self.cur.execute(querey)
        product_usage = self.cur.fetchall()
        return product_usage

    def get_YMD(self, passed_date):
        if len(passed_date) == 10:
            passed_date = datetime.strptime(passed_date,'%Y-%m-%d')
            return passed_date.year, passed_date.month, passed_date.day
        elif len(passed_date) ==7:
            passed_date = datetime.strptime(passed_date,'%Y-%m')
            return passed_date.year, passed_date.month, None
        elif len(passed_date) == 4:
            return passed_date, None, None
        else:
            return None, None, None

    def build_product_usage_querey(self, name, year, month , day):
        query = """
            SELECT 
            {date_part} AS {date_unit}, 
            COALESCE(SUM(mi.quantity), 0) + COALESCE(SUM(mod.quantity), 0) AS total_quantity 
            FROM Transaction t 
            JOIN Transaction_MenuItem tm ON t.id = tm.transaction_id 
            JOIN MenuItem m ON m.id = tm.menu_item_id 
            JOIN MenuItem_ingredient mi ON m.id = mi.menu_item_id 
            JOIN Ingredient i ON mi.ingredient_id = i.id 
            LEFT JOIN Transaction_Modification tmod ON tm.id = tmod.transaction_menu_item_id 
            LEFT JOIN Modification mod ON mod.id = tmod.modification_id 
            {date_range} 
            GROUP BY {date_unit}, i.name 
            ORDER BY {date_unit}, i.name;
            """
        
        date_range = "Where i.name = '{name}' ".format(name=name)

        if day:
            date_range += "AND EXTRACT(YEAR FROM t.date) = {year} ".format(year = year)
            date_range += "AND EXTRACT(MONTH FROM t.date) = {month} ".format(month = month)
            date_range += "AND EXTRACT(DAY FROM t.date) = {day} ".format(day = day)
            date_part = "EXTRACT(HOUR FROM t.date)"
            date_unit = "hour"
        elif month:
            date_range += "AND EXTRACT(YEAR FROM t.date) = {year} ".format(year = year)
            date_range += "AND EXTRACT(MONTH FROM t.date) = {month} ".format(month = month)
            date_part = "EXTRACT(DAY FROM t.date)"
            date_unit = "day"
        elif year:
            date_range += "AND EXTRACT(YEAR FROM t.date) = {year} ".format(year = year)
            date_part = "EXTRACT(MONTH FROM t.date)"
            date_unit = "month"
        else:
            date_part = "EXTRACT(YEAR FROM t.date)"
            date_unit = "year"
        
        return query.format(date_part=date_part, date_range=date_range, date_unit=date_unit)


