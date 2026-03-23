# Compostly Schema

This document describes the database schema for Compostly based on:

- the ERD image provided for the project
- the current SQL files in `db/schema.sql`
- the functionality currently implemented in the website and API

As of March 23, 2026, live persisted features include account creation and sign-in through `user_account`, profile preference updates on `user_account`, rebate reads from `rebate`, and dashboard pickup scheduling through `scheduled_pickup`. Map data and weekly composting tasks are still static in the frontend.

## Current Implementation Status

### Persisted today

- `user_account`
  - Used by the `POST /api/signup` endpoint
  - Used by the `POST /api/login` endpoint
  - Powers the profile page fields for name, email, address, and service type
- `rebate`
  - Queried by the dashboard rebate card
- `scheduled_pickup`
  - Stores user-selected pickup dates from the dashboard schedule flow

### Defined in SQL or ERD, but not yet wired into the app

- `pickup_time`
- `compost_truck_driver`
- `dropoff_location`
- `region` (not present in the original ERD image as a table, but required by the foreign keys shown there)

## Recommended Logical Schema

### 1. `region`

This table is inferred from the ERD because both `user_account.region_id` and `pickup_time.region_id` reference it.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `region_id` | `SERIAL` / `INT` | Primary key | Region identifier |
| `name` | `VARCHAR(100)` | Not null, unique | Human-readable region name |
| `city` | `VARCHAR(100)` | Nullable | Optional city grouping |
| `state` | `VARCHAR(50)` | Nullable | Optional state grouping |
| `postal_code` | `VARCHAR(20)` | Nullable | Optional service-area code |

### 2. `user_account`

This is the only table actively used by the website backend today.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `user_id` | `SERIAL` | Primary key | Internal user/account ID |
| `first_name` | `VARCHAR(100)` | Not null | Captured during sign-up |
| `last_name` | `VARCHAR(100)` | Not null | Captured during sign-up |
| `email` | `VARCHAR(255)` | Not null, unique | Used for login |
| `password` | `VARCHAR(255)` | Not null | Stores a bcrypt hash |
| `pickup_or_dropoff` | `VARCHAR(50)` | Nullable | Current UI uses `Pickup` or `Dropoff` |
| `address` | `TEXT` | Nullable | Required by the frontend only when service type is `Pickup` |
| `region_id` | `INT` | Nullable, foreign key to `region(region_id)` | Present in ERD and SQL, not currently written by the API |

### 3. `pickup_time`

Represents available collection windows for a service region.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `time_id` | `SERIAL` | Primary key | Pickup-time record ID |
| `region_id` | `INT` | Not null, foreign key to `region(region_id)` | Associates availability with a region |
| `available_times` | `VARCHAR(255)` | Nullable | Current SQL stores a display string such as `Monday 08:00-12:00` |

### 4. `rebate`

Tracks compost-based rebates associated with a user account.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `rebate_id` | `SERIAL` | Primary key | Rebate record ID |
| `account_id` | `INT` | Not null, foreign key to `user_account(user_id)` | The user receiving the rebate |
| `compost_weight` | `FLOAT` | Nullable | Weight used to calculate the rebate |
| `rebate_amount` | `FLOAT` | Nullable | Currency amount; `NUMERIC(10,2)` would be safer in production |

### 5. `scheduled_pickup`

Represents a pickup date a specific user has scheduled from the dashboard.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `pickup_id` | `SERIAL` | Primary key | Scheduled pickup record ID |
| `account_id` | `INT` | Not null, foreign key to `user_account(user_id)` | The user who scheduled the pickup |
| `pickup_date` | `DATE` | Not null | Calendar date selected in the dashboard |
| `created_at` | `TIMESTAMPTZ` | Not null, default `now()` | Audit timestamp for when the pickup was scheduled |

### 6. `compost_truck_driver`

Represents internal route assignments for pickup operations.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `employee_id` | `SERIAL` | Primary key | Driver/employee ID |
| `route_id` | `VARCHAR(50)` | Nullable | Route identifier such as `SLC-A` |
| `route_time` | `VARCHAR(100)` | Nullable | Scheduled route window |

### 7. `dropoff_location`

Represents compost drop-off sites shown conceptually in the ERD and in the map experience.

| Column | Type | Constraints | Notes |
| --- | --- | --- | --- |
| `location_id` | `SERIAL` | Primary key | Drop-off site ID |
| `address` | `TEXT` | Nullable | Physical location or site name |
| `route_time` | `VARCHAR(100)` | Nullable | Intended operating or service window |

## Relationship Summary

- One `region` can have many `user_account` records.
- One `region` can have many `pickup_time` records.
- One `user_account` can have many `rebate` records.
- One `user_account` can have many `scheduled_pickup` records.
- `dropoff_location` and `compost_truck_driver` are standalone in the current SQL, but they likely become route/service tables as the product expands.

## How This Maps To The Current Website

### Live and backed by the database

- Sign up creates a row in `user_account`
- Sign in reads from `user_account`
- Profile displays values returned from `user_account`
- Dashboard rebates read from `rebate`
- Dashboard pickup scheduling reads from and writes to `scheduled_pickup`

### Currently frontend-only or placeholder

- Dashboard expense data is hardcoded and not stored in the database
- Map locations are hardcoded and not loaded from `dropoff_location`
- Contact form submissions are not persisted
- Weekly composting checklist progress is hardcoded in the dashboard

## Gaps Between The ERD And The Current Code

- The ERD references `region_id`, but there is no `region` table in `db/schema.sql`.
- The backend does not currently save `region_id` for new users.
- The map would need latitude/longitude columns if `dropoff_location` is going to drive the Leaflet map.
- `pickup_time.available_times` and `dropoff_location.route_time` are stored as strings; normalized date/time fields would be more flexible later.
- `rebate_amount` should eventually use `NUMERIC(10,2)` instead of `FLOAT`.

## Suggested Next Revision

If the team wants the database to support the current UI more cleanly, the next schema revision should:

1. Add a real `region` table.
2. Add `latitude` and `longitude` to `dropoff_location`.
3. Connect signup to `region_id`.
4. Replace static dashboard expense data with a dedicated database table.
5. Replace static map markers with `dropoff_location` queries.
