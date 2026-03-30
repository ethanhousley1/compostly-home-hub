-- Compostly full database schema

-- Sequences
CREATE SEQUENCE IF NOT EXISTS compost_truck_driver_employee_id_seq;
CREATE SEQUENCE IF NOT EXISTS dropoff_location_location_id_seq;
CREATE SEQUENCE IF NOT EXISTS pickup_time_time_id_seq;
CREATE SEQUENCE IF NOT EXISTS rebate_rebate_id_seq;
CREATE SEQUENCE IF NOT EXISTS scheduled_pickup_pickup_id_seq;
CREATE SEQUENCE IF NOT EXISTS user_account_user_id_seq;

-- Tables (ordered for foreign-key dependencies)

CREATE TABLE IF NOT EXISTS public.user_account (
  user_id integer NOT NULL DEFAULT nextval('user_account_user_id_seq'::regclass),
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  pickup_or_dropoff character varying,
  street_address character varying(255),
  city character varying(100),
  state character varying(2),
  zip_code character varying(10),
  region_id integer,
  email_notifications boolean NOT NULL DEFAULT true,
  weekly_reminders boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
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

CREATE TABLE IF NOT EXISTS public.scheduled_pickup (
  pickup_id integer NOT NULL DEFAULT nextval('scheduled_pickup_pickup_id_seq'::regclass),
  account_id integer NOT NULL,
  pickup_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT scheduled_pickup_pkey PRIMARY KEY (pickup_id),
  CONSTRAINT scheduled_pickup_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.user_account(user_id) ON DELETE CASCADE,
  CONSTRAINT scheduled_pickup_account_id_pickup_date_key UNIQUE (account_id, pickup_date)
);

CREATE INDEX IF NOT EXISTS scheduled_pickup_account_id_pickup_date_idx
  ON public.scheduled_pickup (account_id, pickup_date);

ALTER TABLE public.scheduled_pickup DISABLE ROW LEVEL SECURITY;

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
