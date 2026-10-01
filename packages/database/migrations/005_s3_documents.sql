ALTER TABLE documents ADD COLUMN IF NOT EXISTS s3_key text;

UPDATE documents SET s3_key = id WHERE s3_key IS NULL;

ALTER TABLE documents ALTER COLUMN s3_key SET NOT NULL;
ALTER TABLE documents DROP COLUMN IF EXISTS content_base64;
