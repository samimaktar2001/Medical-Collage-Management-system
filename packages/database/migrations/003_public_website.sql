ALTER TABLE content ADD COLUMN category text NOT NULL DEFAULT 'General';
ALTER TABLE content ADD COLUMN issue_date date;
ALTER TABLE content ADD COLUMN reference text NOT NULL DEFAULT '';
ALTER TABLE content ADD COLUMN available_on date;
ALTER TABLE content ADD COLUMN archive_on date;
ALTER TABLE content ADD COLUMN published_metadata jsonb NOT NULL DEFAULT '{}';
ALTER TABLE content ADD CONSTRAINT publication_dates CHECK (archive_on IS NULL OR available_on IS NULL OR archive_on > available_on);
CREATE TABLE demo_fixture_versions(name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX content_publication ON content(institution_id, language, kind, published_at);
