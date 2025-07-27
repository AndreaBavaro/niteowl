CREATE OR REPLACE FUNCTION public.get_user_id_by_phone(p_phone_number TEXT)
RETURNS TABLE(user_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT id FROM auth.users WHERE phone = p_phone_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
