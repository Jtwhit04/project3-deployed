from db import Database
from models.employee import Employee

class employee_controller:
    def __init__(self, db: Database):
        self.conn = db.conn
        self.cur = db.cur

    def get_employee_by_id(self, id, asObj=False):
        self.cur.execute("SELECT * FROM employee WHERE id = %s", (id,))
        employee = self.cur.fetchone()
        if employee:
            employee = Employee(*employee)
            if asObj:
                return employee
            return employee.as_json()
        else:
            return None

    def get_employee_by_name(self, name, asObj=False):
        self.cur.execute("SELECT * FROM employee WHERE name = %s", (name,))
        employee = self.cur.fetchone()
        if employee:
            employee = Employee(*employee)
            if asObj:
                return employee
            return employee.as_json()
        else:
            return None

    def get_all_employees(self, asObj=False):
        self.cur.execute("SELECT * FROM employee")
        employees = self.cur.fetchall()
        if asObj:
            employees = [Employee(*employee) for employee in employees]
        else:
            employees = [Employee(*employee).as_json() for employee in employees]
        return employees

    def add_employee(self, name, position, salary, weekly_hours, total_hours, start_date, end_date):
        self.cur.execute("INSERT INTO employee (name, position, salary, weekly_hours, total_hours, start_date, end_date) VALUES (%s, %s, %s, %s, %s, %s, %s)", (name, position, salary, weekly_hours, total_hours, start_date, end_date))
        self.conn.commit()

    # pass in a dictionary where keys are attributes to be updated
    def update_employee(self, id, updates):
        query = "UPDATE employee SET "
        for key in updates:
            query += key + " = %s, "
        query = query[:-2] + " WHERE id = %s"
        values = list(updates.values())
        values.append(id)
        self.cur.execute(query, values)
        self.conn.commit()

    def delete_employee(self, id):
        self.cur.execute("DELETE FROM employee WHERE id = %s", (id,))
        self.conn.commit()

    def tuple_to_model(self, t):
        return Employee(*t)
