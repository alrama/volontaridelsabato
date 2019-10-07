-- phpMyAdmin SQL Dump
-- version 4.1.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Ott 07, 2019 alle 19:10
-- Versione del server: 5.6.33-log
-- PHP Version: 5.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `my_alrama`
--
CREATE DATABASE IF NOT EXISTS `my_alrama` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `my_alrama`;

-- --------------------------------------------------------

--
-- Struttura della tabella `categorie`
--

CREATE TABLE IF NOT EXISTS `categorie` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `nodi`
--

CREATE TABLE IF NOT EXISTS `nodi` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` text COLLATE utf8_bin NOT NULL,
  `autore` text COLLATE utf8_bin,
  `nazione` text COLLATE utf8_bin,
  `datacreazione` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `descrizione` text COLLATE utf8_bin,
  `previewimg` text COLLATE utf8_bin NOT NULL,
  `nodojson` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `datacreazione` (`datacreazione`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=57 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `nodi_categorie`
--

CREATE TABLE IF NOT EXISTS `nodi_categorie` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idNodo` int(10) unsigned NOT NULL,
  `idCategory` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idNodo` (`idNodo`),
  KEY `idCategory` (`idCategory`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=248 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `nodi_nomi`
--

CREATE TABLE IF NOT EXISTS `nodi_nomi` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idnodo` int(10) unsigned NOT NULL,
  `nome` text COLLATE utf8_bin NOT NULL,
  `nazione` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idnodo` (`idnodo`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=8 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `nodi_segmenti`
--

CREATE TABLE IF NOT EXISTS `nodi_segmenti` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `idnodo` int(10) unsigned NOT NULL,
  `distanzaend` int(11) NOT NULL,
  `idorder` int(11) NOT NULL,
  `z_index` int(11) NOT NULL,
  `isleft` tinyint(1) NOT NULL,
  `start` point NOT NULL,
  `control` point NOT NULL,
  `end` point NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idnodo` (`idnodo`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `paniniweb_alimenti`
--

CREATE TABLE IF NOT EXISTS `paniniweb_alimenti` (
  `id_alimento` int(11) NOT NULL AUTO_INCREMENT,
  `nome_alimento` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id_alimento`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=34 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `paniniweb_alimenti_misure`
--

CREATE TABLE IF NOT EXISTS `paniniweb_alimenti_misure` (
  `id_misura` int(11) NOT NULL AUTO_INCREMENT,
  `misura_nome` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id_misura`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=36 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `paniniweb_alimenti_qta`
--

CREATE TABLE IF NOT EXISTS `paniniweb_alimenti_qta` (
  `id_alimento` int(11) NOT NULL,
  `id_unita_misura` int(11) NOT NULL,
  `quantita` double NOT NULL,
  `scadenza` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `paniniweb_avvisi`
--

CREATE TABLE IF NOT EXISTS `paniniweb_avvisi` (
  `inserita` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `testo` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `gruppi_id` int(11) NOT NULL,
  PRIMARY KEY (`inserita`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `paniniweb_evento`
--

CREATE TABLE IF NOT EXISTS `paniniweb_evento` (
  `gruppi_id` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data_evento` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=26 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `paniniweb_fasi`
--

CREATE TABLE IF NOT EXISTS `paniniweb_fasi` (
  `gruppi_id` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fase` text NOT NULL,
  `sequenza` int(11) NOT NULL,
  `orario` time NOT NULL,
  `max_partecipanti` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `paniniweb_gruppi`
--

CREATE TABLE IF NOT EXISTS `paniniweb_gruppi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `paniniweb_partecipazioni`
--

CREATE TABLE IF NOT EXISTS `paniniweb_partecipazioni` (
  `email` varchar(50) NOT NULL,
  `fase_id` int(11) NOT NULL,
  `evento_id` int(11) NOT NULL,
  `inserita` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `partecipazione` (`email`,`fase_id`,`evento_id`),
  KEY `email` (`email`,`evento_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `paniniweb_temprec`
--

CREATE TABLE IF NOT EXISTS `paniniweb_temprec` (
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `password` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `hash` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `nome` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `cognome` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `telefono` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struttura della tabella `paniniweb_users`
--

CREATE TABLE IF NOT EXISTS `paniniweb_users` (
  `gruppi_id` int(11) NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `nome` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `cognome` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `cellulare` text CHARACTER SET utf8 COLLATE utf8_bin,
  `password` text CHARACTER SET utf8 COLLATE utf8_bin,
  `admin` tinyint(1) NOT NULL,
  `hash` text CHARACTER SET utf8 COLLATE utf8_bin,
  `deleghe` text CHARACTER SET utf8 COLLATE utf8_bin,
  PRIMARY KEY (`email`),
  KEY `gruppi_id` (`gruppi_id`),
  KEY `hash` (`hash`(256))
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
