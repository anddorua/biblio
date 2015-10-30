<?php
/**
 * Created by PhpStorm.
 * User: Такси
 * Date: 16.10.15
 * Time: 18:06
 */

namespace Utility;


class TablesCreateScript implements \Iterator
{
    use StaticFieldIterator;

    protected static $script = array(
<<<EOT
CREATE TABLE IF NOT EXISTS `books` (
  `id` int(11) NOT NULL,
  `author` varchar(128) NOT NULL,
  `title` varchar(256) NOT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `owned_count` int(11) NOT NULL DEFAULT '0',
  `store_count` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
EOT
,
<<<EOT
CREATE TABLE IF NOT EXISTS `book_issue_data` (
  `book_id` int(11) NOT NULL,
  `reader_id` int(11) NOT NULL,
  `issue_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
EOT
,
<<<EOT
CREATE TABLE IF NOT EXISTS `opers` (
  `login` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `pwd_hash` varchar(40) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `firstname` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastname` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_admin` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
EOT
,
<<<EOT
CREATE TABLE IF NOT EXISTS `readers` (
  `id` int(11) NOT NULL,
  `surname` varchar(64) NOT NULL,
  `firstname` varchar(64) NOT NULL,
  `middlename` varchar(64) DEFAULT NULL,
  `dateofbirth` date DEFAULT NULL,
  `address` varchar(256) NOT NULL,
  `phone` varchar(13) NOT NULL,
  `reg_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `hold_count` int(11) DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
EOT
,
<<<EOT
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author` (`author`),
  ADD KEY `title` (`title`(255)),
  ADD KEY `isbn` (`isbn`);
EOT
,
<<<EOT
ALTER TABLE `book_issue_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `reader_id` (`reader_id`);
EOT
,
<<<EOT
ALTER TABLE `opers`
  ADD PRIMARY KEY (`login`);
EOT
,
<<<EOT
ALTER TABLE `readers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `surname` (`surname`);
EOT
,
<<<EOT
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
EOT
,
<<<EOT
ALTER TABLE `book_issue_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
EOT
,
<<<EOT
ALTER TABLE `readers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
EOT
,
<<<EOT
INSERT INTO `opers` (`login`, `pwd_hash`, `firstname`, `lastname`, `is_admin`) VALUES
('root', NULL, '', '', 1);
EOT
    );
}