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
    phase_number varchar(255),
    amps varchar(255),
    AB varchar(255),
    latest_reading varchar(255),
    name_notes_detail varchar(255),
    kW_capacity varchar(255),
    kW_reading varchar(255),
    percent_of_breaker varchar(255)
);