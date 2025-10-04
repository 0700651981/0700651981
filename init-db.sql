-- AfyaLink Database Initialization Script
-- This script creates all the required databases for the AfyaLink healthcare system

-- Create databases
CREATE DATABASE IF NOT EXISTS afyalink_auth;
CREATE DATABASE IF NOT EXISTS afyalink_patients;
CREATE DATABASE IF NOT EXISTS afyalink_referrals;
CREATE DATABASE IF NOT EXISTS afyalink_facilities;
CREATE DATABASE IF NOT EXISTS afyalink_messaging;
CREATE DATABASE IF NOT EXISTS afyalink_audit;

-- Grant permissions (adjust as needed for your setup)
GRANT ALL PRIVILEGES ON DATABASE afyalink_auth TO postgres;
GRANT ALL PRIVILEGES ON DATABASE afyalink_patients TO postgres;
GRANT ALL PRIVILEGES ON DATABASE afyalink_referrals TO postgres;
GRANT ALL PRIVILEGES ON DATABASE afyalink_facilities TO postgres;
GRANT ALL PRIVILEGES ON DATABASE afyalink_messaging TO postgres;
GRANT ALL PRIVILEGES ON DATABASE afyalink_audit TO postgres;

-- Switch to auth database and create tables
\c afyalink_auth;

-- Users table for authentication service
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table for JWT tokens
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Switch to patients database and create tables
\c afyalink_patients;

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    record_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    record_date DATE NOT NULL,
    doctor_name VARCHAR(255),
    department VARCHAR(100),
    attachments TEXT[], -- Array of file paths
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consents table
CREATE TABLE IF NOT EXISTS consents (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    consent_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    granted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Switch to referrals database and create tables
\c afyalink_referrals;

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    referring_doctor VARCHAR(255) NOT NULL,
    referred_to_doctor VARCHAR(255) NOT NULL,
    referred_to_facility VARCHAR(255),
    reason TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'pending',
    referral_date DATE NOT NULL,
    appointment_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Switch to facilities database and create tables
\c afyalink_facilities;

-- Facilities table
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    services TEXT, -- Comma-separated list
    rating DECIMAL(2, 1) DEFAULT 0.0,
    capacity INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Switch to messaging database and create tables
\c afyalink_messaging;

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'direct',
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'sent',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    participant_ids INTEGER[] NOT NULL,
    last_message_id INTEGER REFERENCES messages(id),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Switch to audit database and create tables
\c afyalink_audit;

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    method VARCHAR(10),
    path TEXT,
    ip_address INET,
    user_agent TEXT,
    status_code INTEGER,
    duration BIGINT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_patients_last_name ON patients(last_name);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_referrals_patient_id ON referrals(patient_id);
CREATE INDEX IF NOT EXISTS idx_facilities_name ON facilities(name);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities(type);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Insert some sample data for testing
\c afyalink_auth;
INSERT INTO users (name, email, password, role, department, status) VALUES
('Admin User', 'admin@afyalink.com', 'admin123', 'admin', 'Administration', 'active'),
('Dr. Sarah Johnson', 'sarah.johnson@afyalink.com', 'doctor123', 'doctor', 'Internal Medicine', 'active'),
('Nurse Jane Smith', 'jane.smith@afyalink.com', 'nurse123', 'nurse', 'Emergency', 'active')
ON CONFLICT (email) DO NOTHING;

\c afyalink_patients;
INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address) VALUES
('John', 'Doe', '1985-06-15', 'Male', '+1234567890', 'john.doe@email.com', '123 Main St, City, State 12345'),
('Jane', 'Smith', '1990-03-22', 'Female', '+1987654321', 'jane.smith@email.com', '456 Oak Ave, City, State 67890')
ON CONFLICT DO NOTHING;

\c afyalink_facilities;
INSERT INTO facilities (name, type, address, city, state, country, phone, services, rating, capacity) VALUES
('City General Hospital', 'Hospital', '789 Healthcare Blvd', 'Metropolis', 'CA', 'USA', '+1555123456', 'Emergency,Surgery,Cardiology,Radiology', 4.5, 500),
('Downtown Medical Center', 'Clinic', '321 Medical Dr', 'Metropolis', 'CA', 'USA', '+1555987654', 'General Practice,Pediatrics,Dermatology', 4.2, 50)
ON CONFLICT DO NOTHING;

-- Create a view for easy querying across services
CREATE OR REPLACE VIEW patient_overview AS
SELECT
    p.id,
    p.first_name,
    p.last_name,
    p.date_of_birth,
    p.gender,
    p.phone,
    p.email,
    COUNT(DISTINCT mr.id) as medical_record_count,
    COUNT(DISTINCT r.id) as referral_count,
    MAX(mr.record_date) as last_medical_record_date
FROM patients p
LEFT JOIN medical_records mr ON p.id = mr.patient_id
LEFT JOIN referrals r ON p.id = r.patient_id
GROUP BY p.id, p.first_name, p.last_name, p.date_of_birth, p.gender, p.phone, p.email;

-- Output completion message
DO $$
BEGIN
    RAISE NOTICE 'AfyaLink database initialization completed successfully!';
    RAISE NOTICE 'Created databases: auth, patients, referrals, facilities, messaging, audit';
    RAISE NOTICE 'Created tables with proper indexes and relationships';
    RAISE NOTICE 'Inserted sample data for testing';
END
$$;