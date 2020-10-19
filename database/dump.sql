-- MySQL dump 10.13  Distrib 8.0.5, for Win64 (x86_64)
--
-- Host: localhost    Database: scg_objects
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `backgrounds`
--

DROP TABLE IF EXISTS `backgrounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `backgrounds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `free_skill_id` int DEFAULT NULL,
  `quick_skill_ids` json DEFAULT NULL,
  `growth_skill_ids` json DEFAULT NULL,
  `learning_skill_ids` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backgrounds`
--

LOCK TABLES `backgrounds` WRITE;
/*!40000 ALTER TABLE `backgrounds` DISABLE KEYS */;
INSERT INTO `backgrounds` VALUES (0,'Physician',NULL,1,'[0, 2]','[0, 1, 2, 0, 1, 2]','[2, 2, 2, 1, 1, 1, 0, 0]'),(1,'Barbarian',NULL,0,'[1, 2]','[0, 1, 2, 0, 1, 2]','[0, 0, 0, 1, 1, 1, 2, 2]');
/*!40000 ALTER TABLE `backgrounds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `object_sources`
--

DROP TABLE IF EXISTS `object_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `object_sources` (
  `id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Literature sources for objects.E.g. Core rules';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `object_sources`
--

LOCK TABLES `object_sources` WRITE;
/*!40000 ALTER TABLE `object_sources` DISABLE KEYS */;
INSERT INTO `object_sources` VALUES (0,'Custom',NULL),(1,'Core',NULL),(2,'Naval',NULL),(3,'Espionage',NULL),(4,'W2',NULL),(5,'MA01',NULL),(6,'MA04',NULL);
/*!40000 ALTER TABLE `object_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `source_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `source_idx` (`source_id`),
  CONSTRAINT `skill_source` FOREIGN KEY (`source_id`) REFERENCES `object_sources` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (0,'Administer','Manage an organization, handle paperwork, analyze records, and keep an institution functioning on a daily basis. Roll it for bureaucratic expertise, organizational management, legal knowledge, dealing with government agencies, and understanding how institutions really work.',1),(1,'Connect','Find people who can be helpful to your purposes and get them to cooperate with you. Roll it to make useful connections with others, find people you know, know where to get illicit goods and services, and be familiar with foreign cultures and languages. You can use it in place of Talk for persuading people you find via this skill.',1);
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weapons`
--

DROP TABLE IF EXISTS `weapons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `weapons` (
  `id` int NOT NULL,
  `subtype` varchar(45) DEFAULT NULL,
  `name` varchar(60) NOT NULL,
  `source_id` int DEFAULT NULL,
  `page` int DEFAULT NULL,
  `tech_level` int DEFAULT NULL,
  `encumberance` int DEFAULT NULL,
  `cost` int DEFAULT NULL,
  `attribute` varchar(14) DEFAULT NULL,
  `damage` varchar(14) DEFAULT NULL,
  `range_low` int DEFAULT NULL,
  `range_high` int DEFAULT NULL,
  `shock` varchar(14) DEFAULT NULL,
  `magazine` varchar(14) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `id_idx` (`source_id`),
  CONSTRAINT `weapons_source` FOREIGN KEY (`source_id`) REFERENCES `object_sources` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weapons`
--

LOCK TABLES `weapons` WRITE;
/*!40000 ALTER TABLE `weapons` DISABLE KEYS */;
INSERT INTO `weapons` VALUES (1,'Unarmed','Unarmed Attack',1,35,0,0,NULL,'STR/DEX','1d2',NULL,NULL,NULL,NULL),(2,'Primitive','Knife',1,35,0,1,5,'STR/DEX','1d4',6,9,'1/AC 15',NULL),(3,'Projectile','Crude Pistol',1,36,2,1,20,'DEX','1d6',5,15,NULL,'1');
/*!40000 ALTER TABLE `weapons` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-19  3:02:22
