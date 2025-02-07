CREATE TRIGGER set_slug_from_title
BEFORE INSERT OR UPDATE
ON "event"
FOR EACH ROW
EXECUTE FUNCTION public.set_slug_from_title();

CREATE TRIGGER set_slug_from_title
BEFORE INSERT OR UPDATE
ON "post"
FOR EACH ROW
EXECUTE FUNCTION public.set_post_slug();