from db import Database
from models.menuitem import MenuItem


class menuitem_controller:
    def __init__(self, db: Database):
        self.conn = db.conn
        self.cur = db.cur

    def get_menu_items(self, category=None, asObj=False):
        if category:
            self.cur.execute(
                "SELECT * FROM menuitem WHERE category = %s AND is_active = true",
                (category,),
            )
        else:
            self.cur.execute("SELECT * FROM menuitem where is_active = true")
        menu_items = self.cur.fetchall()
        menu_items = [MenuItem(*menu_item) for menu_item in menu_items]
        if asObj:
            return menu_items
        return [menu_item.as_json() for menu_item in menu_items]

    def get_menu_categories(self):
        self.cur.execute("SELECT DISTINCT category FROM menuitem")
        categories = self.cur.fetchall()
        return [category[0] for category in categories]

    def get_menu_item_by_id(self, id, asObj=False):
        self.cur.execute("SELECT * FROM menuitem WHERE id = %s", (id,))
        menu_item = self.cur.fetchone()
        if menu_item:
            menu_item = MenuItem(*menu_item)
            if asObj:
                return menu_item
            return menu_item.as_json()
        else:
            return None

    def get_menu_item_by_name(self, name, asObj=False):
        self.cur.execute(
            "SELECT * FROM menuitem WHERE name = %s AND is_active = true", (name,)
        )
        menu_item = self.cur.fetchone()
        if menu_item:
            menu_item = MenuItem(*menu_item)
            if asObj:
                return menu_item
            return menu_item.as_json()
        else:
            return None

    def add_menu_item(self, name, cost, calories, category, asObj=False):
        try:
            reset_query = (
                "SELECT setval('menuitem_id_seq', (SELECT MAX(id) FROM menuitem));"
            )
            self.cur.execute(reset_query)

            insert_query = "INSERT INTO menuitem (name, cost, calories, category) VALUES (%s, %s, %s, %s::menu_category) RETURNING id;"
            self.cur.execute(insert_query, (name, cost, calories, str(category)))
            result = self.cur.fetchone()
            self.conn.commit()

            menu_item_id = result[0] if result else 0
            if menu_item_id:
                menuitem = MenuItem(menu_item_id, name, cost, calories, category, True)
                if asObj:
                    return menuitem
                else:
                    menuitem.as_json()
            return None
        except Exception as e:
            print(e)
            self.conn.rollback()
            return None

    def update_menu_item(self, id, updates):
        query = "UPDATE menuitem SET "
        for key in updates:
            query += key + " = %s, "
        query = query[:-2] + " WHERE id = %s"
        values = list(updates.values())
        values.append(id)
        self.cur.execute(query, values)
        self.conn.commit()

    def delete_menu_item(self, id):
        self.cur.execute("UPDATE menuitem SET is_active = false WHERE id = %s", (id,))
        self.conn.commit()

    def get_ingredients_used_by_menu_item(self, id):
        # print(id)
        self.cur.execute(
            "Select ingredient_id AS id, quantity From MenuItem_Ingredient WHERE menu_item_id = %s",
            (id,),
        )
        return self.cur.fetchall()
