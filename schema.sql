--
-- PostgreSQL database dump
--

\restrict 3YvbQqNINg9MVjk6Rv7v6B1ReNwGnC7ce6ej99wvXUZvq3FSu9twHIEgKdmZTZd

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_years (
    year_id integer NOT NULL,
    label character varying(9) NOT NULL
);


ALTER TABLE public.academic_years OWNER TO postgres;

--
-- Name: academic_years_year_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.academic_years_year_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_years_year_id_seq OWNER TO postgres;

--
-- Name: academic_years_year_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.academic_years_year_id_seq OWNED BY public.academic_years.year_id;


--
-- Name: formulas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formulas (
    formula_id integer NOT NULL,
    module_type text,
    formula text
);


ALTER TABLE public.formulas OWNER TO postgres;

--
-- Name: formulas_formula_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.formulas_formula_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.formulas_formula_id_seq OWNER TO postgres;

--
-- Name: formulas_formula_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.formulas_formula_id_seq OWNED BY public.formulas.formula_id;


--
-- Name: module_offerings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.module_offerings (
    offering_id integer NOT NULL,
    module_id integer NOT NULL,
    year_id integer NOT NULL,
    estimated_number_students integer,
    alpha numeric(6,2),
    beta numeric(6,2),
    crit numeric(3,1),
    credits integer,
    h numeric(3,1),
    CONSTRAINT module_offerings_estimated_number_students_check CHECK ((estimated_number_students >= 0))
);


ALTER TABLE public.module_offerings OWNER TO postgres;

--
-- Name: module_offerings_offering_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.module_offerings_offering_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.module_offerings_offering_id_seq OWNER TO postgres;

--
-- Name: module_offerings_offering_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.module_offerings_offering_id_seq OWNED BY public.module_offerings.offering_id;


--
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    module_id integer NOT NULL,
    code character varying(20) NOT NULL,
    module_type character varying(30) NOT NULL,
    name character varying(150) NOT NULL,
    individual boolean,
    CONSTRAINT modules_module_type_check CHECK (((module_type)::text = ANY ((ARRAY['teaching'::character varying, 'admin'::character varying, 'supervision_marking'::character varying])::text[])))
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- Name: modules_module_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modules_module_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modules_module_id_seq OWNER TO postgres;

--
-- Name: modules_module_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modules_module_id_seq OWNED BY public.modules.module_id;


--
-- Name: staff_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff_assignments (
    assignment_id integer NOT NULL,
    user_id integer CONSTRAINT staff_assignments_staff_id_not_null NOT NULL,
    offering_id integer NOT NULL,
    delta numeric(6,2),
    share numeric(5,2),
    coordinator integer DEFAULT 0,
    custom_formula text,
    students integer
);


ALTER TABLE public.staff_assignments OWNER TO postgres;

--
-- Name: staff_assignments_assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_assignments_assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_assignments_assignment_id_seq OWNER TO postgres;

--
-- Name: staff_assignments_assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_assignments_assignment_id_seq OWNED BY public.staff_assignments.assignment_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    role character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    time_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    contract_type text,
    contract_hours numeric,
    active boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: academic_years year_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_years ALTER COLUMN year_id SET DEFAULT nextval('public.academic_years_year_id_seq'::regclass);


--
-- Name: formulas formula_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formulas ALTER COLUMN formula_id SET DEFAULT nextval('public.formulas_formula_id_seq'::regclass);


--
-- Name: module_offerings offering_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_offerings ALTER COLUMN offering_id SET DEFAULT nextval('public.module_offerings_offering_id_seq'::regclass);


--
-- Name: modules module_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules ALTER COLUMN module_id SET DEFAULT nextval('public.modules_module_id_seq'::regclass);


--
-- Name: staff_assignments assignment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_assignments ALTER COLUMN assignment_id SET DEFAULT nextval('public.staff_assignments_assignment_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: academic_years academic_years_label_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_label_key UNIQUE (label);


--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (year_id);


--
-- Name: formulas formulas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formulas
    ADD CONSTRAINT formulas_pkey PRIMARY KEY (formula_id);


--
-- Name: module_offerings module_offerings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_offerings
    ADD CONSTRAINT module_offerings_pkey PRIMARY KEY (offering_id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (module_id);


--
-- Name: staff_assignments staff_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_assignments
    ADD CONSTRAINT staff_assignments_pkey PRIMARY KEY (assignment_id);


--
-- Name: module_offerings unique_module_year; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_offerings
    ADD CONSTRAINT unique_module_year UNIQUE (module_id, year_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: module_offerings fk_module; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_offerings
    ADD CONSTRAINT fk_module FOREIGN KEY (module_id) REFERENCES public.modules(module_id) ON DELETE CASCADE;


--
-- Name: staff_assignments fk_offering; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_assignments
    ADD CONSTRAINT fk_offering FOREIGN KEY (offering_id) REFERENCES public.module_offerings(offering_id) ON DELETE CASCADE;


--
-- Name: staff_assignments fk_staff; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff_assignments
    ADD CONSTRAINT fk_staff FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: module_offerings fk_year; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module_offerings
    ADD CONSTRAINT fk_year FOREIGN KEY (year_id) REFERENCES public.academic_years(year_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 3YvbQqNINg9MVjk6Rv7v6B1ReNwGnC7ce6ej99wvXUZvq3FSu9twHIEgKdmZTZd

