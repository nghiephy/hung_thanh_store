create database hung_thanh_bookstore;
use hung_thanh_bookstore;
ALTER DATABASE hung_thanh_bookstore CHARACTER SET utf8 COLLATE utf8_general_ci;
create table products(
	id_product int primary key auto_increment,
	name varchar(100) unique,
    image varchar(50),
    description varchar(200),
    basic_unit varchar(10),
	price_per_unit int,
    discount_id int,
    category_id int references category(id),
    brand varchar(100),
    origin varchar(100)
);

drop table products;
insert into products(name,image,description,basic_unit,price_per_unit,tax_percentage,expir_tax,category_id,active_for_sale)
values("Tập Học Sinh 4 Ô Ly 100 Trang ĐL 100g/m2 - Lớp Học Mật Ngữ",)

create table category(
	id_category int primary key auto_increment,
	name varchar(50) unique,
    description varchar(100),
	parent_category smallint references category(id)
);
truncate table category;
insert into category(name,parent_category) values('Tập học sinh',null),('Tập 5 ô ly',1),('Tập 4 ô ly',1),('Sách',null),('Sách giáo khoa',4),('Sách tham khảo',4);

create table stock(
	id_stock int primary key auto_increment,
    id_product int references product(id_product),
	in_stock int,
    last_update date
);