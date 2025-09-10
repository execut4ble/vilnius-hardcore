-- Custom SQL migration file, put your code below! --

CREATE EXTENSION IF NOT EXISTS unaccent;

-- DROP FUNCTION public.slugify(text);

CREATE OR REPLACE FUNCTION public.slugify(value text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE STRICT
AS $function$
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
$function$
;

-- DROP FUNCTION public.set_slug_from_title();

CREATE OR REPLACE FUNCTION public.set_slug_from_title()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.set_post_slug()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;