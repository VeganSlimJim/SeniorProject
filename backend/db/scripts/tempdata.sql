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

create table ReportReadings(
    timestamp varchar(255),
    amps varchar(255),
    phase varchar(255),
    kw_capacity varchar(255)
);

create table Panels(
    name varchar(255),
    time_of_reading varchar(255),
    
);