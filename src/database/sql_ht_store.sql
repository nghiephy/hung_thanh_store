/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     22/03/2022 10:32:08 AM                       */
/*==============================================================*/

create database hung_thanh_bookstore;
use hung_thanh_bookstore;
ALTER DATABASE hung_thanh_bookstore CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Given user root full access to connect database -- 
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '150101';
flush privileges;

-- Set safe_updates = 0 in order to modify table 
SET SQL_SAFE_UPDATES = 0;

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
   ADDRESS_ID           int not null auto_increment,
   USER_ID              int,
   ADDRESS              text,
   WARD                 text,
   DISTRICT             text,
   CITY                 text,
   UPDATED_AT 			timestamp,
   PHONE				varchar(15),
   NAME 				text,
   ISDEFAULT 			boolean,
   primary key (ADDRESS_ID)
);

/*==============================================================*/
/* Table: CATEGORIES                                            */
/*==============================================================*/
create table CATEGORIES
(
   CATEGORY_ID          int not null auto_increment,
   CAT_CATEGORY_ID      int,
   NAME                 text,
   IMAGE				text,
   SLUG					text,
   DESCRIPTION          text,
   primary key (CATEGORY_ID)
);

/*==============================================================*/
/* Table: CUSTOMERS                                             */
/*==============================================================*/
create table CUSTOMERS
(
   CUSTOMER_ID          int not null auto_increment,
   USER_ID              int,
   NAME                 text,
   BIRTHDAY             date,
   PHONE				varchar(15) unique,
   EMAIL                text,
   GENDER               bool,
   PHOTO                text,
   COMPANY_NAME			text,
   COM_TAX_NUMBER 		text,
   COM_ADDRESS			text,
   UPDATED_AT			timestamp,
   primary key (CUSTOMER_ID)
);

/*==============================================================*/
/* Table: DISCOUNTS                                             */
/*==============================================================*/
create table DISCOUNTS
(
   DISCOUNT_ID          int not null auto_increment,
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
   DISCOUNT_ID          int,
   PRODUCT_ID           int,
   START_DATE           timestamp,
   END_DATE             timestamp,
   ACTIVE               bool,
   primary key (DISCOUNT_ID, PRODUCT_ID)
);

/*==============================================================*/
/* Table: EMPLOYEES                                             */
/*==============================================================*/
create table EMPLOYEES
(
   EMPLOYEE_ID          int not null auto_increment,
   USER_ID              int,
   NAME                 text,
   BIRTHDAY             date,
   PHONE				varchar(15) unique,
   EMAIL                text,
   GENDER               bool,
   PHOTO                text,
   SALARY               numeric(8,0),
   BONUS                float,
   POSITION             text,
   COMPANY_NAME			text,
   COM_TAX_NUMBER 		text,
   COM_ADDRESS			text,
   UPDATED_AT			timestamp,
   primary key (EMPLOYEE_ID)
);

/*==============================================================*/
/* Table: IMAGES                                                */
/*==============================================================*/
create table IMAGES
(
   IMAGE_ID             int not null auto_increment,
   PRODUCT_ID           int,
   PATH                 text,
   DESCRIPTION          text,
   primary key (IMAGE_ID)
);

/*==============================================================*/
/* Table: ORDERS                                                */
/*==============================================================*/
create table ORDERS
(
   ORDER_ID             int not null auto_increment,
   EMPLOYEE_ID          int,
   ADDRESS_ID           int,
   BUYER_ID             int,
   NOTE                 text,
   INVOICE_DATE         timestamp,
   DELIVERY_DATE        timestamp,
   TOTAL_DISCOUNT       float,
   TOTAL_TAX            float,
   TOTAL_PRICE          float,
   COMPANY_NAME			text,
   COM_TAX_NUMBER 		text,
   COM_ADDRESS			text,
   CUR_STATUS			int,
   primary key (ORDER_ID)
);

/*==============================================================*/
/* Table: ORDERS_PRODUCTS                                       */
/*==============================================================*/
create table ORDERS_PRODUCTS
(
   ORDER_ID             int,
   PRODUCT_ID           int,
   QUANTITY             numeric(8,0),
   PRICE                numeric(8,0),
   PRICE_WITH_TAX       float,
   primary key (ORDER_ID, PRODUCT_ID)
);

/*==============================================================*/
/* Table: ORDER_STATUSES                                        */
/*==============================================================*/
create table ORDER_STATUSES
(
   ORDER_STATUS_ID      int not null auto_increment,
   NAME                 text,
   NOTIFICATION         text,
   primary key (ORDER_STATUS_ID)
);

/*==============================================================*/
/* Table: ORDER_STATUS_HISTORY                                  */
/*==============================================================*/
create table ORDER_STATUS_HISTORY
(
   ORDER_STATUS_HIS_ID  int not null auto_increment,
   ORDER_ID             int,
   ORDER_STATUS_ID      int,
   UPDATED_DATE         timestamp,
   primary key (ORDER_STATUS_HIS_ID)
);

