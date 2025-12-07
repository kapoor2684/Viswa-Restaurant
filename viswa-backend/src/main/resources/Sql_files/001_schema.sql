CREATE TABLE food_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE food_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category INT,                               -- references foodcategories.id as INTEGER
    type VARCHAR(50),
    price NUMERIC(6, 2),
    image TEXT,
    description TEXT,
    ingredient TEXT[],
    available BOOLEAN,
    is_featured BOOLEAN DEFAULT FALSE,
    rating NUMERIC(2, 1),
    reviews INT,
    likes INT,
    discount VARCHAR(10),
    calories INT,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category FOREIGN KEY(category) REFERENCES food_categories(id)
);

CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    dob DATE,
    gender VARCHAR(10),
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    last_order_date DATE,
    total_orders INT DEFAULT 0,
    loyalty_points INT DEFAULT 0,
    preferred_payment_method VARCHAR(50),
    is_subscribed BOOLEAN DEFAULT TRUE,
    wallet_money NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,                   -- references customer.id as INTEGER
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_address_customer FOREIGN KEY(customer_id) REFERENCES customer(id)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    customer_name VARCHAR(255),
    phone VARCHAR(20),
    order_date TIMESTAMP NOT NULL,
    address_id INTEGER,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    total_amount NUMERIC(10, 2),
    status VARCHAR(50),
    delivery_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customer(id),
    CONSTRAINT fk_order_address FOREIGN KEY (address_id) REFERENCES address(id)
);


CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    item_id INTEGER,
    name VARCHAR(255),
    price NUMERIC(10, 2),
    quantity INT,
    total_price NUMERIC(10, 2),
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_item FOREIGN KEY (item_id) REFERENCES food_items(id)
);

CREATE INDEX idx_order_customerId ON orders(customerId);
CREATE INDEX idx_order_orderDate ON orders(orderDate);
CREATE INDEX idx_orderitem_orderId ON order_items(orderId);
CREATE INDEX idx_fooditems_category ON food_items(category);

CREATE TABLE reserve_table (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,                            -- references customer.id as INTEGER
    name VARCHAR(255),
    contact VARCHAR(20),
    email VARCHAR(255),
    booking_date DATE,
    time TIME,
    guests INT,
    selected_table INT,
    status VARCHAR(50) DEFAULT 'PENDING',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_reservetable_customer FOREIGN KEY(customer_id) REFERENCES customer(id)
);

CREATE TABLE reserve_partyhall (
    id SERIAL PRIMARY KEY,
    booking_name VARCHAR(255),
    customer_id INTEGER,                            -- references customer.id as INTEGER
    booking_date DATE,
    event_type VARCHAR(255),
    start_time TIME,
    end_time TIME,
    total_hours INT,
    guests INT,
    special_requests TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'PENDING',
    venue VARCHAR(255),
    payment_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_reservepartyhall_customer FOREIGN KEY(customer_id) REFERENCES customer(id)
);

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_customer FOREIGN KEY(customer_id) REFERENCES customer(id),
  CONSTRAINT fk_cart_item FOREIGN KEY(item_id) REFERENCES food_items(id)
);

