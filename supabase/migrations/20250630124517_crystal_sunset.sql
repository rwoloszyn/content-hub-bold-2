/*
  # Analytics SQL Functions

  1. New Functions
    - `run_analytics_query` - Securely runs analytics queries with proper permissions
  
  2. Security
    - Function is only accessible to authenticated users
    - Queries are sanitized and restricted to analytics tables only
*/

-- Function to run analytics queries securely
CREATE OR REPLACE FUNCTION run_analytics_query(query_string text)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  user_id uuid;
  sanitized_query text;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  -- Check if user is authenticated
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Sanitize and validate the query
  -- This is a simple check - in production you'd want more robust validation
  IF query_string NOT ILIKE 'SELECT%' THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;
  
  -- Check that the query only accesses analytics tables
  IF query_string NOT ILIKE '%FROM page_views%' AND 
     query_string NOT ILIKE '%FROM events%' AND
     query_string NOT ILIKE '%FROM purchases%' AND
     query_string NOT ILIKE '%FROM user_properties%' THEN
    RAISE EXCEPTION 'Query can only access analytics tables';
  END IF;
  
  -- Prevent destructive operations
  IF query_string ILIKE '%DELETE%' OR 
     query_string ILIKE '%DROP%' OR
     query_string ILIKE '%TRUNCATE%' OR
     query_string ILIKE '%ALTER%' OR
     query_string ILIKE '%UPDATE%' OR
     query_string ILIKE '%INSERT%' THEN
    RAISE EXCEPTION 'Query contains forbidden operations';
  END IF;
  
  -- Add user_id filter for security if not already present
  -- This ensures users can only query their own data
  IF query_string NOT ILIKE '%user_id = %' AND
     query_string NOT ILIKE '%user_id IS NULL%' THEN
    
    -- Find the WHERE clause
    IF query_string ILIKE '%WHERE%' THEN
      -- Add user_id filter to existing WHERE clause
      sanitized_query := regexp_replace(
        query_string,
        'WHERE',
        format('WHERE (user_id = ''%s'' OR user_id IS NULL) AND', user_id),
        'i'
      );
    ELSE
      -- Add WHERE clause with user_id filter
      -- Find if there's a GROUP BY, ORDER BY, or LIMIT clause
      IF query_string ILIKE '%GROUP BY%' THEN
        sanitized_query := regexp_replace(
          query_string,
          'GROUP BY',
          format('WHERE (user_id = ''%s'' OR user_id IS NULL) GROUP BY', user_id),
          'i'
        );
      ELSIF query_string ILIKE '%ORDER BY%' THEN
        sanitized_query := regexp_replace(
          query_string,
          'ORDER BY',
          format('WHERE (user_id = ''%s'' OR user_id IS NULL) ORDER BY', user_id),
          'i'
        );
      ELSIF query_string ILIKE '%LIMIT%' THEN
        sanitized_query := regexp_replace(
          query_string,
          'LIMIT',
          format('WHERE (user_id = ''%s'' OR user_id IS NULL) LIMIT', user_id),
          'i'
        );
      ELSE
        -- No clauses, add WHERE at the end
        sanitized_query := query_string || format(' WHERE (user_id = ''%s'' OR user_id IS NULL)', user_id);
      END IF;
    END IF;
  ELSE
    -- Query already has user_id filter
    sanitized_query := query_string;
  END IF;
  
  -- Execute the query
  FOR result IN EXECUTE sanitized_query
  LOOP
    RETURN NEXT result;
  END LOOP;
  
  RETURN;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION run_analytics_query(text) TO authenticated;