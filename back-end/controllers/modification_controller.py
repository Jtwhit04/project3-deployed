from db import Database
from datetime import datetime

from models.modification import Modification
# from .menuitem_controller import menuitem_controller

class modification_controller:
    def __init__(self, mc, db: Database):
        # self.menuitem_controller = mc
        self.conn = db.conn
        self.cur = db.cur

    def get_ingredients_used_by_modification(self, modification_id):
        print(modification_id)
        self.cur.execute("Select ingredient_id AS id, quantity FROM modification WHERE id = %s", (modification_id,))
        return self.cur.fetchall()
    
    def get_modification_categories(self):
        self.cur.execute("SELECT DISTINCT category FROM modification WHERE is_active = true")
        categories = self.cur.fetchall()
        return [category[0] for category in categories]

    def get_modifications_by_category(self, category, asObj=False):
        self.cur.execute("""
                         SELECT m.*,
                            (Case
                            WHEN EXISTS( Select 1
                            FROM Ingredient i
                            WHERE i.id = m.ingredient_id AND i.total_quantity_available <= 0)
                            THEN FALSE ELSE TRUE END) AS available
                            FROM Modification m
                            WHERE m.category = %s AND is_active = true
                            """, (category,))
        modifications = self.cur.fetchall()
        if modifications:
            modifications = [Modification(*modification) for modification in modifications]
            if asObj:
                return modifications
            return [modification.as_json() for modification in modifications]
        return None
    
    def get_all_modifications(self, asObj=False):
        self.cur.execute("SELECT * FROM modification WHERE is_active = true")
        modifications = self.cur.fetchall()
        if modifications:
            modifications = [Modification(*modification) for modification in modifications]
            if asObj:
                return modifications
            return [modification.as_json() for modification in modifications]
        return None
    
    def get_modification_by_id(self, id, asObj=False):
        self.cur.execute("SELECT * FROM modification WHERE id = %s", (id,))
        modification = self.cur.fetchone()
        if modification:
            modification = Modification(*modification)
            if asObj:
                return modification
            return modification.as_json()
        return None
    
    def add_modification(self, name, cost, category, ingredient_id, quantity, asObj=False):
        try:
            reset_query = "SELECT setval('modification_id_seq', (SELECT MAX(id) FROM modification));"
            self.cur.execute(reset_query)

            insert_query = "INSERT INTO modification (name, cost, category, ingredient_id, quantity) VALUES (%s, %s, %s, %s, %s) RETURNING id;"
            self.cur.execute(insert_query, (name, cost, category, ingredient_id, quantity))
            result = self.cur.fetchone()
            self.conn.commit()

            modification_id = result[0] if result else 0
            if modification_id:
                modification = (modification_id, name, cost, category, ingredient_id, quantity, True)
                if asObj:
                    return modification
                else:
                    return modification
        except Exception as e:
            print(e)
            return None
        
    def update_modification(self, id, updates):
        try:
            update_query = "UPDATE modification SET "
            for key in updates:
                update_query += f"{key} = %s, "
            update_query = update_query[:-2] + " WHERE id = %s"
            self.cur.execute(update_query, list(updates.values()) + [id])
            self.conn.commit()
            return True
        except Exception as e:
            print(e)
            return False

    def delete_modification(self, id):
        try:
            self.cur.execute("UPDATE modification SET is_active = false WHERE id = %s", (id,))
            self.conn.commit()
            return True
        except Exception as e:
            print(e)
            return False