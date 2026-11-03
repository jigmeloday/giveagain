-- The giver's phone for this item (E.164). Shown only to the seeker the giver accepts, never in public responses.
ALTER TABLE listing ADD COLUMN contact_phone text CHECK (contact_phone ~ '^\+[1-9][0-9]{6,14}$');