/*==============================================================*/
/* Table: PRODUCTS                                              */
/*==============================================================*/
create table PRODUCTS
(
   PRODUCT_ID           int not null auto_increment,
   CATEGORY_ID          int,
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
   STOCK_ID             int not null auto_increment,
   PRODUCT_ID           int unique,
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
   TAX_ID               int not null auto_increment,
   NAME                 text,
   VALUE                text,
   primary key (TAX_ID)
);

/*==============================================================*/
/* Table: TAXES_PRODUCTS                                        */
/*==============================================================*/
create table TAXES_PRODUCTS
(
   PRODUCT_ID           int,
   TAX_ID               int,
   START_DATE           timestamp,
   END_DATE             timestamp,
   ACTIVE               bool,
   primary key (PRODUCT_ID, TAX_ID)
);

/*==============================================================*/
/* Table: USERS                                                 */
/*==============================================================*/
create table USERS
(
   USER_ID              int not null auto_increment,
   USERNAME             varchar(255) unique,
   PASSWORD             text,
   ACTIVE               bool default true,
   USER_TYPE            text,
   CREATED_DATE         timestamp,
   primary key (USER_ID)
);

/*==============================================================*/
/* Table: CARTS                                                 */
/*==============================================================*/
create table CARTS
(
   CART_ID              int not null auto_increment,
   USER_ID              int,
   UPDATE_DATE         	timestamp,
   primary key (CART_ID, USER_ID)
);

/*==============================================================*/
/* Table: CARTS_PRODUCTS                                                 */
/*==============================================================*/
create table CARTS_PRODUCTS
(
   CART_ID              int,
   PRODUCT_ID           int,
   QUANTITY				int,
   TOTAL_PRICE			float,
   IMAGE				text,
   primary key (CART_ID, PRODUCT_ID)
);

/*==============================================================*/
/* Table: WISHLIST                                                 */
/*==============================================================*/
create table WISHLIST
(
   WISHLIST_ID          int not null auto_increment,
   USER_ID              int,
   UPDATE_DATE         	timestamp,
   primary key (WISHLIST_ID, USER_ID)
);

/*==============================================================*/
/* Table: WISHLIST_PRODUCTS                                                 */
/*==============================================================*/
create table WISHLIST_PRODUCTS
(
   WISHLIST_ID          int,
   PRODUCT_ID           int,
   primary key (WISHLIST_ID, PRODUCT_ID)
);

alter table ADDRESS add constraint FK_RELATIONSHIP_20 foreign key (USER_ID)
      references USERS (USER_ID) on delete restrict on update restrict;

alter table CATEGORIES add constraint FK_SUB_CATEGORY foreign key (CAT_CATEGORY_ID)
      references CATEGORIES (CATEGORY_ID) on delete restrict on update restrict;

alter table CUSTOMERS add constraint FK_RELATIONSHIP_18 foreign key (USER_ID)
      references USERS (USER_ID) on delete restrict on update restrict;

alter table DISCOUNTS_PRODUCTS add constraint FK_DISCOUNTS_PRO_DISCOUNTS foreign key (DISCOUNT_ID)
      references DISCOUNTS (DISCOUNT_ID) on delete restrict on update restrict;

alter table DISCOUNTS_PRODUCTS add constraint FK_DISCOUNTS_PRO_PRODUCTS foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table EMPLOYEES add constraint FK_EMPLOYEES_USERS foreign key (USER_ID)
      references USERS (USER_ID) on delete restrict on update restrict;

alter table IMAGES add constraint FK_HAVE_IMAGES foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table ORDERS add constraint FK_ORDERS_ADDRESS foreign key (ADDRESS_ID)
      references ADDRESS (ADDRESS_ID) on delete restrict on update restrict;

alter table ORDERS add constraint FK_ORDERS_USERS foreign key (BUYER_ID)
      references USERS (USER_ID) on delete restrict on update restrict;

alter table ORDERS add constraint FK_ORDERS_EMPLOYEES foreign key (EMPLOYEE_ID)
      references EMPLOYEES (EMPLOYEE_ID) on delete restrict on update restrict;
      
alter table ORDERS add constraint FK_ORDERS_ORDER_STATUSES foreign key (CUR_STATUS)
      references ORDER_STATUSES (ORDER_STATUS_ID) on delete restrict on update restrict;

alter table ORDERS_PRODUCTS add constraint FK_ORDERS_PRO_ORDERS foreign key (ORDER_ID)
      references ORDERS (ORDER_ID) on delete restrict on update restrict;

alter table ORDERS_PRODUCTS add constraint FK_ORDERS_PRO_PRODUCTS foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table ORDER_STATUS_HISTORY add constraint FK_ORDER_STA_HIS_ORDERS foreign key (ORDER_ID)
      references ORDERS (ORDER_ID) on delete restrict on update restrict;

alter table ORDER_STATUS_HISTORY add constraint FK_ORDER_STA_HIS_ORDER_STA foreign key (ORDER_STATUS_ID)
      references ORDER_STATUSES (ORDER_STATUS_ID) on delete restrict on update restrict;

alter table PRODUCTS add constraint FK_LOAI foreign key (CATEGORY_ID)
      references CATEGORIES (CATEGORY_ID) on delete restrict on update restrict;

