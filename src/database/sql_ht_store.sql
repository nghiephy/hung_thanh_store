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
   USERNAME             varchar(255) unique,
   PASSWORD             text,
   ACTIVE               bool default true,
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

-- alter table USERS add constraint FK_EMPLOYEES_USERS2 foreign key (EMPLOYEE_ID)
--       references EMPLOYEES (EMPLOYEE_ID) on delete restrict on update restrict;

-- alter table USERS add constraint FK_RELATIONSHIP_19 foreign key (CUSTOMER_ID)
--       references CUSTOMERS (CUSTOMER_ID) on delete restrict on update restrict;

/*==============================================================*/
/* Add values for table categories                                                */
/*==============================================================*/
insert into categories(CAT_CATEGORY_ID, NAME, IMAGE, SLUG, BANNER, DESCRIPTION)
values
	(null, 'Đồ Dùng Học Sinh', '/img/category/do-dung-hoc-sinh.png', 'do-dung-hoc-sinh', '\img\banner\category\BANNER_DSHS_1200x250px.jpg', '<h3>Tổng Hợp Đồ Dùng Học Tập Cho Học Sinh Các Cấp</h3><p>Sắm đồ dùng học tập cho con luôn làm nhiều ba mẹ phải vắt óc suy nghĩ, nhất là những ai có con đầu lòng - còn nhiều bỡ ngỡ. Nắm được nỗi lo trên, Văn phòng phẩm FAST chuyên cung cấp tổng hợp các đồ dùng Giấy kiểm tra 4 ô ly Hòa bình - 1 lốc 200 tờ, Hộp Bút Simili Hình Cá Sấu 20x7x9cm, Hộp bút vải Pubg 20x7x9cm, Hộp bút vải có khóa mật mã 20x6x8cm, Bảng bộ học sinh Phi Mã - 2 mặt trắng đen (kèm bút lông + mút lau), Compa màu Hồng, Bút Chì Màu Deli 6518 Hộp Giấy - Kèm Cọ Tán Màu ( 24 màu)....</p>'),
    (null, 'Giấy In Ấn - Photo', '/img/category/giay-in-an-photo.png', 'giay-in-an---photo', '\img\banner\category\BANNER_PAPER_1200x250px.jpg', '<h3>Chuyên Cung Cấp Các Loại Giấy In, Giấy A4 Chất Lượng Chiết khấu Cao</h3><p>Đặc biệt, với các loại giấy in A4, vì đây là loại giấy phục vụ rất nhiều cho công việc in ấn trong văn phòng hiện nay. Vậy nên, khi chọn mua các loại giấy A4 dùng trong in ấn bạn cần biết tiêu chuẩn để có thể mua đúng loại giấy bạn cần dùng. Fast chuyên cung cấp các loại giấy in ấn Giấy A4 Excel 70 Gsm, Giấy A4 Double A 70 Gsm, Giấy in bill tính tiền 8F (80x45mm), Giấy kraft (tờ) size A0, Decal Tomy mũi tên - 1cm - hình vuông, Decal A3 đế xanh giấy nhám (xấp 100 tờ), Giấy in bill tính tiền 8F dầy đặc biệt (80x65mm), Giấy scan Gateway 73gsm A4 (250 tờ), Giấy A0 - tờ, Giấy Fort màu 80 A3 Gsm....</p>'),
    (null, 'Bìa - Kệ - Rỗ', '/img/category/ro-bia-ke.png', 'bia---ke---ro', null, 'Bìa Đựng Hồ Sơ - Kệ, Rổ - Hộp Cắm Bút Đa Dạng Mẫu Mã'),
    (null, 'Sổ - Tập - Bao Thư', '/img/category/so-tap-bao-thu.png', 'so---tap---bao-thu', null, 'Sổ - Tập - Namecard - Phiếu Thu Chi Giá Sĩ Giao Hàng Siêu Nhanh'),
    (null, 'Bút - Mực Chất Lượng Cao', '/img/category/but-muc-chat-luong-cao.png', 'but---muc-chat-luong-cao', null, 'Bút - Mực Văn Phòng Đa Dạng, Chất Lượng Hàng Đầu'),
    (null, 'Dụng Cụ Văn Phòng Chất Lượng', '/img/category/dung-cu-van-phong.png', 'dung-cu-van-phong-chat-luong', null, 'Dụng Cụ Văn Phòng Đẹp, Đa Dạng, Chất Lượng Uy Tín Giao Hàng Nhanh Chóng'),
    (null, 'Băng Keo - Dao - Kéo', '/img/category/bang-keo-dao-keo.png', 'bang-keo---dao-keo', null, 'Băng keo - Dao - Kéo - Bàn Cắt Giấy Chất Lượng Giá Tốt Nhất'),
    (null, 'Máy Tính Casio', '/img/category/may-tinh-casio.png', 'may-tinh-casio', '\img\banner\category\BANNER_CASIO_1200x250px.jpg', '<h3>Điểm Danh Các Dòng Máy Tính Casio Dành Cho Học Sinh Và Dân Văn Phòng</h3><p>Máy tính cầm tay hiện nay hỗ trợ rất tốt trong việc tính toán. Fast chuyên cung cấp các loại máy tính Casio Máy tính Casio MX 12B, Máy tính Casio AX 12B, Máy tính Casio AX 120B, Máy tính Deli 12 số 1239, Máy tính Casio GX 12B, MÁY TÍNH CASIO FX-500MS, MÁY TÍNH CASIO JW200SC - 6 MÀU....</p>'),
    (null, 'Bách Hoá Online', '/img/category/bach-hoa-online.png', 'bach-hoa-online', null, 'Bách Hoá Văn Phòng Giá Mẫu Mã Đa Dạng Giá Tốt Nhất'),
    (null, 'Bảng Văn Phòng', '/img/category/bang-van-phong.png', 'bang-van-phong', null, 'Bảng là loại văn phòng phẩm cực kỳ quen thuộc với chúng ta ngay từ khi còn ngồi trên ghế nhà trường. Những con chữ từ bảng vào tâm trí chúng ta từ lúc nhỏ cho đến khi làm việc tại các công ty, đoàn thể. Ngoài loại bảng dùng để viết hay học, hiện nay có rất nhiều biến thể đáp ứng nhiều mong muốn của người sử dụng. Hãy cùng Văn phòng phẩm FAST nghía qua nhé!'),
    (null, 'Dịch Vụ Khắc Dấu Uy Tín', '/img/category/dich-vu-khac-dau-uy-tin.png', 'dich-vu-khac-dau-uy-tin', null, 'Dịch Vụ Khắc Dấu Theo Yêu Cầu Nhanh, Giao Hàng Tận Nơi'),
    (null, 'Sản Phẩm Văn Phòng Khác', '/img/category/san-pham-van-phong-khac.png', 'san-pham-van-phong-khac', null, 'Các Danh Mục Sản Phẩm Văn Phòng Phẩm Khác Nhiều Mẫu Mã Mới Giá Tốt Nhất Hiện Nay');

