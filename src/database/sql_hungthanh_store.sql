/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     19/03/2022 9:57:19 PM                        */
/*==============================================================*/


drop table if exists ADDRESS;

drop table if exists CATEGORIES;

drop table if exists CUSTOMERS;

drop table if exists DISCOUNTS;

drop table if exists DISCOUNTS_PRODUCTS;

drop table if exists EMPLOYEES;

drop table if exists IMAGES;

drop table if exists ORDERS;

drop table if exists ORDERS_PRODUCTS;

drop table if exists ORDER_STATUSES;

drop table if exists ORDER_STATUS_HISTORY;

drop table if exists PRODUCTS;

drop table if exists STOCK;

drop table if exists TAXES;

drop table if exists TAXES_PRODUCTS;

drop table if exists USERS;

/*==============================================================*/
/* Table: ADDRESS                                               */
/*==============================================================*/
create table ADDRESS
(
   ADDRESS_ID           numeric(8,0) not null,
   CUSTOMER_ID2         numeric(8,0),
   ORDER_ID             numeric(8,0),
   CUSTOMER_ID          numeric(8,0),
   VALUE                text,
   primary key (ADDRESS_ID)
);

/*==============================================================*/
/* Table: CATEGORIES                                            */
/*==============================================================*/
create table CATEGORIES
(
   CATEGORY_ID          numeric(8,0) not null,
   CAT_CATEGORY_ID      numeric(8,0),
   PRODUCT_ID           numeric(8,0),
   NAME                 text,
   DESCRIPTION          text,
   PARENT               numeric(8,0),
   primary key (CATEGORY_ID)
);

/*==============================================================*/
/* Table: CUSTOMERS                                             */
/*==============================================================*/
create table CUSTOMERS
(
   CUSTOMER_ID          numeric(8,0) not null,
   USER_ID              numeric(8,0),
   NAME                 text,
   BIRTHDAY             timestamp,
   EMAIL                text,
   GENDER               bool,
   PHOTO                text,
   primary key (CUSTOMER_ID)
);

/*==============================================================*/
/* Table: DISCOUNTS                                             */
/*==============================================================*/
create table DISCOUNTS
(
   DISCOUNT_ID          numeric(8,0) not null,
   NAME                 text,
   VALUE                text,
   DESCRIPTION          text,
   primary key (DISCOUNT_ID)
);

/*==============================================================*/
/* Table: DISCOUNTS_PRODUCTS                                    */
/*==============================================================*/
create table DISCOUNTS_PRODUCTS
(
   DISCOUNT_ID          numeric(8,0),
   PRODUCT_ID           numeric(8,0),
   START_DATE           timestamp,
   END_DATE             timestamp,
   ACTIVE               bool
);

/*==============================================================*/
/* Table: EMPLOYEES                                             */
/*==============================================================*/
create table EMPLOYEES
(
   CUSTOMER_ID2         numeric(8,0) not null,
   USER_ID              numeric(8,0),
   NAME                 text,
   BIRTHDAY             timestamp,
   EMAIL                text,
   GENDER               bool,
   PHOTO                text,
   SALARY               numeric(8,0),
   BONUS                float,
   POSITION             text,
   primary key (CUSTOMER_ID2)
);

/*==============================================================*/
/* Table: IMAGES                                                */
/*==============================================================*/
create table IMAGES
(
   IMAGE_ID             numeric(8,0) not null,
   PRODUCT_ID           numeric(8,0),
   PATH                 text,
   DESCRIPTION          text,
   primary key (IMAGE_ID)
);

/*==============================================================*/
/* Table: ORDERS                                                */
/*==============================================================*/
create table ORDERS
(
   ORDER_ID             numeric(8,0) not null,
   ADDRESS_ID           numeric(8,0),
   CUSTOMER_ID          numeric(8,0),
   CUSTOMER_ID2         numeric(8,0),
   COMMENT              text,
   INVOICE_DATE         timestamp,
   DELIVERY_DATE        timestamp,
   TOTAL_DISCOUNT       float,
   TOTAL_TAX            float,
   TOTAL_PRICE          float,
   primary key (ORDER_ID)
);

/*==============================================================*/
/* Table: ORDERS_PRODUCTS                                       */
/*==============================================================*/
create table ORDERS_PRODUCTS
(
   ORDER_ID             numeric(8,0),
   PRODUCT_ID           numeric(8,0),
   QUANTITY             numeric(8,0),
   PRICE                numeric(8,0),
   PRICE_WITH_TAX       float
);

/*==============================================================*/
/* Table: ORDER_STATUSES                                        */
/*==============================================================*/
create table ORDER_STATUSES
(
   ORDER_STATUS_ID      numeric(8,0) not null,
   NAME                 text,
   NOTIFICATION         text,
   primary key (ORDER_STATUS_ID)
);

/*==============================================================*/
/* Table: ORDER_STATUS_HISTORY                                  */
/*==============================================================*/
create table ORDER_STATUS_HISTORY
(
   ORDER_STATUS_HIS_ID  numeric(8,0) not null,
   ORDER_ID             numeric(8,0),
   ORDER_STATUS_ID      numeric(8,0),
   UPDATED_DATE         timestamp,
   primary key (ORDER_STATUS_HIS_ID)
);

/*==============================================================*/
/* Table: PRODUCTS                                              */
/*==============================================================*/
create table PRODUCTS
(
   PRODUCT_ID           numeric(8,0) not null,
   CATEGORY_ID          numeric(8,0),
   STOCK_ID             numeric(8,0),
   NAME                 text,
   SLUG                 text,
   DESCRIPTION          text,
   BASIC_UNIT           text,
   PRICE_PER_UNIT       float(8,2),
   BRAND                text,
   ORIGIN               text,
   primary key (PRODUCT_ID)
);