alter table STOCK add constraint FK_PRODUCTS_STOCK2 foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table TAXES_PRODUCTS add constraint FK_TAXES_PRO_PRODUCTS foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table TAXES_PRODUCTS add constraint FK_TAXES_PRO_TAXES foreign key (TAX_ID)
      references TAXES (TAX_ID) on delete restrict on update restrict;
      
alter table CARTS add constraint FK_USERS_CARTS foreign key (USER_ID)
      references USERS (USER_ID) on delete restrict on update restrict;
      
-- alter table USERS add constraint FK_EMPLOYEES_USERS2 foreign key (EMPLOYEE_ID)
--       references EMPLOYEES (EMPLOYEE_ID) on delete restrict on update restrict;

-- alter table USERS add constraint FK_RELATIONSHIP_19 foreign key (CUSTOMER_ID)
--       references CUSTOMERS (CUSTOMER_ID) on delete restrict on update restrict;

alter table CARTS_PRODUCTS add constraint FK_PRODUCTS_CARTS_PRODUCTS foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table CARTS_PRODUCTS add constraint FK_PRODUCTS_CARTS_CARTS foreign key (CART_ID)
      references CARTS (CART_ID) on delete restrict on update restrict;

alter table WISHLIST add constraint FK_USERS_WISHLIST foreign key (USER_ID)
      references USERS (USER_ID) on delete restrict on update restrict;

alter table WISHLIST_PRODUCTS add constraint FK_PRODUCTS_WISHLIST_PRODUCTS foreign key (PRODUCT_ID)
      references PRODUCTS (PRODUCT_ID) on delete restrict on update restrict;

alter table WISHLIST_PRODUCTS add constraint FK_WISHLIST_WISHLIST_PRODUCTS foreign key (WISHLIST_ID)
      references WISHLIST (WISHLIST_ID) on delete restrict on update restrict;
