/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     12/02/2022 8:55:13 AM                        */
/*==============================================================*/


drop table if exists PRODUCT;

/*==============================================================*/
/* Table: PRODUCT                                               */
/*==============================================================*/
create table PRODUCT
(
   ID                   decimal not null,
   NAME                 text,
   IMAGE                text,
   DESCRIPTION          text,
   BASIC_UNIT           text,
   PRICE_PER_UNIT       float(8,2),
   DISCOUNT_ID          numeric(8,0),
   CATEGORY_ID          numeric(8,0),
   BRAND                text,
   ORIGIN               text,
   primary key (ID)
);

