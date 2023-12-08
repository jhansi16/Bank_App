-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 09, 2023 at 12:46 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `banking`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `account_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `account_type` enum('Savings','Checking','Loan') DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`account_id`, `customer_id`, `account_type`, `balance`) VALUES
(1, 1, 'Savings', 900.00),
(2, 2, 'Savings', 9300.00),
(3, 2, 'Loan', 499600.00),
(4, 2, 'Checking', 4000.00),
(5, 3, 'Savings', 10000.00),
(6, 2, 'Loan', 1234.00),
(7, 4, 'Savings', 12345.00),
(8, 5, 'Checking', 23467599.00),
(9, 9, 'Checking', 40000.00),
(10, 6, 'Savings', 9200.00),
(11, 11, 'Checking', 12000.00),
(12, 12, 'Checking', 10000.00),
(13, 13, 'Checking', 9950.00),
(14, 14, 'Savings', 9940.00);

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(11) NOT NULL,
  `bill_type` enum('Electricity','Phone','Other') DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bills`
--

INSERT INTO `bills` (`bill_id`, `bill_type`, `account_number`, `amount`, `customer_id`, `payment_date`) VALUES
(1, 'Electricity', '100', 1000.00, 1, '2023-11-01 14:55:19'),
(2, 'Electricity', '1', 100.00, 1, '2023-11-01 14:59:29'),
(3, 'Phone', '1', 300.00, 2, '2023-11-01 18:56:21'),
(4, 'Other', '1', 400.00, 2, '2023-11-01 19:23:58'),
(5, 'Electricity', '8', 300.00, 5, '2023-11-06 20:05:00'),
(6, 'Phone', '6', 800.00, 6, '2023-12-07 03:32:50'),
(7, 'Phone', '2', 50.00, 13, '2023-12-07 04:23:36'),
(8, 'Phone', '6', 60.00, 14, '2023-12-07 04:29:25');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `first_name`, `last_name`, `email`, `password`) VALUES
(1, 'test', 'test', 'test@gmail.com', 'test'),
(2, 'jhansi', 'j', 'jhansi@gmail.com', '123'),
(3, 'abc', 'd', 'abc@gmail.com', 'abc'),
(4, 'navya', 'sri', 'navya@gmail.com', '1234'),
(5, 'samyuktha', 'g', 'samyuktha@gmail.com', '1234'),
(6, 'Varshitha', 'B', 'varshitha@gmail.com', '1234'),
(7, 'Jhansi', 'Birru', 'jhansibirru@gmail.com', '20020216'),
(8, 'Madhav', 'Y', 'madhav@gmail.com', 'madhav'),
(9, 'Jhansi', 'B', 'jhansi@gmail.com', 'jhansi'),
(10, 'Jhansi', 'b', 'emial@email.com', 'e mail'),
(11, 'dobby', 'd', 'dobby@gmail.com', '1234'),
(12, 'Sam', 's', 'sam@gmail.com', 'Sam12345'),
(13, 'Sam', 'Lee', 'samlee@gmail.com', 'samlee12'),
(14, 'sam', 'leee', 'samleee@gmail.com', 'samleee1'),
(15, 'h', 'j', 'hj@gmail.com', '12345678'),
(16, 'ooha', 'b', 'ooha@gmail.com', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `feedback_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `feedback_text` text DEFAULT NULL,
  `feedback_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `transaction_type` enum('Deposit','Withdrawal','Transfer') DEFAULT NULL,
  `transaction_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `sender_id`, `receiver_id`, `amount`, `transaction_type`, `transaction_date`) VALUES
(1, 1, 1, 100.00, 'Deposit', '2023-01-02 00:00:00'),
(2, 1, 1, 1000.00, 'Transfer', '2023-11-01 20:16:46'),
(3, 2, 1, 1000.00, 'Transfer', '2023-11-01 13:42:52'),
(4, 2, 1, 500.00, 'Transfer', '2023-11-01 13:55:54'),
(5, 2, 1, 800.00, 'Transfer', '2023-11-01 14:23:20'),
(7, 3, 2, 400.00, 'Transfer', '2023-11-06 07:17:52'),
(8, 5, 3, 300.00, 'Transfer', '2023-11-06 14:04:37'),
(9, 6, 2, 4000.00, 'Transfer', '2023-12-06 21:31:32'),
(10, 12, 5, 345.00, 'Transfer', '2023-12-06 22:14:53'),
(11, 13, 4, 100.00, 'Transfer', '2023-12-06 22:22:12'),
(12, 14, 6, 500.00, 'Transfer', '2023-12-06 22:28:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`feedback_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `customers` (`customer_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