/*==============================================================*/
/* Add values for table categories                                                */
/*==============================================================*/
insert into categories(CAT_CATEGORY_ID, NAME, IMAGE, SLUG, BANNER, DESCRIPTION)
values
	(null, '????? D??ng H???c Sinh', '/img/category/do-dung-hoc-sinh.png', 'do-dung-hoc-sinh', '\img\banner\category\BANNER_DSHS_1200x250px.jpg', '<h3>T???ng H???p ????? D??ng H???c T???p Cho H???c Sinh C??c C???p</h3><p>S???m ????? d??ng h???c t???p cho con lu??n l??m nhi???u ba m??? ph???i v???t ??c suy ngh??, nh???t l?? nh???ng ai c?? con ?????u l??ng - c??n nhi???u b??? ng???. N???m ???????c n???i lo tr??n, V??n ph??ng ph???m FAST chuy??n cung c???p t???ng h???p c??c ????? d??ng Gi???y ki???m tra 4 ?? ly H??a b??nh - 1 l???c 200 t???, H???p B??t Simili H??nh C?? S???u 20x7x9cm, H???p b??t v???i Pubg 20x7x9cm, H???p b??t v???i c?? kh??a m???t m?? 20x6x8cm, B???ng b??? h???c sinh Phi M?? - 2 m???t tr???ng ??en (k??m b??t l??ng + m??t lau), Compa m??u H???ng, B??t Ch?? M??u Deli 6518 H???p Gi???y - K??m C??? T??n M??u ( 24 m??u)....</p>'),
    (null, 'Gi???y In ???n - Photo', '/img/category/giay-in-an-photo.png', 'giay-in-an---photo', '\img\banner\category\BANNER_PAPER_1200x250px.jpg', '<h3>Chuy??n Cung C???p C??c Lo???i Gi???y In, Gi???y A4 Ch???t L?????ng Chi???t kh???u Cao</h3><p>?????c bi???t, v???i c??c lo???i gi???y in A4, v?? ????y l?? lo???i gi???y ph???c v??? r???t nhi???u cho c??ng vi???c in ???n trong v??n ph??ng hi???n nay. V???y n??n, khi ch???n mua c??c lo???i gi???y A4 d??ng trong in ???n b???n c???n bi???t ti??u chu???n ????? c?? th??? mua ????ng lo???i gi???y b???n c???n d??ng. Fast chuy??n cung c???p c??c lo???i gi???y in ???n Gi???y A4 Excel 70 Gsm, Gi???y A4 Double A 70 Gsm, Gi???y in bill t??nh ti???n 8F (80x45mm), Gi???y kraft (t???) size A0, Decal Tomy m??i t??n - 1cm - h??nh vu??ng, Decal A3 ????? xanh gi???y nh??m (x???p 100 t???), Gi???y in bill t??nh ti???n 8F d???y ?????c bi???t (80x65mm), Gi???y scan Gateway 73gsm A4 (250 t???), Gi???y A0 - t???, Gi???y Fort m??u 80 A3 Gsm....</p>'),
    (null, 'B??a - K??? - R???', '/img/category/ro-bia-ke.png', 'bia---ke---ro', null, 'B??a ?????ng H??? S?? - K???, R??? - H???p C???m B??t ??a D???ng M???u M??'),
    (null, 'S??? - T???p - Bao Th??', '/img/category/so-tap-bao-thu.png', 'so---tap---bao-thu', null, 'S??? - T???p - Namecard - Phi???u Thu Chi Gi?? S?? Giao H??ng Si??u Nhanh'),
    (null, 'B??t - M???c Ch???t L?????ng Cao', '/img/category/but-muc-chat-luong-cao.png', 'but---muc-chat-luong-cao', null, 'B??t - M???c V??n Ph??ng ??a D???ng, Ch???t L?????ng H??ng ?????u'),
    (null, 'D???ng C??? V??n Ph??ng Ch???t L?????ng', '/img/category/dung-cu-van-phong.png', 'dung-cu-van-phong-chat-luong', null, 'D???ng C??? V??n Ph??ng ?????p, ??a D???ng, Ch???t L?????ng Uy T??n Giao H??ng Nhanh Ch??ng'),
    (null, 'B??ng Keo - Dao - K??o', '/img/category/bang-keo-dao-keo.png', 'bang-keo---dao-keo', null, 'B??ng keo - Dao - K??o - B??n C???t Gi???y Ch???t L?????ng Gi?? T???t Nh???t'),
    (null, 'M??y T??nh Casio', '/img/category/may-tinh-casio.png', 'may-tinh-casio', '\img\banner\category\BANNER_CASIO_1200x250px.jpg', '<h3>??i???m Danh C??c D??ng M??y T??nh Casio D??nh Cho H???c Sinh V?? D??n V??n Ph??ng</h3><p>M??y t??nh c???m tay hi???n nay h??? tr??? r???t t???t trong vi???c t??nh to??n. Fast chuy??n cung c???p c??c lo???i m??y t??nh Casio M??y t??nh Casio MX 12B, M??y t??nh Casio AX 12B, M??y t??nh Casio AX 120B, M??y t??nh Deli 12 s??? 1239, M??y t??nh Casio GX 12B, M??Y T??NH CASIO FX-500MS, M??Y T??NH CASIO JW200SC - 6 M??U....</p>'),
    (null, 'B??ch Ho?? Online', '/img/category/bach-hoa-online.png', 'bach-hoa-online', null, 'B??ch Ho?? V??n Ph??ng Gi?? M???u M?? ??a D???ng Gi?? T???t Nh???t'),
    (null, 'B???ng V??n Ph??ng', '/img/category/bang-van-phong.png', 'bang-van-phong', null, 'B???ng l?? lo???i v??n ph??ng ph???m c???c k??? quen thu???c v???i ch??ng ta ngay t??? khi c??n ng???i tr??n gh??? nh?? tr?????ng. Nh???ng con ch??? t??? b???ng v??o t??m tr?? ch??ng ta t??? l??c nh??? cho ?????n khi l??m vi???c t???i c??c c??ng ty, ??o??n th???. Ngo??i lo???i b???ng d??ng ????? vi???t hay h???c, hi???n nay c?? r???t nhi???u bi???n th??? ????p ???ng nhi???u mong mu???n c???a ng?????i s??? d???ng. H??y c??ng V??n ph??ng ph???m FAST ngh??a qua nh??!'),
    (null, 'D???ch V??? Kh???c D???u Uy T??n', '/img/category/dich-vu-khac-dau-uy-tin.png', 'dich-vu-khac-dau-uy-tin', null, 'D???ch V??? Kh???c D???u Theo Y??u C???u Nhanh, Giao H??ng T???n N??i'),
    (null, 'S???n Ph???m V??n Ph??ng Kh??c', '/img/category/san-pham-van-phong-khac.png', 'san-pham-van-phong-khac', null, 'C??c Danh M???c S???n Ph???m V??n Ph??ng Ph???m Kh??c Nhi???u M???u M?? M???i Gi?? T???t Nh???t Hi???n Nay');

-- Turn off sale mode before run below stament --
SET SQL_SAFE_UPDATES = 0;

-- Reset auto_increment = 1 --
set @autoid :=0; 
update order_statuses set order_status_id = @autoid := (@autoid+1);
alter table order_statuses Auto_Increment = 1;

-- Turn on sale mode after run above stament --
SET SQL_SAFE_UPDATES = 1;

/*==============================================================*/
/* Add values for table products                                                */
/*==============================================================*/
insert into products(CATEGORY_ID, NAME, SLUG, DESCRIPTION, BASIC_UNIT, PRICE_PER_UNIT, BRAND, ORIGIN)
values
	(1, 'B??t S??p M??u Deli EC21000 - 12 m??u', 'but-sap-mau-deli-ec21000---12-mau', 'Lo???i ?????u b??t: 1 c??y / 1 m??u ( h???p 12 m??u )', 'H???p', 61400, 'DELI', 'Trung Qu???c'),
    (1, 'B??? C??? V??? Chuy??n Nghi???p Deli 1 set / 6 C??y', 'bo-co-ve-chuyen-nghiep-deli-1-set---6-cay', null, 'B???', 155250, 'DELI', 'Trung Qu???c'),
    (1, 'B??a k?? tay / b??a l??t t???p - quy???n v???', 'bia-ke-tay---bia-lot-tap---quyen-vo', null, 'C??i', 7200, '??ang c???p nh???t', 'Vi???t Nam'),
    (1, 'Sticker 60 mi???ng Con s??? - 5 x???p h??nh ng???u nhi??n', 'sticker-60-mieng-con-so---5-xap-hinh-ngau-nhien', null, 'B???', 160700, '??ang c???p nh???t', 'Vi???t Nam'),
    (8, 'M??y t??nh Casio MX 120B', 'may-tinh-casio-mx-120b', null, 'C??i', 294000, 'Casio', 'Vi???t Nam'),
    (8, 'M??y t??nh Casio b??? t??i HL-815L - ??en', 'may-tinh-casio-bo-tui-hl-815l---den', null, 'C??i', 201600, 'Casio', 'Vi???t Nam'),
    (8, 'M??y t??nh Casio MX 12B - H???ng', 'may-tinh-casio-mx-12b---hong', null, 'C??i', 207500, 'Casio', 'Vi???t Nam'),
    (2, 'Gi???y A4 Excel 70 Gsm', 'giay-a4-excel-70-gsm', null, 'Raem', 77400, 'Excel', 'Vi???t Nam');

