-- =====================================================================
-- Portfolio Database Schema
-- Database: portfolio_db
-- Description: Stores contact inquiries and form submissions for Iliyas Patel Portfolio
-- =====================================================================

-- 1. Create Database if not exists (Hostinger / cPanel often creates database via UI)
CREATE DATABASE IF NOT EXISTS `portfolio_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `portfolio_db`;

-- 2. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT DEFAULT NULL,
  `status` ENUM('unread', 'read', 'archived', 'replied') NOT NULL DEFAULT 'unread',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_contact_email` (`email`),
  INDEX `idx_contact_status` (`status`),
  INDEX `idx_contact_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

