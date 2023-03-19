-- -------------------------------------------------------------
-- TablePlus 5.3.4(492)
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2023-03-19 19:39:41.0530
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."dossier_types";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS dossier_types_id_seq;

-- Table Definition
CREATE TABLE "public"."dossier_types" (
    "id" int4 NOT NULL DEFAULT nextval('dossier_types_id_seq'::regclass),
    "naam" varchar,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."dossiers";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS untitled_table_204_id_seq;

-- Table Definition
CREATE TABLE "public"."dossiers" (
    "id" int4 NOT NULL DEFAULT nextval('untitled_table_204_id_seq'::regclass),
    "Client" varchar,
    "Beheerder" varchar,
    "Type" varchar,
    "Verloop start" date,
    "Verloop stop" date,
    "Bestandslocatie" varchar,
    "Meer info" text,
    "Tijdlijn" varchar,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."users";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "username" varchar NOT NULL,
    "mail" varchar NOT NULL,
    "salt" varchar NOT NULL,
    "secondSalt" varchar NOT NULL,
    "password" varchar NOT NULL,
    "role" varchar NOT NULL
);

INSERT INTO "public"."dossier_types" ("id", "naam") VALUES
(4, 'Uithuiszetting/dakloosheid/referentieadres'),
(85, 'Huurwaarborg'),
(86, 'Leefloon'),
(87, 'Equivalent leefloon'),
(88, 'Andere financiële steun'),
(89, 'MMC'),
(90, 'LAC'),
(91, 'Budgetbeheer'),
(92, 'Ten laste name begrafeniskosten'),
(93, 'Ten laste name rustoord'),
(94, 'Materiële steun'),
(95, 'Aanvraag Parkeerkaarten'),
(96, 'Sociale culturele toelage'),
(97, 'Creg'),
(98, 'Aanvraag incontinentiemateriaal'),
(99, 'Aanvraag mantelzorg'),
(100, 'Aanvraag verwarmingstoelage'),
(101, 'Crisisopvang');

INSERT INTO "public"."dossiers" ("id", "Client", "Beheerder", "Type", "Verloop start", "Verloop stop", "Bestandslocatie", "Meer info", "Tijdlijn") VALUES
(1, '{"naam":"Lia Snoww","adres":"Savooistraat 89B","postcode":"9600","stad":"Maarkedal","land":"België","phone":"055 21 85 00","mail":"miguel.depelsmaeker@maarkedal.be"}', 'Miguel De Pelsmaeker', '{"Financieel":[{"ongoing":true,"startDatum":"1672527600000","eindDatum":"1672527600000","opmerkingen":"Proin nibh mauris, aliquet quis aliquam eget, gravida id tellus. Aenean vulputate"},{"ongoing":true,"startDatum":"1672527600000","eindDatum":"1672527600000"}],"Beleid":[{"ongoing":true,"startDatum":"1672527600000","eindDatum":"1672527600000","opmerkingen":"Proin nibh mauris, aliquet quis aliquam eget, gravida id tellus. Aenean vulputate"}]}', NULL, NULL, '/Users/migueldepelsmaeker/Documents/Code/Webdevelopment', 'Nulla tellus eros, interdum in leo non, cursus luctus lacus. Vivamus accumsan consectetur massa, non commodo lectus ultrices nec. Donec vel turpis in lectus tincidunt venenatis ac ultrices justo. Integer ligula ante, egestas nec ante sed, posuere convallis turpis. Praesent consectetur sapien nec mauris fringilla, sit amet tristique felis porttitor. Cras pretium diam nec molestie aliquet. Aliquam erat volutpat. Aliquam faucibus ipsum mi, at lobortis arcu rutrum nec. Integer maximus libero interdum cursus scelerisque. Cras in lorem elementum dui tempus auctor a ac nunc', '[{"datum":"1672527600000","beschrijving":"Dit is een eerste test voor de tijdslijn","tooltip":"Een tooltip test"},{"datum":"1672527600000","beschrijving":"Dit is een tweede test voor de tijdslijn","tooltip":"Een tooltip test 2"}]'),
(2, '{"naam":"Renee de Bakker","adres":"Savooistraat 89B","postcode":"9600","stad":"Maarkedal","land":"België","phone":"055 21 85 00","mail":"miguel.depelsmaeker@maarkedal.be"}', 'Sophie Van Aelst', '{"Financieel":[{"ongoing":true,"startDatum":"1672527600000","eindDatum":"1672527600000"},{"ongoing":true,"startDatum":"1672527600000","eindDatum":"1672527600000","opmerkingen":"Proin nibh mauris, aliquet quis aliquam eget, gravida id tellus. Aenean vulputate"}],"Beleid":[{"ongoing":true,"startDatum":"1672527600000","eindDatum":"1672527600000","opmerkingen":"Proin nibh mauris, aliquet quis aliquam eget, gravida id tellus. Aenean vulputate"}],"Huurwaarborg":[{"startDatum":1677628800000,"eindDatum":1678924800000,"opmerkingen":""},{"startDatum":1680048000000,"eindDatum":1682640000000,"opmerkingen":""}],"LAC":[{"startDatum":1678924800000,"eindDatum":1679616000000,"opmerkingen":""}]}', NULL, NULL, '', 'dwadawdawdaw', '[{"datum":"1672527600000","beschrijving":"dawdadaw","tooltip":"dawdadaw"}]'),
(4, '{"naam":"Lia Snoww","adres":"Savooistraat 89B","postcode":"9600","stad":"Maarkedal","land":"België","phone":"055 21 85 00","mail":"miguel.depelsmaeker@maarkedal.be"}', 'Miguel De Pelsmaeker', '{"Financieel":[{"ongoing":true,"startDatum":"1672527600000","eindDatum":"1672527600000","opmerkingen":"Proin nibh mauris, aliquet quis aliquam eget, gravida id tellus. Aenean vulputate"},{"ongoing":true,"startDatum":"1672527600000","eindDatum":"1672527600000"}],"Beleid":[{"ongoing":true,"startDatum":"1672527600000","eindDatum":"1672527600000","opmerkingen":"Proin nibh mauris, aliquet quis aliquam eget, gravida id tellus. Aenean vulputate"}]}', NULL, NULL, '/Users/migueldepelsmaeker/Documents/Code/Webdevelopment', 'Nulla tellus eros, interdum in leo non, cursus luctus lacus. Vivamus accumsan consectetur massa, non commodo lectus ultrices nec. Donec vel turpis in lectus tincidunt venenatis ac ultrices justo. Integer ligula ante, egestas nec ante sed, posuere convallis turpis. Praesent consectetur sapien nec mauris fringilla, sit amet tristique felis porttitor. Cras pretium diam nec molestie aliquet. Aliquam erat volutpat. Aliquam faucibus ipsum mi, at lobortis arcu rutrum nec. Integer maximus libero interdum cursus scelerisque. Cras in lorem elementum dui tempus auctor a ac nunc', '[{"datum":"1672527600000","beschrijving":"Dit is een eerste test voor de tijdslijn","tooltip":"Een tooltip test"},{"datum":"1672527600000","beschrijving":"Dit is een tweede test voor de tijdslijn","tooltip":"Een tooltip test 2"}]');

INSERT INTO "public"."users" ("id", "username", "mail", "salt", "secondSalt", "password", "role") VALUES
(2, 'adwadaw', 'adawdaw', '26178cf6-f0f4-4413-9b08-f74e2a7a72e1', '6', '{"words":[1362499076,-840689869,-1743597814,-1699935451,770439741,469498225,911234601,-1647517112],"sigBytes":32}', 'admin'),
(12, 'a', 'adwa', '6656510e-615c-444c-8411-8fc43b315f4e', '28', '{"words":[-1081328050,-164704872,-2064234137,-888066625,-198396809,-135595044,65334491,1097579510],"sigBytes":32}', 'user'),
(14, 'a', 'adwaa', '6656510e-615c-444c-8411-8fc43b315f4e', '34', '{"words":[1301144199,1784312420,-2058402009,-1364812368,622415026,1176216058,1700106444,1636138362],"sigBytes":32}', 'user'),
(1, 'aba', 'a', '1d587fd4-dccd-4857-8a66-8e8bba084f3c', '22', '{"words":[1046914819,-1717951582,222811558,-578414268,-2106882379,1813632175,351144765,-473264077],"sigBytes":32}', 'admin');