/*==============================================================*/
/* Table: STOCK                                                 */
/*==============================================================*/
create table STOCK
(
   STOCK_ID             numeric(8,0) not null,
   PRODUCT_ID           numeric(8,0),
   QUANTITY             numeric(8,0),
   CREATED_AT           timestamp,
   MODIFIED_AT          timestamp,
   DELETED_AT           timestamp,
   primary key (STOCK_ID)
);

/*==============================================================*/
/* Table: TAXES                                                 */
/*==============================================================*/
create table TAXES
(
   TAX_ID               numeric(8,0) not null,
   NAME                 text,
   VALUE                text,
   primary key (TAX_ID)
);

/*==============================================================*/
/* Table: TAXES_PRODUCTS                                        */
/*==============================================================*/
create table TAXES_PRODUCTS
(
   PRODUCT_ID           numeric(8,0),
   TAX_ID               numeric(8,0),
   START_DATE           timestamp,
   END_DATE             timestamp,
   ACTIVE               bool
);

/*==============================================================*/
/* Table: USERS                                                 */
/*==============================================================*/
create table USERS
(
   USER_ID              numeric(8,0) not null,
   CUSTOMER_ID          numeric(8,0),
   CUSTOMER_ID2         numeric(8,0),
   USERNAME             text,
   PASSWORD             text,
   ACTIVE               bool,
   USER_TYPE            text,
   CREATED_DATE         timestamp,
   primary key (USER_ID)
);

alter table ADDRESS add constraint FK_ADDRESS_EMPLOYEES foreign key (CUSTOMER_ID2)
      references EMPLOYEES (CUSTOMER_ID2) on delete restrict on update restrict;

alter table ADDRESS add constraint FK_ORDERS_ADDRESS2 foreign key (ORDER_ID)
      references ORDERS (ORDER_ID) on delete restrict on update restrict;

alter table ADDRESS add constraint FK_RELATIONSHIP_15 foreign key (CUSTOMER_ID)
      references CUSTOMERS (CUSTOMER_ID) on delete restrict on update restrict;

alter table CATEGORIES add constraint FK_LOAI foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table CATEGORIES add constraint FK_SUB_CATEGORY foreign key (CAT_CATEGORY_ID)
      references CATEGORIES (CATEGORY_ID) on delete restrict on update restrict;

alter table CUSTOMERS add constraint FK_RELATIONSHIP_18 foreign key (USER_ID)
      references USERS (USER_ID) on delete restrict on update restrict;

alter table DISCOUNTS_PRODUCTS add constraint FK_DISCOUNTS_PRO_DISCOUNTS foreign key (DISCOUNT_ID)
      references DISCOUNTS (DISCOUNT_ID) on delete restrict on update restrict;

alter table DISCOUNTS_PRODUCTS add constraint FK_DISCOUNTS_PRO_PRODUCTS foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table EMPLOYEES add constraint FK_RELATIONSHIP_20 foreign key (USER_ID)
      references USERS (USER_ID) on delete restrict on update restrict;

alter table IMAGES add constraint FK_HAVE_IMAGES foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table ORDERS add constraint FK_ORDERS_ADDRESS foreign key (ADDRESS_ID)
      references ADDRESS (ADDRESS_ID) on delete restrict on update restrict;

alter table ORDERS add constraint FK_ORDERS_CUSTOMERS foreign key (CUSTOMER_ID)
      references CUSTOMERS (CUSTOMER_ID) on delete restrict on update restrict;

alter table ORDERS add constraint FK_ORDERS_EMPLOYEES foreign key (CUSTOMER_ID2)
      references EMPLOYEES (CUSTOMER_ID2) on delete restrict on update restrict;

alter table ORDERS_PRODUCTS add constraint FK_ORDERS_PRO_ORDERS foreign key (ORDER_ID)
      references ORDERS (ORDER_ID) on delete restrict on update restrict;

alter table ORDERS_PRODUCTS add constraint FK_ORDERS_PRO_PRODUCTS foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table ORDER_STATUS_HISTORY add constraint FK_ORDER_STA_HIS_ORDERS foreign key (ORDER_ID)
      references ORDERS (ORDER_ID) on delete restrict on update restrict;

alter table ORDER_STATUS_HISTORY add constraint FK_ORDER_STA_HIS_ORDER_STA foreign key (ORDER_STATUS_ID)
      references ORDER_STATUSES (ORDER_STATUS_ID) on delete restrict on update restrict;

alter table PRODUCTS add constraint FK_LOAI2 foreign key (CATEGORY_ID)
      references CATEGORIES (CATEGORY_ID) on delete restrict on update restrict;

alter table PRODUCTS add constraint FK_PRODUCTS_STOCK foreign key (STOCK_ID)
      references STOCK (STOCK_ID) on delete restrict on update restrict;

alter table STOCK add constraint FK_PRODUCTS_STOCK2 foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table TAXES_PRODUCTS add constraint FK_TAXES_PRO_PRODUCTS foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table TAXES_PRODUCTS add constraint FK_TAXES_PRO_TAXES foreign key (TAX_ID)
      references TAXES (TAX_ID) on delete restrict on update restrict;

alter table USERS add constraint FK_RELATIONSHIP_19 foreign key (CUSTOMER_ID)
      references CUSTOMERS (CUSTOMER_ID) on delete restrict on update restrict;

alter table USERS add constraint FK_RELATIONSHIP_21 foreign key (CUSTOMER_ID2)
      references EMPLOYEES (CUSTOMER_ID2) on delete restrict on update restrict;