-- Turn off sale mode before run below stament --
SET SQL_SAFE_UPDATES = 0;

-- Reset auto_increment = 1 --
set @autoid :=0; 
update users set user_id = @autoid := (@autoid+1);
alter table users Auto_Increment = 1;

-- Turn on sale mode after run above stament --
SET SQL_SAFE_UPDATES = 1;

/*==============================================================*/
/* Add values for table products                                                */
/*==============================================================*/
insert into products(CATEGORY_ID, NAME, SLUG, DESCRIPTION, BASIC_UNIT, PRICE_PER_UNIT, BRAND, ORIGIN)
values
	(1, 'Bút Sáp Màu Deli EC21000 - 12 màu', 'but-sap-mau-deli-ec21000---12-mau', 'Loại đầu bút: 1 cây / 1 màu ( hộp 12 màu )', 'Hộp', 61400, 'DELI', 'Trung Quốc'),
    (1, 'Bộ Cọ Vẽ Chuyên Nghiệp Deli 1 set / 6 Cây', 'bo-co-ve-chuyen-nghiep-deli-1-set---6-cay', null, 'Bộ', 155250, 'DELI', 'Trung Quốc'),
    (1, 'Bìa kê tay / bìa lót tập - quyển vở', 'bia-ke-tay---bia-lot-tap---quyen-vo', null, 'Cái', 7200, 'Đang cập nhật', 'Việt Nam'),
    (1, 'Sticker 60 miếng Con số - 5 xấp hình ngẫu nhiên', 'sticker-60-mieng-con-so---5-xap-hinh-ngau-nhien', null, 'Bộ', 160700, 'Đang cập nhật', 'Việt Nam'),
    (8, 'Máy tính Casio MX 120B', 'may-tinh-casio-mx-120b', null, 'Cái', 294000, 'Casio', 'Việt Nam'),
    (8, 'Máy tính Casio bỏ túi HL-815L - Đen', 'may-tinh-casio-bo-tui-hl-815l---den', null, 'Cái', 201600, 'Casio', 'Việt Nam'),
    (8, 'Máy tính Casio MX 12B - Hồng', 'may-tinh-casio-mx-12b---hong', null, 'Cái', 207500, 'Casio', 'Việt Nam'),
    (2, 'Giấy A4 Excel 70 Gsm', 'giay-a4-excel-70-gsm', null, 'Raem', 77400, 'Excel', 'Việt Nam');


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
	(1, '/img/products/but-sap-mau-deli.png', 'Bút Sáp Màu Deli EC21000 - 12 màu'),
    (2, '/img/products/bo-co-ve-chuyen-nghiep-deli.png', 'Bộ Cọ Vẽ Chuyên Nghiệp Deli 1 set / 6 Cây - 73885'),
    (3, '/img/products/bia-ke-tay-bia-lot-tap-quyen-vo-1.jpg', 'Bìa kê tay / bìa lót tập - quyển vở'),
    (3, '/img/products/bia-ke-tay-bia-lot-tap-quyen-vo-2.jpg', 'Bìa kê tay / bìa lót tập - quyển vở'),
    (4, '/img/products/sticker-60-mieng-con-so---5-xap-hinh-ngau-nhien-1.jpg', 'Sticker 60 miếng Con số - 5 xấp hình ngẫu nhiên'),
    (4, '/img/products/sticker-60-mieng-con-so---5-xap-hinh-ngau-nhien-2.jpg', 'Sticker 60 miếng Con số - 5 xấp hình ngẫu nhiên'),
    (5, '/img/products/may-tinh-casio-mx-120b-1.jfif', 'Máy tính Casio MX 120B'),
    (5, '/img/products/may-tinh-casio-mx-120b-2.png', 'Máy tính Casio MX 120B'),
    (6, '/img/products/may-tinh-bo-tui-casio-hl-815-1.jpg', 'Máy tính Casio bỏ túi HL-815L - Đen'),
    (6, '/img/products/may-tinh-bo-tui-casio-hl-815-2.jpg', 'Máy tính Casio bỏ túi HL-815L - Đen'),
    (7, '/img/products/may-tinh-casio-mx-12b-hong-1.png', 'Máy tính Casio MX 12B - Hồng'),
    (7, '/img/products/may-tinh-casio-mx-12b-hong-2.png', 'Máy tính Casio MX 12B - Hồng'),
    (7, '/img/products/may-tinh-casio-mx-12b-hong-3.png', 'Máy tính Casio MX 12B - Hồng'),
    (8, '/img/products/giay-a4-excel-70-gsm-1.png', 'Giấy A4 Excel 70 Gsm'),
    (8, '/img/products/giay-a4-excel-70-gsm-2.png', 'Giấy A4 Excel 70 Gsm');
    
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
where categories.name = 'Đồ Dùng Học Sinh';

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
    group by product_id;
END//
DELIMITER ;
-- test
call getProductViaCategory ('Đồ Dùng Học Sinh');

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
    group by product_id;
END//
DELIMITER ;
-- test
call getProductViaSlugCat ('do-dung-hoc-sinh');