/*==============================================================*/
/* Add values for table stock                                                */
/*==============================================================*/
insert into stock(PRODUCT_ID, QUANTITY, CREATED_AT, MODIFIED_AT, DELETED_AT)
values
	(1, 100, '2022-03-25 00:00:01', null, null),
    (2, 500, '2022-03-25 00:00:55', null, null),
    (3, 400, '2022-03-25 00:01:55', null, null),
    (4, 300, '2022-04-25 00:03:55', null, null),
    (5, 300, '2022-04-25 00:04:55', null, null),
    (6, 500, '2022-04-28 00:04:55', null, null),
    (7, 200, '2022-04-28 00:05:55', null, null),
    (8, 200, '2022-04-29 00:05:55', null, null);


/*==============================================================*/
/* Add values for table images                                                */
/*==============================================================*/
insert into images(PRODUCT_ID, PATH, DESCRIPTION)
values
	(1, '/img/products/but-sap-mau-deli.png', 'B??t S??p M??u Deli EC21000 - 12 m??u'),
    (2, '/img/products/bo-co-ve-chuyen-nghiep-deli.png', 'B??? C??? V??? Chuy??n Nghi???p Deli 1 set / 6 C??y - 73885'),
    (3, '/img/products/bia-ke-tay-bia-lot-tap-quyen-vo-1.jpg', 'B??a k?? tay / b??a l??t t???p - quy???n v???'),
    (3, '/img/products/bia-ke-tay-bia-lot-tap-quyen-vo-2.jpg', 'B??a k?? tay / b??a l??t t???p - quy???n v???'),
    (4, '/img/products/sticker-60-mieng-con-so---5-xap-hinh-ngau-nhien-1.jpg', 'Sticker 60 mi???ng Con s??? - 5 x???p h??nh ng???u nhi??n'),
    (4, '/img/products/sticker-60-mieng-con-so---5-xap-hinh-ngau-nhien-2.jpg', 'Sticker 60 mi???ng Con s??? - 5 x???p h??nh ng???u nhi??n'),
    (5, '/img/products/may-tinh-casio-mx-120b-1.jfif', 'M??y t??nh Casio MX 120B'),
    (5, '/img/products/may-tinh-casio-mx-120b-2.png', 'M??y t??nh Casio MX 120B'),
    (6, '/img/products/may-tinh-bo-tui-casio-hl-815-1.jpg', 'M??y t??nh Casio b??? t??i HL-815L - ??en'),
    (6, '/img/products/may-tinh-bo-tui-casio-hl-815-2.jpg', 'M??y t??nh Casio b??? t??i HL-815L - ??en'),
    (7, '/img/products/may-tinh-casio-mx-12b-hong-1.png', 'M??y t??nh Casio MX 12B - H???ng'),
    (7, '/img/products/may-tinh-casio-mx-12b-hong-2.png', 'M??y t??nh Casio MX 12B - H???ng'),
    (7, '/img/products/may-tinh-casio-mx-12b-hong-3.png', 'M??y t??nh Casio MX 12B - H???ng'),
    (8, '/img/products/giay-a4-excel-70-gsm-1.png', 'Gi???y A4 Excel 70 Gsm'),
    (8, '/img/products/giay-a4-excel-70-gsm-2.png', 'Gi???y A4 Excel 70 Gsm');
    
/*==============================================================*/
/* Add values for table users                                                */
/*==============================================================*/
insert into users(USERNAME, PASSWORD, ACTIVE, USER_TYPE, CREATED_DATE)
values
	('nghiephy', '123456', 1, 'admin', '2022-04-4 00:00:01'),
    ('haiyenln', '123456', 1, 'customer', '2022-04-4 00:00:01');

/*==============================================================*/
/* Add values for table employees                                                */
/*==============================================================*/
insert into employees(USER_ID, NAME, BIRTHDAY, EMAIL, GENDER, PHOTO, SALARY, BONUS, POSITION)
values
	('1', 'Nghiep Nguyen', '2000-01-01 00:00:00', 'nguyenlapnghiep44@gmail.com', '1', null, '1000', null, 'admin');


/*==============================================================*/
/* Add values for table customers                                                */
/*==============================================================*/
insert into customers(USER_ID, NAME, BIRTHDAY, EMAIL, GENDER, PHOTO)
values
	('2', 'Hai Yen', '2000-01-15 00:00:00', 'lenguyenhoanghaiyen15@gmail.com', '0', null);
    

