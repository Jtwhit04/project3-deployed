class Transaction:
    def __init__(self, id, date, discount_id, subtotal, tax, tip, total, payment_method, cashier_id):
        self.id = id
        self.date = date
        self.discount_id = discount_id
        self.subtotal = subtotal
        self.tax = tax
        self.tip = tip
        self.total = total
        self.payment_method = payment_method
        self.cashier_id = cashier_id
        
    def as_json(self):
        return {
            'id': self.id,
            'date': self.date,
            'discount_id': self.discount_id,
            'subtotal': self.subtotal,
            'tax': self.tax,
            'tip': self.tip,
            'total': self.total,
            'payment_method': self.payment_method,
            'cashier_id': self.cashier_id
        }
        