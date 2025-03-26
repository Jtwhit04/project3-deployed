from db import Database
from datetime import datetime
from models.transaction import Transaction
from models.menuitem import MenuItem
#from .ingredient_controller import ingredient_controller

class transaction_controller:
    def __init__(self, ic, db: Database):
        self.ingredient_controller = ic
        self.conn = db.conn
        self.cur = db.cur

    def add_transaction(
        self,
        discount_id,
        subtotal,
        tax,
        tip,
        total,
        payment_method,
        cashier_id,
        menu_items,
    ):
        date = datetime.now()
        query = """
            INSERT INTO Transaction 
            (date, discount_id, subtotal, tax, tip, total, payment_method, cashier_id) 
            VALUES 
            (%s, %s, %s, %s, %s, %s, %s, %s) 
            RETURNING id;
            """
        self.cur.execute(
            query,
            (date, discount_id, subtotal, tax, tip, total, payment_method, cashier_id),
        )
        transaction_id = self.cur.fetchone()[0]

        if menu_items:
            self.add_menu_items_to_transaction(transaction_id, menu_items)

        self.conn.commit()
        return transaction_id

    def add_menu_items_to_transaction(self, transaction_id, menu_items):
        for menu_item in menu_items:
            query = """
                INSERT INTO Transaction_MenuItem
                (transaction_id, menu_item_id, quantity) 
                VALUES 
                (%s, %s, %s) 
                RETURNING id;
                """
            self.cur.execute(query, (transaction_id, menu_item.get("id"), 1))
            transaction_menu_item_id = self.cur.fetchone()[0]
            self.ingredient_controller.reduce_stock_by_menu_item(menu_item.get("id"))

            if menu_item.get("modifications"):
                self.add_modifications_to_transactionMenuItem(
                    transaction_menu_item_id, menu_item.get("modifications")
                )

    def add_modifications_to_transactionMenuItem(
        self, transaction_menu_item_id, modifications
    ):
        for modification in modifications:
            query = """
                INSERT INTO Transaction_Modification
                (transaction_Menu_Item_id, modification_id) 
                VALUES 
                (%s, %s) 
                RETURNING id;
                """
            self.cur.execute(query, (transaction_menu_item_id, modification.get("id")))
            self.ingredient_controller.reduce_stock_by_modification(modification)

    def get_all_transactions(self, range = "Today", asObj=False):
        query = "SELECT * FROM transaction WHERE date >= date_trunc('day', CURRENT_DATE) order by id desc;"
        if range == "All":
            query = "SELECT * FROM transaction order by id desc;"
        elif range == "Week":
            query = "SELECT * FROM transaction WHERE date >= date_trunc('week', CURRENT_DATE) order by id desc;"
        elif range == "Month":
            query = "SELECT * FROM transaction WHERE date >= date_trunc('month', CURRENT_DATE) order by id desc;"
        self.cur.execute(query)
        transactions = self.cur.fetchall()
        transactions = [Transaction(*transaction) for transaction in transactions]
        if asObj:
            return transactions
        return [transaction.as_json() for transaction in transactions]
    

    # def get_transaction_by_id(transaction_id):

    # def get_transactions_by_dates(start_date, end_date):

    # def get_transactions_by_menu_item(menu_item_id):