/*==============================================================*/
/* QUERY TEMPLATE                                              */
/*==============================================================*/
## Query: get path banner category via category name
select banner
from categories
where categories.name = '????? D??ng H???c Sinh';

## Query: get information product via slug
select *
from products
where products.slug = 'bia-ke-tay---bia-lot-tap---quyen-vo';

## Query: get image list product via slug
select images.PATH as IMG_PATH, images.DESCRIPTION as IMG_DESCRIPTION
from products
join images on images.PRODUCT_ID = products.PRODUCT_ID
where products.slug = 'bia-ke-tay---bia-lot-tap---quyen-vo';

## Query: search products via keyword
select products.*, images.PATH as IMAGE_PATH
from products
join categories on products.category_id = categories.category_id
join images on products.product_id = images.product_id
where products.name like '%tap%'
group by product_id;

## Query: get list information of all user
select users.*, customers.name, customers.photo from users join customers on users.user_id = customers.user_id
union 
select users.*, employees.name, employees.photo from users join employees on users.user_id = employees.user_id


/*==============================================================*/
/* DEFINE USEFUL FUNCTION                                               */
/*==============================================================*/
delimiter $$
CREATE FUNCTION `getProductViaCategory` ( categoryName text)
RETURNS boolean
deterministic
BEGIN
	declare currentMoney int ;
    set currentMoney = (select balance from person_account where person_account.id= id_customer);
    if(currentMoney >= minusMoney)
		then 
        return true;
        else 
        return false;
	end if;
END$$

/*==============================================================*/
/* DEFINE USEFUL PROCEDURE                                               */
/*==============================================================*/

-- procedure get products via name of category
DELIMITER //
DROP PROCEDURE IF EXISTS getProductViaCategory //
CREATE PROCEDURE 
  getProductViaCategory( categoryName text )
BEGIN  
	select products.*, categories.BANNER, categories.SLUG as CAT_SLUG, categories.NAME as CAT_NAME, images.PATH as IMAGE_PATH
	from products
	join categories on products.category_id = categories.category_id
    join images on products.product_id = images.product_id
	where categories.name = categoryName
    and products.deleted = false
    group by product_id;
END//
DELIMITER ;
-- test
call getProductViaCategory ('????? D??ng H???c Sinh');

-- procedure get products via slug of category
DELIMITER //
DROP PROCEDURE IF EXISTS getProductViaSlugCat //
CREATE PROCEDURE 
  getProductViaSlugCat( slug text )
BEGIN  
	select products.*, categories.NAME as CAT_NAME, categories.SLUG as CAT_SLUG, categories.DESCRIPTION as CAT_DESCRIPTION, images.PATH as IMAGE_PATH
	from products
	join categories on products.category_id = categories.category_id
    join images on products.product_id = images.product_id
	where categories.slug = slug
    and products.deleted = false
    group by product_id;
END//
DELIMITER ;
-- test
call getProductViaSlugCat ('do-dung-hoc-sinh');

-- procedure get cart list via user_id
DELIMITER //
DROP PROCEDURE IF EXISTS getCartList //
CREATE PROCEDURE 
  getCartList( userId int)
BEGIN  
	select carts_products.*, products.NAME, products.PRICE_PER_UNIT, products.SLUG
	from carts
	join carts_products on carts.cart_id = carts_products.cart_id
    join products on carts_products.product_id = products.product_id
    where carts.user_id = userId
    and products.deleted = false;
END//
DELIMITER ;
-- test
call getCartList (14);

-- procedure delete cart list of user into db
DELIMITER //
DROP PROCEDURE IF EXISTS deleteCartList //
CREATE PROCEDURE 
  deleteCartList( cart_id int)
BEGIN  
	delete
    from carts_products
    where carts_products.cart_id = cart_id;
END//
DELIMITER ;
-- test
call deleteCartList (2);

-- procedure save cart list of user into db
DELIMITER //
DROP PROCEDURE IF EXISTS saveCartList //
CREATE PROCEDURE 
  saveCartList( cart_id int, product_id int, quantity int, total_price float, image text)
BEGIN  
	insert into carts_products
    values (cart_id, product_id, quantity, total_price, image);
END//
DELIMITER ;
-- test
call saveCartList (1, 3, 1, 7200, '/img/products/bia-ke-tay-bia-lot-tap-quyen-vo-1.jpg');

-- procedure delete cart list of user into db
DELIMITER //
DROP PROCEDURE IF EXISTS deleteCartItem //
CREATE PROCEDURE 
  deleteCartItem( cart_id int, product_id int)
BEGIN  
	delete
    from carts_products
    where carts_products.cart_id = cart_id;
END//
DELIMITER ;
-- test
call deleteCartList (2);

-- procedure delete all information about product via product_id
DELIMITER //
DROP PROCEDURE IF EXISTS destroyProduct //
CREATE PROCEDURE 
  destroyProduct(product_id int)
BEGIN  
	delete
    from stock
    where stock.product_id = product_id;
    
    delete
    from images
    where images.product_id = product_id;
    
    delete
    from products
    where products.product_id = product_id;
