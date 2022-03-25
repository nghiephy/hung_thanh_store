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
   VALUE                text,
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
   BIRTHDAY             timestamp,
   EMAIL                text,
   GENDER               bool,
   PHOTO                text,
   SALARY               numeric(8,0),
   BONUS                float,
   POSITION             text,
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
   CUSTOMER_ID          int,
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
   CUSTOMER_ID          int,
   EMPLOYEE_ID          int,
   USERNAME             text,
   PASSWORD             text,
   ACTIVE               bool,
   USER_TYPE            text,
   CREATED_DATE         timestamp,
   primary key (USER_ID)
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

alter table ORDERS add constraint FK_ORDERS_CUSTOMERS foreign key (CUSTOMER_ID)
      references CUSTOMERS (CUSTOMER_ID) on delete restrict on update restrict;

alter table ORDERS add constraint FK_ORDERS_EMPLOYEES foreign key (EMPLOYEE_ID)
      references EMPLOYEES (EMPLOYEE_ID) on delete restrict on update restrict;

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

alter table USERS add constraint FK_EMPLOYEES_USERS2 foreign key (EMPLOYEE_ID)
      references EMPLOYEES (EMPLOYEE_ID) on delete restrict on update restrict;

alter table USERS add constraint FK_RELATIONSHIP_19 foreign key (CUSTOMER_ID)
      references CUSTOMERS (CUSTOMER_ID) on delete restrict on update restrict;

/*==============================================================*/
/* Add values for table categories                                                */
/*==============================================================*/
insert into categories(CAT_CATEGORY_ID, NAME, IMAGE, BANNER, DESCRIPTION)
values
	(null, 'Đồ Dùng Học Sinh', '/img/category/do-dung-hoc-sinh.png', '\img\banner\category\BANNER_DSHS_1200x250px.jpg', 'Tổng Hợp Đồ Dùng Học Tập Cho Học Sinh Các Cấp'),
    (null, 'Giấy In Ấn - Photo', '/img/category/giay-in-an-photo.png', null, 'Chuyên Cung Cấp Các Loại Giấy In, Giấy A4 Chất Lượng Chiết khấu Cao'),
    (null, 'Bìa - Kệ - Rỗ', '/img/category/ro-bia-ke.png', null, 'Bìa Đựng Hồ Sơ - Kệ, Rổ - Hộp Cắm Bút Đa Dạng Mẫu Mã'),
    (null, 'Sổ - Tập - Bao Thư', '/img/category/so-tap-bao-thu.png', null, 'Sổ - Tập - Namecard - Phiếu Thu Chi Giá Sĩ Giao Hàng Siêu Nhanh'),
    (null, 'Bút - Mực Chất Lượng Cao', '/img/category/but-muc-chat-luong-cao.png', null, 'Bút - Mực Văn Phòng Đa Dạng, Chất Lượng Hàng Đầu'),
    (null, 'Dụng Cụ Văn Phòng Chất Lượng', '/img/category/dung-cu-van-phong.png', null, 'Dụng Cụ Văn Phòng Đẹp, Đa Dạng, Chất Lượng Uy Tín Giao Hàng Nhanh Chóng'),
    (null, 'Băng Keo - Dao - Kéo', '/img/category/bang-keo-dao-keo.png', null, 'Băng keo - Dao - Kéo - Bàn Cắt Giấy Chất Lượng Giá Tốt Nhất'),
    (null, 'Máy Tính Casio', '/img/category/may-tinh-casio.png', '\img\banner\category\BANNER_CASIO_1200x250px.jpg', 'Điểm Danh Các Dòng Máy Tính Casio Dành Cho Học Sinh Và Dân Văn Phòng'),
    (null, 'Bách Hoá Online', '/img/category/bach-hoa-online.png', null, 'Bách Hoá Văn Phòng Giá Mẫu Mã Đa Dạng Giá Tốt Nhất'),
    (null, 'Bảng Văn Phòng', '/img/category/bang-van-phong.png', null, 'Bảng là loại văn phòng phẩm cực kỳ quen thuộc với chúng ta ngay từ khi còn ngồi trên ghế nhà trường. Những con chữ từ bảng vào tâm trí chúng ta từ lúc nhỏ cho đến khi làm việc tại các công ty, đoàn thể. Ngoài loại bảng dùng để viết hay học, hiện nay có rất nhiều biến thể đáp ứng nhiều mong muốn của người sử dụng. Hãy cùng Văn phòng phẩm FAST nghía qua nhé!'),
    (null, 'Dịch Vụ Khắc Dấu Uy Tín', '/img/category/dich-vu-khac-dau-uy-tin.png', null, 'Dịch Vụ Khắc Dấu Theo Yêu Cầu Nhanh, Giao Hàng Tận Nơi'),
    (null, 'Sản Phẩm Văn Phòng Khác', '/img/category/san-pham-van-phong-khac.png', null, 'Các Danh Mục Sản Phẩm Văn Phòng Phẩm Khác Nhiều Mẫu Mã Mới Giá Tốt Nhất Hiện Nay');

