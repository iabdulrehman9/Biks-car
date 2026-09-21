-- ============================================================================
-- BIKS Trading Company — MySQL Database Schema
-- Compatible with Hostinger MySQL & MariaDB
-- ============================================================================

CREATE TABLE IF NOT EXISTS `admins` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `make` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `year` INT NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `body_type` VARCHAR(50) DEFAULT NULL,
  `transmission` VARCHAR(50) DEFAULT NULL,
  `fuel_type` VARCHAR(50) DEFAULT NULL,
  `engine_cc` INT DEFAULT NULL,
  `mileage_km` INT DEFAULT NULL,
  `color` VARCHAR(50) DEFAULT NULL,
  `price_fob_jpy` BIGINT DEFAULT NULL,
  `price_fob_usd` DECIMAL(12, 2) DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Available',
  `location` VARCHAR(150) DEFAULT NULL,
  `image_url` TEXT DEFAULT NULL,
  `gallery` LONGTEXT DEFAULT NULL,
  `features` LONGTEXT DEFAULT NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `description` TEXT DEFAULT NULL,
  `chassis_no` VARCHAR(100) DEFAULT NULL,
  `stock_id` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_featured` (`featured`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