END//
DELIMITER ;
-- test
call destroyProduct (30);

-- procedure update information of product by admin
DELIMITER //
DROP PROCEDURE IF EXISTS updateProduct //
CREATE PROCEDURE 
  updateProduct(product_id int, category_id int, name text, slug text, description text, basic_unit text, price_per_unit float, brand text, origin text, updated_at timestamp)
BEGIN  
	update products
    set products.CATEGORY_ID = category_id,
		products.NAME = name,
        products.SLUG = slug,
        products.DESCRIPTION = description,
        products.BASIC_UNIT = basic_unit,
        products.PRICE_PER_UNIT = price_per_unit,
        products.BRAND = brand,
        products.ORIGIN = origin,
        products.UPDATED_AT = updated_at
	where products.PRODUCT_ID = product_id;
END//
DELIMITER ;
-- test

-- procedure update information of user via user_id
DELIMITER //
DROP PROCEDURE IF EXISTS updateAccountInfor //
CREATE PROCEDURE 
  updateAccountInfor(user_id int, table_name text, name text, birthday date, email text, gender boolean, photo text, phone text, company_name text, com_tax_number text, com_address text, updated_at timestamp)
BEGIN
	set @table = table_name;
	if @table = 'customers' then
		update customers
 		set customers.NAME = name,
 			customers.BIRTHDAY = birthday,
 			customers.EMAIL = email,
 			customers.GENDER = gender,
 			customers.PHOTO = photo,
 			customers.PHONE = phone,
 			customers.COMPANY_NAME = company_name,
 			customers.COM_TAX_NUMBER = com_tax_number,
			customers.COM_ADDRESS = com_address,
 			customers.UPDATED_AT = updated_at
		where customers.USER_ID = user_id;
	elseif @table = 'employees' then
		update employees
 		set employees.NAME = name,
 			employees.BIRTHDAY = birthday,
 			employees.EMAIL = email,
 			employees.GENDER = gender,
 			employees.PHOTO = photo,
 			employees.PHONE = phone,
 			employees.COMPANY_NAME = company_name,
 			employees.COM_TAX_NUMBER = com_tax_number,
			employees.COM_ADDRESS = com_address,
 			employees.UPDATED_AT = updated_at
		where employees.USER_ID = user_id;
	end if;
END//
DELIMITER ;
-- test
call updateAccountInfor(15,'customers','Customer V??n To??n','2000-01-15','customervt@gmail.com',true,'/img/users/capturejpg-1651152279007.JPG','0901222333','Elephant Company','12000MST','Chau Thanh, Hau Giang','2022-04-28 21:36:15');

-- procedure save add address of user
DELIMITER //
DROP PROCEDURE IF EXISTS updateAddress //
CREATE PROCEDURE 
  updateAddress(address_id int, name text, phone varchar(15), address text, ward text, district text, city text, isdefault boolean, updated_at timestamp)
BEGIN  
	update address
    set address.name = name, 
		address.phone = phone, 
		address.address = address, 
		address.ward =  ward, 
		address.district = district, 
		address.city = city,
		address.isdefault = isdefault,
		address.updated_at = updated_at
    where address.address_id = address_id;
END//
DELIMITER ;
-- test

-- procedure get order list of user
DELIMITER //
DROP PROCEDURE IF EXISTS getOrderList //
CREATE PROCEDURE 
  getOrderList(user_id int)
BEGIN  
	SELECT o.*
FROM (
	select orders.ORDER_ID, orders.INVOICE_DATE, orders.TOTAL_PRICE, order_status_history.UPDATED_DATE, order_statuses.*
	from orders
	join order_status_history on orders.ORDER_ID = order_status_history.ORDER_ID
	join order_statuses on order_statuses.ORDER_STATUS_ID = order_status_history.ORDER_STATUS_ID
	where orders.BUYER_ID = user_id) AS o
	left join (
		select orders.ORDER_ID, orders.INVOICE_DATE, orders.TOTAL_PRICE, order_status_history.UPDATED_DATE, order_statuses.*
		from orders
		join order_status_history on orders.ORDER_ID = order_status_history.ORDER_ID
		join order_statuses on order_statuses.ORDER_STATUS_ID = order_status_history.ORDER_STATUS_ID
		where orders.BUYER_ID = user_id) as b
	on o.ORDER_ID = b.ORDER_ID and o.UPDATED_DATE < b.UPDATED_DATE
	where b.ORDER_STATUS_ID is NULL;
END//
DELIMITER ;
-- test
call getOrderList(15);

-- procedure get list name product in specific orderId
DELIMITER //
DROP PROCEDURE IF EXISTS getNameProductsOrder //
CREATE PROCEDURE 
  getNameProductsOrder(user_id int, order_id int)
BEGIN  
	select products.NAME
	from orders
	join orders_products on orders.ORDER_ID = orders_products.ORDER_ID
	join products on products.PRODUCT_ID = orders_products.PRODUCT_ID
	where orders.BUYER_ID = user_id and orders.ORDER_ID = order_id;
END//
DELIMITER ;
-- test
call getNameProductsOrder(15, 13);

