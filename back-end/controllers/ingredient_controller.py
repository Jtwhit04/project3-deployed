from db import Database
from models.ingredient import Ingredient
#from .menuitem_controller import menuitem_controller

class ingredient_controller:
    def __init__(self, mc, modc, db: Database):
        self.menuitem_controller = mc
        self.modification_controller = modc
        self.conn = db.conn
        self.cur = db.cur

    def reduce_stock_by_menu_item(self, menu_item_id):
        ingredients = self.menuitem_controller.get_ingredients_used_by_menu_item(
            menu_item_id
        )
        print(ingredients)
        for ingredient in ingredients:
            querey = """
            Update ingredient
            SET total_quantity_available = total_quantity_available - %s
            WHERE id = %s
            """

            self.cur.execute(querey, (ingredient[1], ingredient[0]))
            self.conn.commit()

    def reduce_stock_by_modification(self, modification):
        # ingredient = self.modification_controller.get_ingredients_used_by_modification(modification_id)
        querey = """
        Update ingredient
        SET total_quantity_available = total_quantity_available - %s
        WHERE id = %s
        """
        self.cur.execute(
            querey, (modification.get("quantity"), modification.get("ingredient_id"))
        )
        self.conn.commit()

    def get_all_ingredients(self):
        self.cur.execute("SELECT * FROM ingredient ORDER BY id")
        ingredient_data = self.cur.fetchall()
        result = []
        for data in ingredient_data:
            ingredient_object = Ingredient(
                id=data[0],
                name=data[1],
                storage=data[2],
                total_quantity_available=data[3],
                unit=data[4],
                is_active=data[5]
            )
            result.append(ingredient_object.as_json())
        return result