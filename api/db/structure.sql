SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ltree; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;


--
-- Name: EXTENSION ltree; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION ltree IS 'data type for hierarchical tree-like structures';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: game_result; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.game_result AS ENUM (
    'W',
    'B',
    'D'
);


--
-- Name: game_source; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.game_source AS ENUM (
    'pgnmentor',
    'chessbomb',
    'local'
);


--
-- Name: side; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.side AS ENUM (
    'W',
    'B'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: learned_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learned_items (
    id bigint NOT NULL,
    move_id uuid NOT NULL,
    level integer,
    next_review timestamp without time zone,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: learned_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.learned_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: learned_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.learned_items_id_seq OWNED BY public.learned_items.id;


--
-- Name: master_game_moves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_game_moves (
    id bigint NOT NULL,
    master_game_id uuid NOT NULL,
    ply integer NOT NULL,
    move character varying NOT NULL,
    fen character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    uci character varying
);


--
-- Name: master_game_moves_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.master_game_moves_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: master_game_moves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.master_game_moves_id_seq OWNED BY public.master_game_moves.id;


--
-- Name: master_games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.master_games (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    white character varying NOT NULL,
    black character varying NOT NULL,
    white_elo integer,
    black_elo integer,
    year integer,
    month integer,
    day integer,
    eco character varying,
    pgn text NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    movelist public.ltree NOT NULL,
    location character varying,
    white_fide_id character varying,
    white_title character varying,
    black_fide_id character varying,
    black_title character varying,
    event character varying,
    round character varying,
    source public.game_source NOT NULL,
    result public.game_result NOT NULL
);


--
-- Name: master_move_stats; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.master_move_stats AS
 SELECT tmp.fen,
    string_agg((((((((((tmp.move)::text || '|'::text) || tmp.white) || '|'::text) || tmp.draw) || '|'::text) || tmp.black) || '|'::text) || tmp.elo), ';'::text ORDER BY ((tmp.white + tmp.draw) + tmp.black) DESC) AS stats
   FROM ( WITH games AS (
                 SELECT m1.fen,
                    g.result,
                    g.white_elo,
                    g.black_elo,
                    m2.move
                   FROM ((public.master_games g
                     JOIN public.master_game_moves m1 ON ((m1.master_game_id = g.id)))
                     JOIN public.master_game_moves m2 ON (((m2.master_game_id = m1.master_game_id) AND (m2.ply = (m1.ply + 1)))))
                  WHERE (((m1.fen)::text <> 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -'::text) AND (g.white_elo >= 2000) AND (g.black_elo >= 2000))
                ), first_move AS (
                 SELECT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -'::text AS fen,
                    g.result,
                    g.white_elo,
                    g.black_elo,
                    m.move
                   FROM (public.master_games g
                     JOIN public.master_game_moves m ON ((m.master_game_id = g.id)))
                  WHERE ((m.ply = 1) AND (g.white_elo >= 2000) AND (g.black_elo >= 2000))
                )
         SELECT g.fen,
            g.move,
            sum(
                CASE
                    WHEN (g.result = 'W'::public.game_result) THEN 1
                    ELSE 0
                END) AS white,
            sum(
                CASE
                    WHEN (g.result = 'D'::public.game_result) THEN 1
                    ELSE 0
                END) AS draw,
            sum(
                CASE
                    WHEN (g.result = 'B'::public.game_result) THEN 1
                    ELSE 0
                END) AS black,
            round((avg((g.white_elo + g.black_elo)) / (2)::numeric)) AS elo
           FROM games g
          GROUP BY g.fen, g.move
        UNION ALL
         SELECT g.fen,
            g.move,
            sum(
                CASE
                    WHEN (g.result = 'W'::public.game_result) THEN 1
                    ELSE 0
                END) AS white,
            sum(
                CASE
                    WHEN (g.result = 'D'::public.game_result) THEN 1
                    ELSE 0
                END) AS draw,
            sum(
                CASE
                    WHEN (g.result = 'B'::public.game_result) THEN 1
                    ELSE 0
                END) AS black,
            round((avg((g.white_elo + g.black_elo)) / (2)::numeric)) AS elo
           FROM first_move g
          GROUP BY g.fen, g.move) tmp
  GROUP BY tmp.fen
  WITH NO DATA;


--
-- Name: moves; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.moves (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    move_number integer NOT NULL,
    move character varying NOT NULL,
    fen text NOT NULL,
    sort integer NOT NULL,
    repertoire_id bigint NOT NULL,
    parent_id uuid,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    uci character varying NOT NULL,
    transposition_id uuid
);


--
-- Name: repertoires; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repertoires (
    id bigint NOT NULL,
    name character varying NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    side public.side NOT NULL,
    slug character varying,
    public boolean DEFAULT false NOT NULL
);


--
-- Name: repertoires_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.repertoires_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: repertoires_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.repertoires_id_seq OWNED BY public.repertoires.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    learned_item_id bigint NOT NULL,
    incorrect_attempts integer,
    attempts integer,
    average_correct_time double precision,
    average_time double precision,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    uid text NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: learned_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learned_items ALTER COLUMN id SET DEFAULT nextval('public.learned_items_id_seq'::regclass);


--
-- Name: master_game_moves id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_game_moves ALTER COLUMN id SET DEFAULT nextval('public.master_game_moves_id_seq'::regclass);


--
-- Name: repertoires id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repertoires ALTER COLUMN id SET DEFAULT nextval('public.repertoires_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: learned_items learned_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learned_items
    ADD CONSTRAINT learned_items_pkey PRIMARY KEY (id);


--
-- Name: master_game_moves master_game_moves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_game_moves
    ADD CONSTRAINT master_game_moves_pkey PRIMARY KEY (id);


--
-- Name: master_games master_games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_games
    ADD CONSTRAINT master_games_pkey PRIMARY KEY (id);


--
-- Name: moves moves_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT moves_pkey PRIMARY KEY (id);


--
-- Name: repertoires repertoires_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repertoires
    ADD CONSTRAINT repertoires_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_learned_items_on_move_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_learned_items_on_move_id ON public.learned_items USING btree (move_id);


--
-- Name: index_master_game_moves_on_fen; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_master_game_moves_on_fen ON public.master_game_moves USING btree (fen);


--
-- Name: index_master_game_moves_on_master_game_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_master_game_moves_on_master_game_id ON public.master_game_moves USING btree (master_game_id);


--
-- Name: index_master_game_moves_on_master_game_id_and_ply; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_master_game_moves_on_master_game_id_and_ply ON public.master_game_moves USING btree (master_game_id, ply);


--
-- Name: index_master_game_moves_on_ply; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_master_game_moves_on_ply ON public.master_game_moves USING btree (ply);


--
-- Name: index_master_games_on_movelist; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_master_games_on_movelist ON public.master_games USING gist (movelist);


--
-- Name: index_moves_on_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_moves_on_parent_id ON public.moves USING btree (parent_id);


--
-- Name: index_moves_on_repertoire_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_moves_on_repertoire_id ON public.moves USING btree (repertoire_id);


--
-- Name: index_moves_on_repertoire_id_and_move_number_and_move_and_fen; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_moves_on_repertoire_id_and_move_number_and_move_and_fen ON public.moves USING btree (repertoire_id, move_number, move, fen);


--
-- Name: index_moves_on_transposition_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_moves_on_transposition_id ON public.moves USING btree (transposition_id);


--
-- Name: index_repertoires_on_side; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_repertoires_on_side ON public.repertoires USING btree (side);


--
-- Name: index_repertoires_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_repertoires_on_user_id ON public.repertoires USING btree (user_id);


--
-- Name: index_reviews_on_learned_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reviews_on_learned_item_id ON public.reviews USING btree (learned_item_id);


--
-- Name: master_move_stats_fen_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX master_move_stats_fen_idx ON public.master_move_stats USING btree (fen);


--
-- Name: moves fk_rails_0cd013e253; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT fk_rails_0cd013e253 FOREIGN KEY (repertoire_id) REFERENCES public.repertoires(id);


--
-- Name: moves fk_rails_1b0173efac; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT fk_rails_1b0173efac FOREIGN KEY (transposition_id) REFERENCES public.moves(id);


--
-- Name: moves fk_rails_691066c521; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.moves
    ADD CONSTRAINT fk_rails_691066c521 FOREIGN KEY (parent_id) REFERENCES public.moves(id);


--
-- Name: learned_items fk_rails_83075369c9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learned_items
    ADD CONSTRAINT fk_rails_83075369c9 FOREIGN KEY (move_id) REFERENCES public.moves(id);


--
-- Name: reviews fk_rails_9ac4395037; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_rails_9ac4395037 FOREIGN KEY (learned_item_id) REFERENCES public.learned_items(id);


--
-- Name: repertoires fk_rails_aba07fecfe; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repertoires
    ADD CONSTRAINT fk_rails_aba07fecfe FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: master_game_moves fk_rails_d9b9ed1ef5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.master_game_moves
    ADD CONSTRAINT fk_rails_d9b9ed1ef5 FOREIGN KEY (master_game_id) REFERENCES public.master_games(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20210910021153'),
('20210910021455'),
('20210910021846'),
('20210910022439'),
('20210910022810'),
('20210910023640'),
('20210916115916'),
('20210920052850'),
('20210920065906'),
('20210920070006'),
('20210921070931'),
('20210921072020'),
('20210921090900'),
('20210921091417'),
('20210924131214'),
('20210926214728'),
('20210927165630'),
('20210927165847'),
('20210930030817'),
('20210930032500'),
('20211005020253'),
('20211005044359'),
('20211009104139'),
('20211009110026'),
('20211009120101'),
('20211012085511');


