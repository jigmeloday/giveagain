-- A stored photo can belong to only one listing.
ALTER TABLE listing_photo ADD CONSTRAINT listing_photo_key_unique UNIQUE (key);
