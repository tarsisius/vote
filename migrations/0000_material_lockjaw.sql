CREATE TABLE `events` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`total` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP);

CREATE TABLE `options` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`total` int NOT NULL DEFAULT 0,
	`event_id` int NOT NULL);
