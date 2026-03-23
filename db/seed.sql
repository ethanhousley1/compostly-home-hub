-- 1. Populate pickup_time
-- Note: region_id 101 and 102 are arbitrary integers since the Region table is missing
INSERT INTO pickup_time (region_id, available_times) VALUES
(101, 'Monday 08:00-12:00'),
(102, 'Wednesday 13:00-17:00'),
(103, 'Friday 09:00-11:00'),
(104, 'Saturday 11:00-08:00');


-- 2. Populate user_account
INSERT INTO user_account (first_name, last_name, email, password, pickup_or_dropoff, address, region_id) VALUES
('Logan', 'Smith', 'logan@example.com', 'pbkdf2_sha256$hashed_placeholder', 'pickup', '123 Main St, Tech City', 101),
('Ethan', 'Doe', 'ethan@example.com', 'pbkdf2_sha256$hashed_placeholder', 'dropoff', '456 Green Ave, Eco Town', 102),
('Broc', 'Jefferson', 'broc@example.com', 'pbkdf2_sha256$hashed_placeholder', 'pickup', '22 Dirt Ave, Cool City', 103),
('Garrett', 'Johnson', 'garrett@example.com', 'pbkdf2_sha256$hashed_placeholder', 'dropoff', '789 Earth Rd, Tech City', 104);

-- 3. Populate rebate
-- Linking to user_id 1 (Logan) and 2 (Jane)
INSERT INTO rebate (account_id, compost_weight, rebate_amount) VALUES
(1, 12.5, 2.50),
(1, 8.0, 1.60),
(2, 25.0, 5.00);

-- 4. Populate scheduled_pickup
INSERT INTO scheduled_pickup (account_id, pickup_date) VALUES
(1, '2026-03-25'),
(1, '2026-03-29'),
(3, '2026-03-27');

-- 5. Populate compost_truck_driver
INSERT INTO compost_truck_driver (route_id, route_time) VALUES
('SLC-A', '08:00 AM'),
('PROVO-B', '12:30 PM');

-- 6. Populate dropoff_location
INSERT INTO dropoff_location (address, route_time) VALUES
('Central Community Garden', '09:00 AM'),
('Northside Recycling Center', '14:00 PM');
