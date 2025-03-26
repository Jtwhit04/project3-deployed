

class Employee:
    def __init__(self, id, name, position, salary, weekly_hours, total_hours, start_date, end_date):
        self.id = id
        self.name = name
        self.position = position
        self.salary = salary
        self.weekly_hours = weekly_hours
        self.total_hours = total_hours
        self.start_date = start_date
        self.end_date = end_date
        
    def as_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'position': self.position,
            'salary': self.salary,
            'weekly_hours': self.weekly_hours,
            'total_hours': self.total_hours,
            'start_date': self.start_date,
            'end_date': self.end_date
        }