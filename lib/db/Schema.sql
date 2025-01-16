-- Alter the id column to VARCHAR if it's not already
ALTER TABLE documents
ALTER COLUMN id TYPE VARCHAR(255);

-- If the id column doesn't exist, add it
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='documents' AND column_name='id') THEN
        ALTER TABLE documents ADD COLUMN id VARCHAR(255) PRIMARY KEY;
    END IF;
END $$;

-- Ensure other necessary columns exist
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS url TEXT,
ADD COLUMN IF NOT EXISTS size BIGINT,
ADD COLUMN IF NOT EXISTS mime_type VARCHAR(255),
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Update the existing rows to set a default value for the new columns if they're null
UPDATE documents 
SET url = COALESCE(url, ''), 
    size = COALESCE(size, 0), 
    mime_type = COALESCE(mime_type, 'application/octet-stream'),
    tags = COALESCE(tags, '[]'::jsonb);

-- Add a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_modtime
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

