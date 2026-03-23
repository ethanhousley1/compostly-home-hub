-- Compostly full database schema
-- This file mirrors db/schema.sql and represents the current state of the database.

-- Sequences
CREATE SEQUENCE IF NOT EXISTS compost_truck_driver_employee_id_seq;
CREATE SEQUENCE IF NOT EXISTS dropoff_location_location_id_seq;
CREATE SEQUENCE IF NOT EXISTS pickup_time_time_id_seq;
CREATE SEQUENCE IF NOT EXISTS rebate_rebate_id_seq;
CREATE SEQUENCE IF NOT EXISTS user_account_user_id_seq;

-- Tables (ordered for foreign-key dependencies)

CREATE TABLE IF NOT EXISTS public.user_account (
  user_id integer NOT NULL DEFAULT nextval('user_account_user_id_seq'::regclass),
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  pickup_or_dropoff character varying,
  address text,
  region_id integer,
  email_notifications boolean NOT NULL DEFAULT true,
  weekly_reminders boolean NOT NULL DEFAULT true,
  CONSTRAINT user_account_pkey PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS public.rebate (
  rebate_id integer NOT NULL DEFAULT nextval('rebate_rebate_id_seq'::regclass),
  account_id integer NOT NULL,
  compost_weight double precision,
  rebate_amount double precision,
  CONSTRAINT rebate_pkey PRIMARY KEY (rebate_id),
  CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES public.user_account(user_id)
);

CREATE TABLE IF NOT EXISTS public.pickup_time (
  time_id integer NOT NULL DEFAULT nextval('pickup_time_time_id_seq'::regclass),
  region_id integer NOT NULL,
  available_times character varying,
  CONSTRAINT pickup_time_pkey PRIMARY KEY (time_id)
);

CREATE TABLE IF NOT EXISTS public.dropoff_location (
  location_id integer NOT NULL DEFAULT nextval('dropoff_location_location_id_seq'::regclass),
  address text,
  route_time character varying,
  CONSTRAINT dropoff_location_pkey PRIMARY KEY (location_id)
);

CREATE TABLE IF NOT EXISTS public.compost_truck_driver (
  employee_id integer NOT NULL DEFAULT nextval('compost_truck_driver_employee_id_seq'::regclass),
  route_id character varying,
  route_time character varying,
  CONSTRAINT compost_truck_driver_pkey PRIMARY KEY (employee_id)
);
