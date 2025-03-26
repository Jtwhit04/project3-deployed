from sshtunnel import SSHTunnelForwarder
from dotenv import load_dotenv
import os

from app import API
from db import Database

from controllers.employee_controller import employee_controller as ec
from controllers.menuitem_controller import menuitem_controller as mc
from controllers.reports_controller import reports_controller as rc
from controllers.transaction_controller import transaction_controller as tc
from controllers.ingredient_controller import ingredient_controller as ic
from controllers.modification_controller import modification_controller as modc

load_dotenv()


class main:
    def __init__(self):
        self.db = Database()

        # controllers
        employee_controller = ec(self.db)
        menuitem_controller = mc(self.db)
        reports_controller = rc(self.db)
        modification_controller = modc(menuitem_controller, self.db)
        ingredient_controller = ic(menuitem_controller, modification_controller, self.db)
        transaction_controller = tc(ingredient_controller, self.db)
        

        # flask api
        self.api = API(employee_controller, menuitem_controller,reports_controller, transaction_controller, ingredient_controller, modification_controller)
        self.api.run()


# ssh_tunnel = SSHTunnelForwarder(
#     "linux2.cse.tamu.edu",
#     ssh_username=os.getenv("netid_user"),
#     ssh_password=os.getenv("netid_pass"),
#     remote_bind_address=("csce-315-self.db.engr.tamu.edu", 22),
#     local_bind_address=("127.0.0.1", 5432),
# )

# ssh_tunnel.start()
main()
