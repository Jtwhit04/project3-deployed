class Modification:
    def __init__(self, id, name, cost, calories, category, ingredient_id, is_active, quantity):
        self.id = id
        self.name = name
        self.cost = cost
        self.calories = calories
        self.category = category
        self.ingredient_id = ingredient_id
        self.is_active = is_active
        self.quantity = quantity
        
    def as_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'cost': self.cost,
            'calories': self.calories,
            'category': self.category,
            'ingredient_id': self.ingredient_id,
            'is_active': self.is_active,
            'quantity': self.quantity
        }