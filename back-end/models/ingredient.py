class Ingredient:
  def __init__(self, id, name, storage, total_quantity_available, unit, is_active):
    self.id = id
    self.name = name
    self.storage = storage
    self.total_quantity_available = total_quantity_available
    self.unit = unit
    self.is_active = is_active
      
  def as_json(self):
    return {
      'id': self.id,
      'name': self.name,
      'storage': self.storage,
      'total_quantity_available': self.total_quantity_available,
      'unit': self.unit,
      'is_active': self.is_active
    }