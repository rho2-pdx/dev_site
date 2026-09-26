-- CookeryData.sql assigns table ownership to role "Cook".
-- Create it before the dump runs so fresh volume init succeeds.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'Cook') THEN
    CREATE ROLE "Cook" NOLOGIN;
  END IF;
END
$$;
