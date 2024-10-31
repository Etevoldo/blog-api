-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 31, 2024 at 09:28 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blog`
--
CREATE DATABASE IF NOT EXISTS `blog` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_520_ci;
USE `blog`;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `category` varchar(30) DEFAULT NULL,
  `tags` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `category`, `tags`, `createdAt`, `updatedAt`) VALUES
(4, 'My third not edited blog posts', 'This is the content of my third blog post.', 'Botany', 'Tech, programming, botany', '2024-10-30 18:24:42', '2024-10-31 14:11:18'),
(5, 'My forth not edited blog posts', 'content content content content', 'Botany', 'Tech', '2024-10-30 18:25:07', '2024-10-31 14:11:18'),
(6, 'His mother had always taught him', 'His mother had always taught him not to ever think of himself as better than others. He\'d tried to live by this motto. He never looked down on those who were less fortunate or who had less money than him. But the stupidity of the group of people he was talking to made him change his mind.', 'mommy', 'history, american, crime', '2024-10-31 15:23:06', '2024-10-31 16:48:40'),
(7, 'He was an expert but not in a discipline', 'really long strnig booo', 'ice-cream', 'french,fiction,english', '2024-10-31 15:25:55', '2024-10-31 15:27:11'),
(8, 'All he wanted was a candy bar.    ', 'All he wanted was a candy bar. It didn\'t seem like a difficult request to comprehend, but the clerk remained frozen and didn\'t seem to want to honor the request. It might have had something to do with the gun pointed at his face.  ', 'Wanted ', 'mystery,english,american     ', '2024-10-31 15:35:26', '2024-10-31 15:35:26'),
(9, 'It\'s an unfortunate reality that we don\'t teach people how to make money', 'It\'s an unfortunate reality that we don\'t teach people how to make money (beyond getting a 9 to 5 job) as part of our education system. The truth is there are a lot of different, legitimate ways to make money. That doesn\'t mean they are easy and that you won\'t have to work hard to succeed, but it does mean that if you\'re willing to open your mind a bit you don\'t have to be stuck in an office from 9 to 5 for the next fifty years o your life.', 'Wanted ', 'mystery, english, american', '2024-10-31 15:40:37', '2024-10-31 16:59:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
