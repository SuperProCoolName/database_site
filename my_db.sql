-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `idCustomers` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idCustomers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (0,'cogow_inoke56@aol.com'),(1,'tus-eyumeca23@gmail.com'),(2,'migowaw_ige96@outlook.com'),(3,'fawixaj_ajo41@yahoo.com'),(4,'dil_alikexo3@aol.com'),(5,'trinity_stokes71@yahoo.com'),(6,'kinney_cassidy35@outlook.com'),(7,'hannah-levon77@aol.com'),(8,'metcalf-martez9@gmail.com'),(9,'vil_ehobura84@aol.com');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `idRoutes` int NOT NULL,
  `departure_date` date DEFAULT NULL,
  `departure_time` time DEFAULT NULL,
  `price` int DEFAULT NULL,
  `departure_station` int DEFAULT NULL,
  `arrival_station` int DEFAULT NULL,
  PRIMARY KEY (`idRoutes`),
  KEY `departure_station_idx` (`departure_station`),
  KEY `arrival_station_idx` (`arrival_station`),
  CONSTRAINT `arrival_station` FOREIGN KEY (`arrival_station`) REFERENCES `stations` (`idStations`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `departure_station` FOREIGN KEY (`departure_station`) REFERENCES `stations` (`idStations`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (0,'2023-05-02','14:30:00',200,0,5),(1,'2023-05-03','14:40:00',250,1,6),(2,'2023-05-04','14:50:00',300,2,4),(3,'2023-05-05','15:00:00',350,2,3),(4,'2023-05-06','15:10:00',400,3,1),(5,'2023-05-07','15:20:00',400,1,0),(6,'2023-05-08','15:30:00',450,2,0),(7,'2023-05-09','15:40:00',450,4,2),(8,'2023-05-10','15:50:00',500,5,5),(9,'2023-05-11','16:00:00',350,6,3);
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stations` (
  `idStations` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idStations`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES (0,'Oldcastle Park','Yalta'),(1,'Wington Town','Kerch'),(2,'Binworth City','Simferopol'),(3,'Bingborough Mere','Sevastopol'),(4,'Nombfield Vale','Evpatoriya'),(5,'Badgers Mount','Feodosiya'),(6,'Nombfield Way','Dzhankoi');
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `idTickets` int NOT NULL,
  `route_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  PRIMARY KEY (`idTickets`),
  KEY `route_id_idx` (`route_id`),
  KEY `customer_id_idx` (`customer_id`),
  CONSTRAINT `customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`idCustomers`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `route_id` FOREIGN KEY (`route_id`) REFERENCES `routes` (`idRoutes`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (0,0,9),(1,1,8),(2,1,1),(3,2,2),(4,2,0),(5,3,3),(6,3,4),(7,4,7),(8,5,6),(9,6,5);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_bought_tickets`
--

DROP TABLE IF EXISTS `user_bought_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_bought_tickets` (
  `user_id` int NOT NULL,
  `route_id` int DEFAULT NULL,
  `ticket_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `route_id_idx` (`route_id`),
  KEY `ticket_id_idx` (`ticket_id`),
  CONSTRAINT `fk_route_id` FOREIGN KEY (`route_id`) REFERENCES `routes` (`idRoutes`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`idTickets`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`idUsers`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_bought_tickets`
--

LOCK TABLES `user_bought_tickets` WRITE;
/*!40000 ALTER TABLE `user_bought_tickets` DISABLE KEYS */;
INSERT INTO `user_bought_tickets` VALUES (0,4,3),(1,3,2),(2,5,5),(3,2,4),(4,1,6),(5,0,7);
/*!40000 ALTER TABLE `user_bought_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `idUsers` int NOT NULL,
  `userEmail` varchar(255) DEFAULT NULL,
  `userPassword` varchar(255) DEFAULT NULL,
  `isAdmin` int DEFAULT NULL,
  PRIMARY KEY (`idUsers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'baba-cinego2@gmail.com','LvPTH42Auv',0),(1,'siso-fagihe35@hotmail.com','gUHjMKK46N',0),(2,'binepas-uma49@aol.com','ZVd9GuwTYL',0),(3,'haheno_xulu24@aol.com','TEW7vXSzFH',0),(4,'pide-tucidu7@outlook.com','JsxhNcFr8U',0),(5,'admin@test.ru','admin_pass',1),(6,'admin@info.com','admin_password',1),(7,'kocafup_ina87@hotmail.com','sxb73t9NU5',0),(8,'hollis_baxter87@outlook.com','2sXqRprSd2',0),(9,'may_raymond50@aol.com','aQKXC2PU4c',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-02 23:38:36
