-- Core tables. Auth tables come from the previous migration (Better Auth).
-- Allowed values mirror constants/listing.ts and constants/location.ts. Keep them in sync.

CREATE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

CREATE TABLE listing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL REFERENCES "user" (id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 80),
  description text NOT NULL CHECK (char_length(description) BETWEEN 10 AND 500),
  category text NOT NULL CHECK (category IN ('Furniture', 'Books', 'Kitchen', 'Clothing', 'Kids', 'Electronics', 'Other')),
  condition text NOT NULL CHECK (condition IN ('Like new', 'Good', 'Fair')),
  dzongkhag text NOT NULL CHECK (dzongkhag IN ('Bumthang', 'Chhukha', 'Dagana', 'Gasa', 'Haa', 'Lhuentse', 'Mongar', 'Paro', 'Pemagatshel', 'Punakha', 'Samdrup Jongkhar', 'Samtse', 'Sarpang', 'Thimphu', 'Trashigang', 'Trashiyangtse', 'Trongsa', 'Tsirang', 'Wangdue Phodrang', 'Zhemgang')),
  area text NOT NULL CHECK (char_length(area) BETWEEN 2 AND 60),
  size text CHECK (char_length(size) <= 60),
  collection text CHECK (char_length(collection) <= 80),
  heads_up text CHECK (char_length(heads_up) <= 80),
  -- Exact address. Never part of a public response; shared only with the accepted seeker.
  address_private text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'reserved', 'given', 'rejected', 'withdrawn')),
  rejection_reason text CHECK (rejection_reason IN ('prohibited_item', 'selling_or_price', 'unclear_photos', 'not_enough_detail', 'unsafe_item', 'other')),
  rejection_note text CHECK (char_length(rejection_note) <= 300),
  moderated_by text REFERENCES "user" (id) ON DELETE RESTRICT,
  moderated_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rejected_has_reason CHECK (status <> 'rejected' OR rejection_reason IS NOT NULL)
);

CREATE INDEX listing_browse_idx ON listing (created_at DESC, id) WHERE status IN ('available', 'reserved') AND deleted_at IS NULL;
CREATE INDEX listing_pending_idx ON listing (created_at, id) WHERE status = 'pending' AND deleted_at IS NULL;
CREATE INDEX listing_dzongkhag_idx ON listing (dzongkhag, status);
CREATE INDEX listing_category_idx ON listing (category, status);
CREATE INDEX listing_owner_idx ON listing (owner_id);
CREATE TRIGGER listing_updated_at BEFORE UPDATE ON listing FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE listing_photo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listing (id) ON DELETE CASCADE,
  key text NOT NULL,
  position smallint NOT NULL CHECK (position BETWEEN 0 AND 5),
  width integer CHECK (width > 0),
  height integer CHECK (height > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (listing_id, position)
);

CREATE TRIGGER listing_photo_updated_at BEFORE UPDATE ON listing_photo FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE booking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listing (id) ON DELETE RESTRICT,
  requester_id text NOT NULL REFERENCES "user" (id) ON DELETE RESTRICT,
  phone text NOT NULL CHECK (phone ~ '^\+[1-9][0-9]{6,14}$'),
  note text CHECK (char_length(note) <= 300),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX booking_one_active_per_user_idx ON booking (listing_id, requester_id) WHERE status <> 'cancelled';
CREATE UNIQUE INDEX booking_one_accepted_idx ON booking (listing_id) WHERE status = 'accepted';
CREATE INDEX booking_listing_idx ON booking (listing_id);
CREATE INDEX booking_requester_idx ON booking (requester_id);
CREATE TRIGGER booking_updated_at BEFORE UPDATE ON booking FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE report (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id text NOT NULL REFERENCES "user" (id) ON DELETE RESTRICT,
  target_type text NOT NULL CHECK (target_type IN ('listing', 'user')),
  target_id text NOT NULL,
  reason text NOT NULL CHECK (reason IN ('prohibited_item', 'selling_or_price', 'fake_or_misleading', 'inappropriate_photo', 'scam_or_unsafe', 'no_show_or_harassment', 'other')),
  details text CHECK (char_length(details) <= 500),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'actioned', 'dismissed')),
  resolved_by text REFERENCES "user" (id) ON DELETE RESTRICT,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reporter_id, target_type, target_id)
);

CREATE INDEX report_status_idx ON report (status, created_at);
CREATE INDEX report_target_idx ON report (target_type, target_id);
CREATE TRIGGER report_updated_at BEFORE UPDATE ON report FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Append-only record of admin actions.
CREATE TABLE audit_log (
  id bigserial PRIMARY KEY,
  actor_id text NOT NULL REFERENCES "user" (id) ON DELETE RESTRICT,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  reason text,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_log_target_idx ON audit_log (target_type, target_id, created_at DESC);
CREATE INDEX audit_log_created_idx ON audit_log (created_at DESC);

CREATE FUNCTION audit_log_is_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only';
END $$;

CREATE TRIGGER audit_log_no_change BEFORE UPDATE OR DELETE ON audit_log FOR EACH ROW EXECUTE FUNCTION audit_log_is_append_only();
