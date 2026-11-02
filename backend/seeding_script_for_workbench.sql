-- Disable foreign key checks temporarily to allow clean table dropping and creation
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they already exist (in reverse order of dependencies)
DROP TABLE IF EXISTS directions;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS floors;
DROP TABLE IF EXISTS categories;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. CREATE TABLES (3NF Schema)
-- ==========================================

-- Categories lookup table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

-- Floors lookup table
CREATE TABLE floors (
    floor_id INT AUTO_INCREMENT PRIMARY KEY,
    floor_name VARCHAR(255) NOT NULL
);

-- Main Places table (with Foreign Keys to categories and floors - location removed for 3NF compliance)
CREATE TABLE places (
    place_id INT AUTO_INCREMENT PRIMARY KEY,
    place_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    map_label VARCHAR(255),
    description TEXT,
    category_id INT,
    floor_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (floor_id) REFERENCES floors(floor_id) ON DELETE SET NULL
);

-- Directions table (using a composite primary key: place_id + step_order)
CREATE TABLE directions (
    place_id INT,
    step_order INT,
    direction_text TEXT NOT NULL,
    PRIMARY KEY (place_id, step_order),
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
);


-- ==========================================
-- 2. INSERT INITIAL SEED DATA
-- ==========================================

SET FOREIGN_KEY_CHECKS = 0;

-- Insert Categories
INSERT INTO categories (category_id, category_name) VALUES 
(1, 'Collection zone'),
(2, 'Visitor facility');

-- Insert Floors
INSERT INTO floors (floor_id, floor_name) VALUES 
(1, 'Ground level'),
(2, 'First level'),
(3, 'Second level');

-- Insert Places (location column and values removed)
INSERT INTO places (place_id, place_key, name, map_label, description, category_id, floor_id) VALUES 
(1, 'european-art', 'European Art 1300–1800', 'European Art', 'Explore European paintings and historical masterpieces.', 1, 1),
(2, 'lockers', 'Lockers', 'Lockers', 'Find visitor storage and locker services.', 2, 1),
(3, 'danish-golden-age', 'Danish Golden Age', 'Danish Golden Age', 'Discover classic Danish landscapes and portraits.', 1, 2);

-- Insert Directions
INSERT INTO directions (place_id, step_order, direction_text) VALUES 
-- European Art Directions
(1, 1, 'From the main entrance, continue into the ground-level gallery corridor.'),
(1, 2, 'Turn toward the European Art gallery on your left.'),
(1, 3, 'Enter the European Art 1300–1800 room.'),

-- Lockers Directions
(2, 1, 'From the main entrance, continue into the ground-level corridor.'),
(2, 2, 'Turn toward visitor services on your right.'),
(2, 3, 'The locker area is in the visitor-services room.'),

-- Danish Golden Age Directions
(3, 1, 'From the main entrance, follow the stairs to the first level.'),
(3, 2, 'Turn into the gallery corridor and continue toward Danish collections.'),
(3, 3, 'Enter the Danish Golden Age room.');

SET FOREIGN_KEY_CHECKS = 1;