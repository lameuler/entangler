create table ikea (
    name varchar(30) primary key,
    cost float,
    stock int
);
insert into ikea values
('Blahaj', 10.9, 29);

create table user (
    u_id        char(36)    primary key,
    name        varchar(64) not null,
    email       varchar(64) not null 
);

create table team (
    t_id        binary(16)  primary key,
    owner_id    char(36)    not null,
    name        varchar(50) not null,
    public      boolean     not null default false,
    favourites  int         default 0,
    description varchar(150),
    details     varchar(1000),
    handle      varchar(15) unique,
    foreign key (owner_id) references user(u_id) on delete cascade
);

create table favourite (
    u_id        char(36),
    t_id        binary(16),
    primary key (u_id, t_id),
    foreign key (u_id) references user(u_id) on delete cascade,
    foreign key (t_id) references team(t_id) on delete cascade
);

create table member (
    u_id        char(36),
    t_id        binary(16),
    primary key (u_id, t_id),
    foreign key (u_id) references user(u_id) on delete cascade,
    foreign key (t_id) references team(t_id) on delete cascade
);

create table manager (
    u_id        char(36),
    t_id        binary(16),
    primary key (u_id, t_id),
    foreign key (u_id) references user(u_id) on delete cascade,
    foreign key (t_id) references team(t_id) on delete cascade
);

create table request (
    req_id      binary(16) primary key,
    t_id        binary(16) not null,
    u_id        char(36) not null,
    date        datetime not null,
    name        varchar(50),
    description varchar(150),
    committee   varchar(50),
    note        varchar(150),
    status      varchar(50),
    foreign key (t_id) references team(t_id) on delete cascade,
    foreign key (u_id) references user(u_id) on delete cascade
);

create table deployment (
    dep_id      binary(16) primary key,
    req_id      binary(16) not null,
    t_id        binary(16) not null,
    start       datetime not null,
    end         datetime not null,
    creator_id  char(36) not null,
    create_date datetime not null,
    approver_id char(36),
    approve_date datetime,
    note varchar(150),
    foreign key (req_id) references request(req_id) on delete cascade,
    foreign key (t_id) references team(t_id) on delete cascade,
    foreign key (creator_id) references user(u_id) on delete cascade,
    foreign key (approver_id) references user(u_id) on delete set null
);

create table req_date (
    req_id      binary(16),
    start       datetime,
    end         datetime,
    description varchar(150),
    primary key (req_id, start, end),
    foreign key (req_id) references request(req_id) on delete cascade
);

create table item (
    item        varchar(50),
    t_id        binary(16),
    count       int,
    visible     boolean,
    description varchar(150),
    category    varchar(50),
    primary key (item, t_id),
    foreign key (t_id) references team(t_id) on delete cascade
);

create table service (
    service     varchar(50),
    t_id        binary(16),
    visible     boolean,
    description varchar(150),
    category    varchar(50),
    primary key (service, t_id),
    foreign key (t_id) references team(t_id) on delete cascade
);

create table service_req (
    req_id      binary(16),
    service     varchar(50),
    t_id        binary(16),
    primary key (req_id, service, t_id),
    foreign key (req_id) references request(req_id) on delete cascade,
    foreign key (service, t_id) references service(service, t_id) on delete cascade
);

create table item_req (
    req_id      binary(16),
    item        varchar(50),
    t_id        binary(16),
    count int,
    primary key (req_id, item, t_id),
    foreign key (req_id) references request(req_id) on delete cascade,
    foreign key (item, t_id) references item(item, t_id) on delete cascade
);

create table service_dep (
    dep_id      binary(16),
    u_id        char(36),
    service     varchar(50) not null,
    t_id        binary(16) not null,
    role        varchar(100),
    primary key (dep_id, u_id),
    foreign key (dep_id) references deployment(dep_id) on delete cascade,
    foreign key (u_id) references user(u_id) on delete cascade,
    foreign key (service, t_id) references service(service, t_id) on delete cascade
);

create table item_dep (
    dep_id      binary(16),
    item        varchar(50),
    t_id        binary(16),
    count       int,
    note        varchar(150),
    primary key (dep_id, item, t_id),
    foreign key (dep_id) references deployment(dep_id) on delete cascade,
    foreign key (item, t_id) references item(item, t_id) on delete cascade
);