-- Reset auto_increment = 1 --
set @autoid :=0; 
update categories set category_id = @autoid := (@autoid+1);
alter table categories Auto_Increment = 1;

/*==============================================================*/
/* Add values for table products                                                */
/*==============================================================*/
insert into products(CATEGORY_ID, NAME, SLUG, DESCRIPTION, BASIC_UNIT, PRICE_PER_UNIT, BRAND, ORIGIN)
values
	(1, 'Bút Sáp Màu Deli EC21000 - 12 màu', null, 'Loại đầu bút: 1 cây / 1 màu ( hộp 12 màu )', 'Hộp', 61400, 'DELI', 'Trung Quốc'),
    (1, 'Bộ Cọ Vẽ Chuyên Nghiệp Deli 1 set / 6 Cây - 73885', null, null, 'Bộ', 155250, 'DELI', 'Trung Quốc'),
    (1, 'Bìa kê tay / bìa lót tập - quyển vở', null, null, 'Cái', 7200, 'Đang cập nhật', 'Việt Nam'),
    (1, 'Sticker 60 miếng Con số - 5 xấp hình ngẫu nhiên', null, null, 'Bộ', 160700, 'Đang cập nhật', 'Việt Nam'),
    (8, 'Máy tính Casio MX 120B', null, null, 'Cái', 294000, 'Casio', 'Việt Nam');


/*==============================================================*/
/* Add values for table stock                                                */
/*==============================================================*/
insert into stock(PRODUCT_ID, QUANTITY, CREATED_AT, MODIFIED_AT, DELETED_AT)
values
	(1, 100, '2022-03-25 00:00:01', null, null),
    (2, 500, '2022-03-25 00:00:55', null, null),
    (3, 400, '2022-03-25 00:01:55', null, null),
    (4, 300, '2022-04-25 00:03:55', null, null),
    (5, 300, '2022-04-25 00:04:55', null, null);


/*==============================================================*/
/* Add values for table images                                                */
/*==============================================================*/
insert into images(PRODUCT_ID, PATH, DESCRIPTION)
values
	(1, '/img/products/but-sap-mau-deli.png', 'Bút Sáp Màu Deli EC21000 - 12 màu'),
    (2, '/img/products/bo-co-ve-chuyen-nghiep-deli.png', 'Bộ Cọ Vẽ Chuyên Nghiệp Deli 1 set / 6 Cây - 73885'),
    (3, '/img/products/bia-ke-tay-bia-lot-tap-quyen-vo-1.jpg', 'Bìa kê tay / bìa lót tập - quyển vở'),
    (3, '/img/products/bia-ke-tay-bia-lot-tap-quyen-vo-2.jpg', 'Bìa kê tay / bìa lót tập - quyển vở'),
    (4, '/img/products/sticker-60-mieng-con-so---5-xap-hinh-ngau-nhien-1.jpg', 'Sticker 60 miếng Con số - 5 xấp hình ngẫu nhiên'),
    (4, '/img/products/sticker-60-mieng-con-so---5-xap-hinh-ngau-nhien-2.jpg', 'Sticker 60 miếng Con số - 5 xấp hình ngẫu nhiên'),
    (5, '/img/products/may-tinh-casio-mx-120b-1.jfif', 'Máy tính Casio MX 120B'),
    (5, '/img/products/may-tinh-casio-mx-120b-2.png', 'Máy tính Casio MX 120B');


-- Define Function --
delimiter $$
CREATE FUNCTION `isHaveEnoughMoney` ( id_customer int, minusMoney int)
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

