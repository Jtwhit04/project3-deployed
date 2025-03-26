from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from time import sleep
from dotenv import load_dotenv
import os

from models.employee import Employee
from models.menuitem import MenuItem

from controllers.employee_controller import employee_controller
from controllers.menuitem_controller import menuitem_controller
from controllers.reports_controller import reports_controller
from controllers.transaction_controller import transaction_controller
from controllers.ingredient_controller import ingredient_controller
from controllers.modification_controller import modification_controller

load_dotenv()


class API:
    def __init__(
        self,
        employee_controller: employee_controller,
        menuitem_controller: menuitem_controller,
        reports_controller: reports_controller,
        transaction_controller: transaction_controller,
        ingredient_controller: ingredient_controller,
        modification_controller: modification_controller,
    ):
        print("initializing API")
        self.app = Flask(__name__)
        self.curr_employee = None
        CORS(self.app, supports_credentials=True)

        @self.app.route("/", methods=["GET"])
        def home():
            return "Hello from the api"

        @self.app.route("/employees", methods=["GET"])
        def getEmployees():
            name = request.args.get("name")
            if name:
                employee = employee_controller.get_employee_by_name(name)
                if employee:
                    return jsonify(employee)
                else:
                    return jsonify({"error": f"Employee with name {name} not found"})
            else:
                employees = employee_controller.get_all_employees()
                return jsonify(employees)

        @self.app.route("/login", methods=["POST"])
        def login():
            data = request.json
            self.curr_employee = employee_controller.get_employee_by_id(data["id"])
            if self.curr_employee:
                return jsonify(self.curr_employee)
            else:
                return jsonify({"error": "Invalid credentials"}), 401

        @self.app.route("/get-menu-categories", methods=["GET"])
        def get_menu_categories():
            categories = menuitem_controller.get_menu_categories()
            return jsonify(categories)

        @self.app.route("/get-menu-items", methods=["GET"])
        def get_menu_items():
            category = request.args.get("category")
            items = menuitem_controller.get_menu_items(category)
            return jsonify(items)

        @self.app.route("/get-modifications-by-category", methods=["GET"])
        def get_modifications_by_category():
            category = request.args.get("category")
            modifications = modification_controller.get_modifications_by_category(
                category
            )
            return jsonify(modifications)

        @self.app.route("/get-all-modifications", methods=["GET"])
        def get_all_modifications():
            modifications = modification_controller.get_all_modifications()
            return jsonify(modifications)

        @self.app.route("/add-transaction", methods=["POST"])
        def add_transaction():
            discount_id = request.get_json().get("discount_id")
            subtotal = request.get_json().get("subtotal")
            tax = request.get_json().get("tax")
            tip = request.get_json().get("tip")
            total = request.get_json().get("total")
            payment_method = request.get_json().get("payment_method")
            cashier_id = request.get_json().get("cashier_id")
            menu_items = request.get_json().get("menu_items")
            transaction_id = transaction_controller.add_transaction(
                discount_id,
                subtotal,
                tax,
                tip,
                total,
                payment_method,
                cashier_id,
                menu_items,
            )
            return jsonify(transaction_id)  # need to add error handling
        
        @self.app.route("/get-all-transactions", methods=["GET"])
        def get_all_transactions():
            range = request.args.get("range")
            transactions = transaction_controller.get_all_transactions(range)
            return jsonify(transactions)

        @self.app.route("/get-product-usage", methods=["GET"])
        def get_product_usage():
            name = request.args.get("name")
            passed_date = request.args.get("date")
            product_Usage = reports_controller.get_product_Usage(name, passed_date)
            return jsonify(product_Usage)

        @self.app.route("/get-ingredients", methods=["GET"])
        def get_ingredients():
            ingredients = ingredient_controller.get_all_ingredients()
            return jsonify(ingredients)

    def run(self):
        self.app.run(port=5000)