select products.NAME
	from orders
	join orders_products on orders.ORDER_ID = orders_products.ORDER_ID
	join products on products.PRODUCT_ID = orders_products.PRODUCT_ID
	where orders.BUYER_ID = 15;


-- procedure get wish list via user_id
DELIMITER //
DROP PROCEDURE IF EXISTS getWishList //
CREATE PROCEDURE 
  getWishList( userId int)
BEGIN  
	select wishlist_products.PRODUCT_ID
	from wishlist
	join wishlist_products on wishlist.WISHLIST_ID = wishlist_products.WISHLIST_ID
    where wishlist.USER_ID = userId;
END//
DELIMITER ;
-- test
call getWishList (14);

-- procedure get products of wish list via user_id
DELIMITER //
DROP PROCEDURE IF EXISTS getProductsWishList //
CREATE PROCEDURE 
  getProductsWishList( userId int)
BEGIN  
	select products.*, images.PATH as IMAGE_PATH, images.DESCRIPTION as IMG_DESCRIPTION
	from wishlist
	join wishlist_products on wishlist.WISHLIST_ID = wishlist_products.WISHLIST_ID
	join products on products.PRODUCT_ID = wishlist_products.PRODUCT_ID
	join images on images.PRODUCT_ID = products.PRODUCT_ID
	where wishlist.USER_ID = userId and products.DELETED != 1
	group by wishlist_products.PRODUCT_ID;
END//
DELIMITER ;
-- test
call getProductsWishList (15);

-- procedure get order list of user for admin
DELIMITER //
DROP PROCEDURE IF EXISTS getAllOrderList //
CREATE PROCEDURE 
  getAllOrderList()
BEGIN  
	(select o.BUYER_ID as USER_ID, o.ORDER_ID, o.NOTE, o.TOTAL_PRICE, o.CUR_STATUS, order_s.NAME as CUR_STATUS_NAME, a.NAME, a.PHONE, a.ADDRESS, a.WARD, a.DISTRICT, a.CITY
	from orders AS o
	left join customers c on o.BUYER_ID = c.USER_ID
	join address a on a.ADDRESS_ID = o.ADDRESS_ID
    join order_statuses order_s on order_s.ORDER_STATUS_ID = o.CUR_STATUS)
    UNION
    (select o.BUYER_ID as USER_ID, o.ORDER_ID, o.NOTE, o.TOTAL_PRICE, o.CUR_STATUS, order_s.NAME as CUR_STATUS_NAME, a.NAME, a.PHONE, a.ADDRESS, a.WARD, a.DISTRICT, a.CITY
	from orders AS o
	join employees c on o.BUYER_ID = c.USER_ID
	join address a on a.ADDRESS_ID = o.ADDRESS_ID
    join order_statuses order_s on order_s.ORDER_STATUS_ID = o.CUR_STATUS)
	UNION
    (select o.BUYER_ID as USER_ID, o.ORDER_ID, o.NOTE, o.TOTAL_PRICE, o.CUR_STATUS, order_s.NAME as CUR_STATUS_NAME, a.NAME, a.PHONE, a.ADDRESS, a.WARD, a.DISTRICT, a.CITY
	from orders AS o
	join address a on a.ADDRESS_ID = o.ADDRESS_ID
    join order_statuses order_s on order_s.ORDER_STATUS_ID = o.CUR_STATUS);
END//
DELIMITER ;
-- test
call getAllOrderList();

-- procedure get order list of user for admin
DELIMITER //
DROP PROCEDURE IF EXISTS updateStatusOrder //
CREATE PROCEDURE 
  updateStatusOrder(user_id int, order_id int, status_code int, updated_at timestamp)
BEGIN  
	update orders
    set orders.CUR_STATUS = status_code
    where orders.BUYER_ID = user_id and orders.ORDER_ID = order_id;
    
    insert order_status_history(ORDER_ID, ORDER_STATUS_ID, UPDATED_DATE)
	values(order_id, status_code, updated_at);
    END//
DELIMITER ;
-- test
call updateStatusOrder(15, 14, 3, '2022-05-12 00:00:00');

-- procedure get order list of user for admin
DELIMITER //
DROP PROCEDURE IF EXISTS reportCommon //
CREATE PROCEDURE 
  reportCommon()
BEGIN
	select *
    from
	(select SUM(orders.TOTAL_PRICE) as INCOME
	from orders) as a,
    (select COUNT(orders.ORDER_ID) as TOTAL_ORDERS
	from orders) as b,
    (select COUNT(products.PRODUCT_ID) as TOTAL_PRODUCTS
	from products where products.DELETED != 1) as C,
    (select COUNT(IF(orders.CUR_STATUS = 2, orders.CUR_STATUS, null)) as WAIT_CONFIRM
	from orders) as D;
END//
DELIMITER ;
-- test
call reportCommon();

-- procedure update stock after buying
DELIMITER //
DROP PROCEDURE IF EXISTS updateStockAfterBuying //
CREATE PROCEDURE 
  updateStockAfterBuying(product_id int, quantity int)
BEGIN  
	update stock
    set stock.QUANTITY = stock.QUANTITY - quantity
    where stock.PRODUCT_ID = product_id;
END//
DELIMITER ;
-- test
call updateStockAfterBuying(1, 2);