create table can_serve (
    u_id        char(36),
    service     varchar(50),
    t_id        binary(16),
    primary key (u_id, service, t_id),
    foreign key (u_id) references user(u_id) on delete cascade,
    foreign key (service, t_id) references service(service, t_id) on delete cascade
);

insert into user (u_id, name, email) values
('d145778f-369e-405d-af21-7854a8511d8e', 'LAM EU LER', 'h1910074@nushigh.edu.sg'), -- very not real people
('79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', 'CHIA SHENGJUN RYAN', 'h1910018@nushigh.edu.sg'),
('30b59dc0-02a5-441a-9afc-58fd4ba34b93', 'CHIN QIAO QI', 'h210036@nushigh.edu.sg'),
('1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', 'YONG ZHE DIAN', 'h210170@nushigh.edu.sg'),
('52c4eabf-89bb-45ac-aca7-29797afdde36', 'ANG E HERNG AYDEN', 'h1910009@nushigh.edu.sg'),
('94f4ec08-49a0-4bf0-8657-5bcf939d61b5', 'HUANG YUEBIN', 'h1910045@nushigh.edu.sg'),
('eb00f5ec-78a4-4630-b71c-29185919ef5a', 'Leonhard Euler', 'euler@u.nus.edu'),
('8f2512c4-c35f-4386-998b-e582f09a9dc3', 'Media Club', 'media@nushigh.edu.sg'),
('d50b038d-2521-4300-948d-f3d4ca79cd63', 'NUS High School IT', 'nhsit@nushigh.edu.sg'),
('1f95f196-fa89-400a-982b-17d01b7fb554', 'nobody', 'nobody@nushigh.edu.sg'),
('f6e3fbb6-8199-43a9-85b7-41d0744266c1', 'somebody', 'somebody@nushigh.edu.sg'),
('47f817c4-4a33-4f8b-abd5-0f23199dbef1', 'Chemistry Department', 'chem@nushigh.edu.sg'),
('a03f51f2-54cf-4803-97af-0b5986fc7ae5', 'NUS High Orientation', 'orientation@nushigh.edu.sg'),
('f2519a85-3e2a-4f2a-aac4-4305b8a84b6b', 'PE Dept', 'pe@nushigh.edu.sg');

insert into team (t_id, owner_id, name, public, description, handle) values
('tUB7ZVuLhgxTP4Vd', 'd50b038d-2521-4300-948d-f3d4ca79cd63', 'Media Club Requisition Form', true, 'Service requisition and equipment loan from Media Club', 'mediareq'),
('gzka8x6v1sHM-0Dz', '47f817c4-4a33-4f8b-abd5-0f23199dbef1', 'Chemistry Lab Requisition', true, 'Chemistry Lab equipment requisition for lab sessions', 'chemlab'),
('4WLOHHvjAykoZlPo', 'f2519a85-3e2a-4f2a-aac4-4305b8a84b6b', 'PE Dept Equipment Loan', true, 'Request for PE equipment for games and exercise', 'pe_loan'),
('e-xiAHoLpp0QiIqJ', '30b59dc0-02a5-441a-9afc-58fd4ba34b93', "OT'24 Logs", false, null, 'o24logs'),
('eCNWfCKg_km0KdgQ', 'eb00f5ec-78a4-4630-b71c-29185919ef5a', 'Math tutoring by famous mathematician', false, 'Learn from the best', null);

delimiter $/$/$
create procedure userteams(in u_id char(36))
begin
    select * from (select t_id, name, description, public, favourites,
        exists(select true from favourite f where f.t_id=t.t_id and f.u_id=u_id) is_fav,
        case
            when owner_id=u_id then 'Owner'
            when exists(select true from manager m where m.u_id=u_id and m.t_id=t.t_id) then 'Manager'
            when exists(select true from member m where m.u_id=u_id and m.t_id=t.t_id) then 'Member'
            else null
        end role
    from team t) data
    where public or is_fav or role;
end$/$/$
delimiter ;