--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

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

--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: set_post_slug(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.set_post_slug() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Generate the initial slug based on the 'title' field
    base_slug := slugify(NEW.title);
    final_slug := base_slug;

    -- Loop to ensure uniqueness of the slug
    LOOP
        -- Check if the slug already exists in the table
        IF EXISTS (SELECT 1 FROM "post" WHERE slug = final_slug AND id != COALESCE(NEW.id, 0)) THEN
            -- If it exists, append a numeric suffix and increment the counter
            final_slug := base_slug || '-' || counter;
            counter := counter + 1;
        ELSE
            -- If it's unique, exit the loop
            EXIT;
        END IF;
    END LOOP;

    -- Set the unique slug to the 'slug' field of the NEW record
    NEW.slug := final_slug;
    RETURN NEW;
END
$$;


ALTER FUNCTION public.set_post_slug() OWNER TO root;

--
-- Name: set_slug_from_title(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.set_slug_from_title() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Generate the initial slug based on the 'title' field
    base_slug := slugify(NEW.title);
    final_slug := base_slug;

    -- Loop to ensure uniqueness of the slug
    LOOP
        -- Check if the slug already exists in the table
        IF EXISTS (SELECT 1 FROM "event" WHERE slug = final_slug AND id != COALESCE(NEW.id, 0)) THEN
            -- If it exists, append a numeric suffix and increment the counter
            final_slug := base_slug || '-' || counter;
            counter := counter + 1;
        ELSE
            -- If it's unique, exit the loop
            EXIT;
        END IF;
    END LOOP;

    -- Set the unique slug to the 'slug' field of the NEW record
    NEW.slug := final_slug;
    RETURN NEW;
END
$$;


ALTER FUNCTION public.set_slug_from_title() OWNER TO root;

--
-- Name: slugify(text); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.slugify(value text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $_$
BEGIN
  -- Generate the slug
  RETURN COALESCE(
    NULLIF(
      regexp_replace(
        regexp_replace(
          lower(unaccent(value)), -- Lowercase and remove accents
          '[^a-z0-9_-]+', '-', 'gi' -- Replace non-alphanumeric characters with hyphens
        ),
        '(^-+|-+$)', '', 'g' -- Remove leading and trailing hyphens
      ),
      '' -- Convert empty string to NULL
    ),
    '-' -- Default to '-' if slug is empty
  );
END
$_$;


ALTER FUNCTION public.slugify(value text) OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    event_id integer,
    post_id integer,
    author text NOT NULL,
    date timestamp with time zone DEFAULT now() NOT NULL,
    content text NOT NULL
);


ALTER TABLE public.comment OWNER TO root;

--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_id_seq OWNER TO root;

--
-- Name: comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;


--
-- Name: event; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.event (
    id integer NOT NULL,
    title text NOT NULL,
    date timestamp without time zone NOT NULL,
    description text,
    slug text,
    image text,
    is_visible boolean DEFAULT true NOT NULL
);


ALTER TABLE public.event OWNER TO root;

--
-- Name: event_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_id_seq OWNER TO root;

--
-- Name: event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.event_id_seq OWNED BY public.event.id;


--
-- Name: post; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.post (
    id integer NOT NULL,
    user_id text,
    author_name text,
    title text NOT NULL,
    date timestamp with time zone DEFAULT now() NOT NULL,
    body text NOT NULL,
    slug text,
    image text
);


ALTER TABLE public.post OWNER TO root;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_id_seq OWNER TO root;

--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.session (
    id text NOT NULL,
    user_id text NOT NULL,
    expires_at timestamp with time zone NOT NULL
);


ALTER TABLE public.session OWNER TO root;

--
-- Name: user; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."user" (
    id text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL
);


ALTER TABLE public."user" OWNER TO root;

--
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);


--
-- Name: event id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.event ALTER COLUMN id SET DEFAULT nextval('public.event_id_seq'::regclass);


--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.comment (id, event_id, post_id, author, date, content) FROM stdin;
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.event (id, title, date, description, slug, image, is_visible) FROM stdin;
2	Test future event	9999-01-01 12:34:00	This event is in the future	test-future-event		t
3	Test past event	2007-11-20 20:00:00	Zhiurkės [vno]\nAnarres [kns]\nNagasaki Nightmare [it]	test-past-event		t
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.post (id, user_id, author_name, title, date, body, slug, image) FROM stdin;
1	wrzxjrwvl55o6jpykdohdrpo	\N	Test blog post	2025-06-27 05:50:44.913198+00	Hello!	test-blog-post	\N
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.session (id, user_id, expires_at) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."user" (id, username, password_hash) FROM stdin;
wrzxjrwvl55o6jpykdohdrpo	playwright	$argon2id$v=19$m=19456,t=2,p=1$lZ+gElMLcXA6k6F14aos4w$KHIPlutnO/cLG68vmomJIOR9YN+teEEaeWvpXwxEMAc
\.


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.comment_id_seq', 1, true);


--
-- Name: event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.event_id_seq', 4, true);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.post_id_seq', 1, true);


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user user_username_unique; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_unique UNIQUE (username);


--
-- Name: event set_slug_from_title_event; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER set_slug_from_title_event BEFORE INSERT OR UPDATE ON public.event FOR EACH ROW EXECUTE FUNCTION public.set_slug_from_title();


--
-- Name: post set_slug_from_title_post; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER set_slug_from_title_post BEFORE INSERT OR UPDATE ON public.post FOR EACH ROW EXECUTE FUNCTION public.set_post_slug();


--
-- Name: comment comment_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id) ON DELETE CASCADE;


--
-- Name: comment comment_post_id_post_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_post_id_post_id_fk FOREIGN KEY (post_id) REFERENCES public.post(id) ON DELETE CASCADE;


--
-- Name: post post_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: session session_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

