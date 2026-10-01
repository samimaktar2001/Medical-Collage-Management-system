CREATE TABLE IF NOT EXISTS settings (
    id text PRIMARY KEY,
    institution_id text NOT NULL REFERENCES institutions(id),
    category text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by text REFERENCES users(id),
    UNIQUE(institution_id, key)
);

-- Seed some default settings for institution 'inst-1' (assuming default medical college)
INSERT INTO settings (id, institution_id, category, key, value) VALUES
('set-1', 'inst-1', 'branding', 'logo_url', '/images/logo-placeholder.png'),
('set-2', 'inst-1', 'branding', 'college_name', 'MedicaCare'),
('set-3', 'inst-1', 'branding', 'college_subtitle', 'Medical College & Research Hospital'),
('set-4', 'inst-1', 'branding', 'top_bar_text', 'NMC Recognized • NAAC A+ University • NABH Teaching Hospital'),
('set-5', 'inst-1', 'contact', 'emergency_phone', '1066 / +91-11-22334455'),
('set-6', 'inst-1', 'contact', 'admissions_email', 'admissions@medcol.edu.in'),
('set-7', 'inst-1', 'contact', 'address', 'Health City Campus, Green Valley, Kolkata, WB 700032'),
('set-8', 'inst-1', 'hero', 'heading', 'Pioneering the Future of Healthcare & Medical Education'),
('set-9', 'inst-1', 'hero', 'sub_heading', 'Join India''s premier NAAC A+ accredited institution dedicated to developing compassionate healthcare leaders, advancing clinical research, and providing world-class tertiary care.'),
('set-10', 'inst-1', 'hero', 'background_image', '/images/campus-hero.jpg')
ON CONFLICT (institution_id, key) DO NOTHING;
