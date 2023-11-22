create table Readings(
    timestamp varchar(255),
    value varchar(255)
);

create table Users(
    user_id varchar(255) primary key,
    password varchar(255),
    email varchar (255),
    first_name varchar(255),
    last_name varchar(255),
    creation_date varchar(255)
);
