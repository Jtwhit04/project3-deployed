CREATE TYPE menu_category AS ENUM ('MILK_TEA', 'BREWED_TEA', 'FRUIT_TEA', 'FRESH_MILK', 'ICE_BLENDED', 'CREAMA', 'TEA_MOJITO', 'NEW');
CREATE TYPE order_status AS ENUM ('RECEIVED', 'CANCELED', 'COMPLETE');
CREATE TYPE storage_type AS ENUM ('FREEZER', 'PANTRY', 'FRIDGE');
CREATE TYPE unit_type AS ENUM ('LITERS', 'GRAMS', 'UNITS');
CREATE TYPE modification_category AS ENUM ('TOPPINGS', 'SUGAR', 'ICE_LEVEL', 'MISCELLANEOUS', 'TEA_TYPE');
CREATE TYPE employee_position AS ENUM ('MANAGER', 'TEAM_MEMBER');
CREATE TYPE payment_method AS ENUM ('CARD', 'MOBILE', 'ONLINE');

CREATE TABLE Employee (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position employee_position NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    weekly_hours FLOAT NOT NULL,
    total_hours FLOAT NOT NULL,
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
    end_date TIMESTAMP
);

CREATE TABLE Discount (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    percentage_discount FLOAT,
    flat_discount FLOAT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (percentage_discount IS NOT NULL OR flat_discount IS NOT NULL)
);

CREATE TABLE WeeklyAccounting (
    id SERIAL PRIMARY KEY,
    week_start TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
    revenue DECIMAL(10, 2) NOT NULL,
    wages_payable DECIMAL(10, 2) NOT NULL,
    orders_payable DECIMAL(10, 2) NOT NULL,
    cash DECIMAL(10, 2) NOT NULL,
    last_z_report_date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE MenuItem (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    calories INT NOT NULL,
    category menu_category NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Ingredient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    storage storage_type NOT NULL,
    total_quantity_available FLOAT NOT NULL,
    unit unit_type NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Modification (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    calories INT,
    category modification_category NOT NULL,
    ingredient_id INT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(id)
);

CREATE TABLE InventoryOrder (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    vendor VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
    status order_status NOT NULL
);

CREATE TABLE Transaction (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
    discount_id INT,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    tip DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    cashier_id INT NOT NULL,
    FOREIGN KEY (discount_id) REFERENCES Discount(id),
    FOREIGN KEY (cashier_id) REFERENCES Employee(id)
);

CREATE TABLE MenuItem_Ingredient (
    menu_item_id INT,
    ingredient_id INT,
    quantity FLOAT NOT NULL,
    PRIMARY KEY (menu_item_id, ingredient_id),
    FOREIGN KEY (menu_item_id) REFERENCES MenuItem(id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(id)
);

CREATE TABLE MenuItem_Modification (
    menu_item_id INT,
    modification_id INT,
    PRIMARY KEY (menu_item_id, modification_id),
    FOREIGN KEY (menu_item_id) REFERENCES MenuItem(id),
    FOREIGN KEY (modification_id) REFERENCES Modification(id)
);

CREATE TABLE InventoryOrder_Ingredient (
    inventory_order_id INT,
    ingredient_id INT,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (inventory_order_id, ingredient_id),
    FOREIGN KEY (inventory_order_id) REFERENCES InventoryOrder(id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(id)
);

CREATE TABLE Transaction_MenuItem (
    id SERIAL PRIMARY KEY,
    transaction_id INT,
    menu_item_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES Transaction(id),
    FOREIGN KEY (menu_item_id) REFERENCES MenuItem(id)
);

CREATE TABLE Transaction_Modification (
    id SERIAL PRIMARY KEY,
    transaction_menu_item_id INT,
    modification_id INT,
    FOREIGN KEY (transaction_menu_item_id) REFERENCES Transaction_MenuItem(id),
    FOREIGN KEY (modification_id) REFERENCES Modification(id)
);


-- for testing

-- CREATE TABLE Transaction2 (
--     id SERIAL PRIMARY KEY,
--     date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
--     discount_id INT,
--     subtotal DECIMAL(10, 2) NOT NULL,
--     tax DECIMAL(10, 2) NOT NULL,
--     tip DECIMAL(10, 2) NOT NULL,
--     total DECIMAL(10, 2) NOT NULL,
--     payment_method payment_method NOT NULL,
--     cashier_id INT NOT NULL,
--     FOREIGN KEY (discount_id) REFERENCES Discount(id),
--     FOREIGN KEY (cashier_id) REFERENCES Employee(id)
-- );

-- CREATE TABLE Transaction_MenuItem2 (
--     id SERIAL PRIMARY KEY,
--     transaction_id INT,
--     menu_item_id INT,
--     quantity INT NOT NULL,
--     FOREIGN KEY (transaction_id) REFERENCES Transaction2(id),
--     FOREIGN KEY (menu_item_id) REFERENCES MenuItem(id)
-- );

-- CREATE TABLE Transaction_Modification2 (
--     id SERIAL PRIMARY KEY,
--     transaction_menu_item_id INT,
--     modification_id INT,
--     FOREIGN KEY (transaction_menu_item_id) REFERENCES Transaction_MenuItem2(id),
--     FOREIGN KEY (modification_id) REFERENCES Modification(id)
-- );