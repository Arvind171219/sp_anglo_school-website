-- ============================================
-- School Website Database Schema for MySQL
-- ============================================
-- Run this ONLY if you want to manually create the database.
-- Spring Boot with `ddl-auto=update` will auto-create tables.

CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

-- Users table (Admin only)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(100),
    role ENUM('ADMIN') NOT NULL DEFAULT 'ADMIN'
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    class_name VARCHAR(30),
    section VARCHAR(10),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    admission_year INT
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    exam_type VARCHAR(30) NOT NULL,
    marks_obtained DOUBLE NOT NULL,
    total_marks DOUBLE NOT NULL,
    grade VARCHAR(5),
    academic_year VARCHAR(20),
    semester VARCHAR(20),
    remarks TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    subject VARCHAR(100),
    qualification VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(100),
    photo_url VARCHAR(500),
    section VARCHAR(30),
    joining_year INT
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(30),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Default Admin User (password: admin123)
-- ============================================
INSERT IGNORE INTO users (username, password, email, full_name, role)
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'admin@school.com', 'System Administrator', 'ADMIN');
