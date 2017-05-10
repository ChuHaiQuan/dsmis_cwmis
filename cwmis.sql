/*
SQLyog Ultimate v9.62 
MySQL - 5.1.63-0+squeeze1 : Database - cwmis
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`cwmis` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `cwmis`;

/*Table structure for table `TBuyer` */

DROP TABLE IF EXISTS `TBuyer`;

CREATE TABLE `TBuyer` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `Type` varchar(200) DEFAULT NULL,
  `Code` varchar(200) DEFAULT NULL,
  `ShortName` varchar(200) DEFAULT NULL,
  `AllName` varchar(200) DEFAULT NULL,
  `Address` varchar(2000) DEFAULT NULL,
  `PostCode` varchar(200) DEFAULT NULL,
  `Tel1` varchar(200) DEFAULT NULL,
  `Tel2` varchar(200) DEFAULT NULL,
  `Tel3` varchar(200) DEFAULT NULL,
  `Mobile` varchar(200) DEFAULT NULL COMMENT '??',
  `FAX` varchar(200) DEFAULT NULL,
  `EMail` varchar(200) DEFAULT NULL,
  `Http` varchar(200) DEFAULT NULL,
  `Accounts` varchar(200) DEFAULT NULL,
  `TaxCode` varchar(200) DEFAULT NULL,
  `LinkMan` varchar(200) DEFAULT NULL,
  `CompanyType` varchar(200) DEFAULT NULL,
  `HelpName` varchar(200) DEFAULT NULL COMMENT '???',
  `RecDate` datetime DEFAULT NULL COMMENT '????',
  `MyMemo` varchar(500) DEFAULT NULL COMMENT '??',
  `city` varchar(500) DEFAULT NULL COMMENT '??1',
  `state` varchar(500) DEFAULT NULL COMMENT '??2',
  `passwd` varchar(50) DEFAULT NULL,
  `leav_money` float(16,2) DEFAULT NULL,
  `bank_Name` varchar(500) DEFAULT NULL,
  `bank_Acount` varchar(50) DEFAULT NULL,
  `credit_Acount` varchar(50) DEFAULT NULL,
  `credit_Line` float(16,2) DEFAULT NULL,
  `balance` float(16,2) DEFAULT NULL,
  `total` float(16,2) DEFAULT '0.00',
  `acc_balance` float(16,2) DEFAULT '0.00',
  `debit_balance` float(16,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `RecID` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=gbk;

/*Data for the table `TBuyer` */

/*Table structure for table `TEmployee` */

DROP TABLE IF EXISTS `TEmployee`;

CREATE TABLE `TEmployee` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `Name` varchar(200) DEFAULT NULL,
  `Code` varchar(200) DEFAULT NULL,
  `Sex` varchar(5) DEFAULT NULL,
  `BirthDay` varchar(200) DEFAULT NULL,
  `IDCard` varchar(200) DEFAULT NULL,
  `Tel` varchar(200) DEFAULT NULL,
  `Mobile` varchar(200) DEFAULT NULL,
  `Address` varchar(2000) DEFAULT NULL,
  `Department` varchar(200) DEFAULT NULL,
  `HeadShip` varchar(200) DEFAULT NULL,
  `Popedom` varchar(200) DEFAULT NULL,
  `Password1` varchar(200) CHARACTER SET gbk COLLATE gbk_bin DEFAULT NULL,
  `is_manager` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `RecID` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=gbk;

/*Data for the table `TEmployee` */

insert  into `TEmployee`(`id`,`Name`,`Code`,`Sex`,`BirthDay`,`IDCard`,`Tel`,`Mobile`,`Address`,`Department`,`HeadShip`,`Popedom`,`Password1`,`is_manager`) values (20,'admin','admin','','','','345','123456','','other','manager','38','123456',0);

/*Table structure for table `TInvoice` */

DROP TABLE IF EXISTS `TInvoice`;

CREATE TABLE `TInvoice` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `provider_id` int(20) NOT NULL DEFAULT '-1',
  `purchase_bill_code` varchar(50) NOT NULL,
  `invoice_code` varchar(50) NOT NULL,
  `amout` float(16,2) DEFAULT '0.00',
  `description` varchar(200) DEFAULT '',
  `invoiceDate` bigint(20) NOT NULL,
  `updDate` bigint(20) NOT NULL,
  `paidAmount` float(16,2) DEFAULT '0.00',
  `credit` float(16,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `privider_po` (`provider_id`,`purchase_bill_code`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk COMMENT='InnoDB free: 6144 kB; InnoDB free: 6144 kB';

/*Data for the table `TInvoice` */

/*Table structure for table `TInvoiceHistory` */

DROP TABLE IF EXISTS `TInvoiceHistory`;

CREATE TABLE `TInvoiceHistory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint(20) NOT NULL,
  `amout` float(16,2) DEFAULT '0.00',
  `payDate` bigint(20) NOT NULL,
  `remark` varchar(1000) COLLATE gbk_bin DEFAULT NULL,
  `payment` varchar(1000) COLLATE gbk_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_INVOICE` (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk COLLATE=gbk_bin COMMENT='InnoDB free: 5120 kB';

/*Data for the table `TInvoiceHistory` */

/*Table structure for table `TKeyValue` */

DROP TABLE IF EXISTS `TKeyValue`;

CREATE TABLE `TKeyValue` (
  `mapkey` varchar(128) NOT NULL,
  `value` varchar(10000) DEFAULT NULL,
  PRIMARY KEY (`mapkey`),
  UNIQUE KEY `key-index` (`mapkey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=gbk COMMENT='其他数据存储';

/*Data for the table `TKeyValue` */

insert  into `TKeyValue`(`mapkey`,`value`) values ('company','{\"company_logo_pic_logo\":\"\\/images\\/company\\/20120730204140913.png\",\"company_address\":\"24asdfnu啊设法e Brookly44n,NY 11211\",\"company_name\":\"DRAGON PLUMBING & ELETRICAL SUPPLY INC\",\"company_tel\":\"(718)389-8882eed\",\"invoiceTax\":\"0.08375\",\"company_name_pic_logo\":\"\\/images\\/company\\/20120730204140761.png\",\"company_fax\":\"(718)389-8887ee\"}');

/*Table structure for table `TPower` */

DROP TABLE IF EXISTS `TPower`;

CREATE TABLE `TPower` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `power_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=gbk;

/*Data for the table `TPower` */

insert  into `TPower`(`id`,`power_name`) values (34,'casher'),(36,'sale'),(38,'admin');

/*Table structure for table `TPowerOperation` */

DROP TABLE IF EXISTS `TPowerOperation`;

CREATE TABLE `TPowerOperation` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `PopedomCode` float(24,0) DEFAULT NULL,
  `OperationCode` int(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1069 DEFAULT CHARSET=gbk;

/*Data for the table `TPowerOperation` */

insert  into `TPowerOperation`(`id`,`PopedomCode`,`OperationCode`) values (1001,34,21),(1002,34,22),(1003,34,23),(1004,34,24),(1005,34,40),(1006,34,41),(1013,36,20),(1014,36,21),(1015,36,22),(1016,36,23),(1017,36,24),(1018,36,41),(1019,36,42),(1020,36,43),(1021,36,45),(1022,36,80),(1045,38,20),(1046,38,21),(1047,38,22),(1048,38,23),(1049,38,24),(1050,38,25),(1051,38,26),(1052,38,27),(1053,38,28),(1054,38,29),(1055,38,40),(1056,38,41),(1057,38,42),(1058,38,43),(1059,38,44),(1060,38,45),(1061,38,61),(1062,38,62),(1063,38,100),(1064,38,101),(1065,38,102),(1066,38,103),(1067,38,120),(1068,38,121);

/*Table structure for table `TProduct` */

DROP TABLE IF EXISTS `TProduct`;

CREATE TABLE `TProduct` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `product_id` varchar(50) DEFAULT NULL,
  `Code` varchar(50) DEFAULT NULL,
  `product_name` varchar(300) DEFAULT NULL,
  `Spec` varchar(30) DEFAULT NULL,
  `Unit` varchar(50) DEFAULT NULL,
  `UpLimit` float(24,0) DEFAULT NULL,
  `DownLimit` float(24,0) DEFAULT NULL,
  `Price_income` float(16,2) DEFAULT NULL,
  `Price_simgle` float(16,2) DEFAULT NULL,
  `Drawing` varchar(255) DEFAULT NULL,
  `HelpName` varchar(100) DEFAULT NULL,
  `MyMemo` varchar(2000) DEFAULT NULL,
  `Drawing2` varchar(255) DEFAULT NULL,
  `Drawing3` varchar(255) DEFAULT NULL,
  `Drawing4` varchar(255) DEFAULT NULL,
  `Drawing5` varchar(255) DEFAULT NULL,
  `Drawing6` varchar(255) DEFAULT NULL,
  `Drawing7` varchar(255) DEFAULT NULL,
  `Drawing8` varchar(255) DEFAULT NULL,
  `Drawing9` varchar(255) DEFAULT NULL,
  `Sreserve1` varchar(255) DEFAULT NULL COMMENT '??1',
  `Sreserve2` varchar(255) DEFAULT NULL COMMENT '??2',
  `Sreserve3` varchar(255) DEFAULT NULL COMMENT '??3',
  `freserve1` smallint(5) DEFAULT NULL COMMENT '??4',
  `freserve2` smallint(5) DEFAULT NULL COMMENT '??5',
  `freserve3` smallint(5) DEFAULT NULL COMMENT '??6',
  `product_type` varchar(50) DEFAULT NULL,
  `num` int(10) DEFAULT NULL,
  `product_name_cn` varchar(500) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `price_wholesale` float(20,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `RecID` (`id`),
  KEY `num` (`product_type`,`num`) USING BTREE,
  KEY `product_index` (`product_id`,`Code`,`product_name`,`product_name_cn`(383)) USING BTREE,
  KEY `product_coed` (`Code`,`product_name`,`product_name_cn`(383)) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2135 DEFAULT CHARSET=gbk;

/*Data for the table `TProduct` */

/*Table structure for table `TProductType` */

DROP TABLE IF EXISTS `TProductType`;

CREATE TABLE `TProductType` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `product_type_name` varchar(500) DEFAULT NULL,
  `code` varchar(500) DEFAULT NULL,
  `parent_id` int(10) DEFAULT NULL,
  `level` int(4) DEFAULT NULL,
  `product_type_name_cn` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=gbk;

/*Data for the table `TProductType` */

/*Table structure for table `TProduct_vendor` */

DROP TABLE IF EXISTS `TProduct_vendor`;

CREATE TABLE `TProduct_vendor` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `product_id` int(10) DEFAULT NULL,
  `vendor_id` int(10) DEFAULT NULL,
  `product_name` varchar(50) DEFAULT NULL,
  `vendor_name` varchar(50) DEFAULT NULL,
  `price` float(20,2) DEFAULT '0.00',
  `useDefault` tinyint(20) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `product_id` (`product_id`),
  KEY `vendor_id` (`vendor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=gbk;

/*Data for the table `TProduct_vendor` */

/*Table structure for table `TProvider` */

DROP TABLE IF EXISTS `TProvider`;

CREATE TABLE `TProvider` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `Type` varchar(200) DEFAULT NULL,
  `Code` varchar(200) DEFAULT NULL,
  `ShortName` varchar(200) DEFAULT NULL,
  `AllName` varchar(200) DEFAULT NULL,
  `Address` varchar(2000) DEFAULT NULL,
  `PostCode` varchar(200) DEFAULT NULL,
  `Tel1` varchar(200) DEFAULT NULL,
  `Tel2` varchar(200) DEFAULT NULL,
  `Tel3` varchar(200) DEFAULT NULL,
  `Mobile` varchar(200) DEFAULT NULL COMMENT '??',
  `FAX` varchar(200) DEFAULT NULL,
  `EMail` varchar(200) DEFAULT NULL,
  `Http` varchar(200) DEFAULT NULL,
  `Accounts` varchar(200) DEFAULT NULL,
  `TaxCode` varchar(200) DEFAULT NULL,
  `LinkMan` varchar(200) DEFAULT NULL,
  `CompanyType` varchar(200) DEFAULT NULL,
  `HelpName` varchar(10) DEFAULT NULL COMMENT '???',
  `RecDate` datetime DEFAULT NULL COMMENT '????',
  `MyMemo` varchar(255) DEFAULT NULL COMMENT '??',
  `city` varchar(255) DEFAULT NULL COMMENT '??1',
  `state` varchar(255) DEFAULT NULL COMMENT '??2',
  `Sreserve3` varchar(255) DEFAULT NULL COMMENT '??3',
  `freserve1` float(16,2) DEFAULT NULL COMMENT '??4',
  `freserve2` float(16,2) DEFAULT NULL COMMENT '??5',
  `freserve3` float(16,2) DEFAULT NULL COMMENT '??6',
  `balance` float(16,2) DEFAULT '0.00',
  `invoice_total` float(16,2) NOT NULL DEFAULT '0.00',
  `invoice_balance` float(16,2) NOT NULL DEFAULT '0.00',
  `acc_balance` float(16,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `RecID` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=gbk COMMENT='InnoDB free: 5120 kB';

/*Data for the table `TProvider` */

/*Table structure for table `TPurchase` */

DROP TABLE IF EXISTS `TPurchase`;

CREATE TABLE `TPurchase` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `purchase_bill_code` varchar(500) DEFAULT NULL,
  `oper_id` int(10) DEFAULT NULL,
  `oper_name` varchar(500) DEFAULT NULL,
  `oper_time` datetime DEFAULT NULL,
  `all_purchase_price` float(16,2) DEFAULT NULL,
  `provider_id` int(10) DEFAULT NULL,
  `provider_name` varchar(500) DEFAULT NULL,
  `if_stock` int(11) DEFAULT '0',
  `po_number` varchar(11) DEFAULT NULL,
  `invoice_pic` varchar(200) DEFAULT NULL,
  `paid` int(11) DEFAULT NULL,
  `remark` varchar(2000) DEFAULT NULL,
  `remark2` varchar(2000) DEFAULT NULL,
  `actual_received` int(11) DEFAULT '0',
  `receiver` varchar(255) DEFAULT NULL,
  `order_pic` varchar(200) DEFAULT NULL,
  `invoice_code` varchar(50) DEFAULT NULL,
  `all_paid_price` float(16,2) DEFAULT '0.00',
  `if_cashed` smallint(5) DEFAULT '0',
  `cash_oper_id` smallint(5) DEFAULT NULL,
  `cash_oper_name` varchar(50) DEFAULT NULL,
  `cash_oper_code` varchar(5) DEFAULT NULL,
  `cash_time` datetime DEFAULT '1900-01-01 00:00:00',
  `cash_station` varchar(50) DEFAULT NULL,
  `actual_received_amount` float(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `oper_id` (`oper_id`),
  KEY `provider_id` (`provider_id`),
  KEY `purchase_bill_code` (`purchase_bill_code`(383))
) ENGINE=InnoDB DEFAULT CHARSET=gbk COMMENT='InnoDB free: 13312 kB; InnoDB free: 9216 kB; InnoDB free: 92';

/*Data for the table `TPurchase` */

/*Table structure for table `TPurchaseProduct` */

DROP TABLE IF EXISTS `TPurchaseProduct`;

CREATE TABLE `TPurchaseProduct` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `purchase_id` int(10) DEFAULT NULL,
  `product_id` int(10) DEFAULT NULL,
  `product_code` varchar(50) DEFAULT NULL,
  `product_name` varchar(50) DEFAULT NULL,
  `product_price` float(16,2) DEFAULT NULL,
  `product_num` int(10) DEFAULT NULL,
  `purchase_time` datetime DEFAULT NULL,
  `provider_id` int(10) DEFAULT NULL,
  `provider_name` varchar(50) DEFAULT NULL,
  `if_stock` int(11) DEFAULT '0',
  `remark` varchar(1024) DEFAULT NULL,
  `actual_received` int(11) DEFAULT NULL,
  `receiver` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `product_id` (`product_id`),
  KEY `product_num` (`product_num`),
  KEY `provider_id` (`provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Data for the table `TPurchaseProduct` */

/*Table structure for table `TSale` */

DROP TABLE IF EXISTS `TSale`;

CREATE TABLE `TSale` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `sale_bill_code` varchar(50) DEFAULT NULL,
  `oper_id` int(10) DEFAULT NULL,
  `oper_code` varchar(50) DEFAULT NULL,
  `oper_name` varchar(50) DEFAULT NULL,
  `oper_time` datetime DEFAULT NULL,
  `cash_oper_id` smallint(5) DEFAULT NULL,
  `cash_oper_code` varchar(50) DEFAULT NULL,
  `cash_oper_name` varchar(50) DEFAULT NULL,
  `cash_time` datetime DEFAULT NULL,
  `cash_station` varchar(50) DEFAULT NULL,
  `rma_id` smallint(5) DEFAULT NULL,
  `rma_code` varchar(50) DEFAULT NULL,
  `rma_name` varchar(50) DEFAULT NULL,
  `rma_time` datetime DEFAULT NULL,
  `buyer_id` int(10) DEFAULT '0',
  `buyer_code` varchar(200) DEFAULT NULL,
  `buyer_state` varchar(200) DEFAULT NULL,
  `buyer_city` varchar(200) DEFAULT NULL,
  `buyer_name` varchar(200) DEFAULT NULL,
  `buyer_mobile` varchar(200) DEFAULT NULL,
  `buyer_postCode` varchar(200) DEFAULT NULL,
  `buyer_address` varchar(2000) DEFAULT NULL,
  `if_cashed` smallint(5) DEFAULT NULL,
  `payment` varchar(50) DEFAULT NULL,
  `sub_total` float(16,2) DEFAULT NULL,
  `tax` float(16,2) DEFAULT NULL,
  `discount` float(16,2) DEFAULT NULL,
  `all_price` float(16,2) DEFAULT NULL,
  `confirm_code` varchar(500) DEFAULT NULL,
  `invoice` varchar(500) DEFAULT NULL,
  `remark` varchar(2000) DEFAULT NULL,
  `paid_price` float(16,2) DEFAULT '0.00',
  `send_type` varchar(20) DEFAULT '0' COMMENT '0 送货，1 邮寄，2 自取',
  `send_time` datetime DEFAULT NULL,
  `send_operid` bigint(20) DEFAULT NULL,
  `send_opername` varchar(100) DEFAULT NULL,
  `type` tinyint(2) DEFAULT '0' COMMENT '订单类型，0 普通，1，报价单',
  `refund` double(16,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `buyer_id` (`buyer_id`),
  KEY `buyer_id1` (`rma_id`),
  KEY `cash_oper_code` (`cash_oper_code`),
  KEY `cash_oper_id` (`cash_oper_id`),
  KEY `confirm_code` (`confirm_code`(383)),
  KEY `id` (`id`),
  KEY `oper_code` (`oper_code`),
  KEY `oper_id` (`oper_id`),
  KEY `sale_bill_code` (`sale_bill_code`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=gbk;

/*Data for the table `TSale` */

/*Table structure for table `TSaleHistory` */

DROP TABLE IF EXISTS `TSaleHistory`;

CREATE TABLE `TSaleHistory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `oper_id` bigint(20) NOT NULL,
  `buyer_id` bigint(20) NOT NULL,
  `cash_time` datetime NOT NULL,
  `amount` double(16,2) NOT NULL,
  `sale_id` bigint(20) NOT NULL,
  `sale_bill_code` varchar(50) DEFAULT NULL,
  `oper_name` varchar(64) DEFAULT NULL,
  `buyer_name` varchar(64) DEFAULT NULL,
  `remark` varchar(1000) DEFAULT NULL,
  `payment` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Data for the table `TSaleHistory` */

/*Table structure for table `TSaleProduct` */

DROP TABLE IF EXISTS `TSaleProduct`;

CREATE TABLE `TSaleProduct` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `sale_id` int(10) DEFAULT NULL,
  `product_id` int(10) DEFAULT NULL,
  `product_code` varchar(500) DEFAULT NULL,
  `product_name` varchar(500) DEFAULT NULL,
  `product_price` float(16,2) DEFAULT NULL,
  `agio_price` float(16,2) DEFAULT NULL,
  `product_num` int(10) DEFAULT NULL,
  `sale_time` datetime DEFAULT NULL,
  `agio` float(16,2) DEFAULT NULL,
  `rma_id` int(10) DEFAULT NULL,
  `rma_time` datetime DEFAULT NULL,
  `rma_code` varchar(50) DEFAULT NULL,
  `if_rma` varchar(50) DEFAULT NULL,
  `if_back_order` int(11) DEFAULT NULL,
  `back_order_id` int(11) DEFAULT NULL,
  `back_order_code` varchar(20) DEFAULT NULL,
  `back_order_time` datetime DEFAULT NULL,
  `rma_num` int(11) DEFAULT NULL,
  `credit_num` int(11) DEFAULT NULL,
  `damage_num` int(11) DEFAULT NULL,
  `productid` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `product_id` (`product_id`),
  KEY `product_num` (`product_num`),
  KEY `rma_code` (`rma_code`),
  KEY `rma_id` (`rma_id`),
  KEY `sale_id` (`sale_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=gbk COMMENT='InnoDB free: 13312 kB; InnoDB free: 13312 kB';

/*Data for the table `TSaleProduct` */

/*Table structure for table `TStock` */

DROP TABLE IF EXISTS `TStock`;

CREATE TABLE `TStock` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `stock_bill_code` varchar(50) DEFAULT NULL,
  `oper_id` int(10) DEFAULT NULL,
  `oper_name` varchar(50) DEFAULT NULL,
  `oper_time` datetime DEFAULT NULL,
  `all_stock_price` float(16,2) DEFAULT NULL,
  `provider_id` int(10) DEFAULT NULL,
  `provider_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `oper_id` (`oper_id`),
  KEY `provider_id` (`provider_id`),
  KEY `stock_bill_code` (`stock_bill_code`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Data for the table `TStock` */

/*Table structure for table `TStockProduct` */

DROP TABLE IF EXISTS `TStockProduct`;

CREATE TABLE `TStockProduct` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `stock_id` int(10) DEFAULT NULL,
  `product_id` int(10) DEFAULT NULL,
  `product_code` varchar(50) DEFAULT NULL,
  `product_name` varchar(50) DEFAULT NULL,
  `product_price` float(16,2) DEFAULT NULL,
  `product_num` int(10) DEFAULT NULL,
  `stock_time` datetime DEFAULT NULL,
  `provider_id` int(10) DEFAULT NULL,
  `provider_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `product_id` (`product_id`),
  KEY `product_num` (`product_num`),
  KEY `provider_id` (`provider_id`),
  KEY `sale_id` (`stock_id`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Data for the table `TStockProduct` */

/*Table structure for table `seq_purchase_id` */

DROP TABLE IF EXISTS `seq_purchase_id`;

CREATE TABLE `seq_purchase_id` (
  `id` int(16) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Data for the table `seq_purchase_id` */

insert  into `seq_purchase_id`(`id`) values (244);

/*Table structure for table `seq_sale_id` */

DROP TABLE IF EXISTS `seq_sale_id`;

CREATE TABLE `seq_sale_id` (
  `id` int(16) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Data for the table `seq_sale_id` */

insert  into `seq_sale_id`(`id`) values (218);

/*Table structure for table `seq_stock_id` */

DROP TABLE IF EXISTS `seq_stock_id`;

CREATE TABLE `seq_stock_id` (
  `id` int(16) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Data for the table `seq_stock_id` */

insert  into `seq_stock_id`(`id`) values (250);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
