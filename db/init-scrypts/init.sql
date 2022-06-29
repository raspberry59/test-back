CREATE SCHEMA IF NOT EXISTS public;

DROP TABLE IF EXISTS public.items;
CREATE TABLE public.items (
  id BigInt GENERATED ALWAYS AS IDENTITY (START 1),
  name Text NOT NULL,
  description Text,
  manufacturer Text
);

DROP TABLE IF EXISTS public.groups;
CREATE TABLE public.groups (
  id BigInt GENERATED ALWAYS AS IDENTITY (START 1),
  parent_id BigInt,
  name Text NOT NULL
);

DROP TABLE IF EXISTS public.items_groups;
CREATE TABLE public.items_groups (
  item_id BigInt NOT NULL,
  group_id BigInt NOT NULL
);

INSERT INTO public.groups (name, parent_id) VALUES
  ('ЖКТ', null),
  ('ССД', null),
  ('ОРВИ', null)
;
INSERT INTO public.groups (name, parent_id) VALUES
  ('Язва', (SELECT id from public.groups WHERE name = 'ЖКТ'))
;

INSERT INTO public.items (name, description, manufacturer) VALUES
  ('Но-шпа', 'Таблетки от спазмов и боли в животе', 'СаФарм'),
  ('Терафлю', null, 'Отисифарм'),
  ('Валокордин', 'Если болит сердечко', null),
  ('Дротаверин', null, null)
;

INSERT INTO public.items_groups
  SELECT i.id AS item_id, g.id AS group_id
  FROM public.items AS i
  JOIN public.groups AS g ON
    (i.name IN ('Но-шпа', 'Дротаверин') AND g.name = 'Язва')
    OR (i.name = 'Терафлю' AND g.name = 'ОРВИ')
    OR (i.name = 'Валокордин' AND g.name = 'ССД')
;
