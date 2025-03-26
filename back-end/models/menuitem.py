class MenuItem:
    def __init__(self, id, name, cost, calories, category, is_available):
        self.id = id
        self.name = name
        self.cost = cost
        self.calories = calories
        self.category = category
        self.is_available = is_available
        
    def as_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'cost': self.cost,
            'calories': self.calories,
            'category': self.category,
            'is_available': self.is_available
        }
        