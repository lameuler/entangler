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
    email       varchar(64) not null,
    is_member   boolean     not null default false,
    is_manager  boolean     not null default false
);

create table team (
    t_id        binary(16)  primary key,
    owner_id    char(36)    not null,
    name        varchar(50) not null,
    public      boolean     not null default false,
    favourites  int         default 0,
    description varchar(150),
    details     text,
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
    status      int         not null default 0,
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
('636c9342-e0ce-47e8-aa23-4fc2e0eceef1', 'LAM EU LER', 'h1910074@nushigh.edu.sg'), -- very not real people
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

insert into favourite (u_id, t_id) values
('636c9342-e0ce-47e8-aa23-4fc2e0eceef1', 'tUB7ZVuLhgxTP4Vd'),
('636c9342-e0ce-47e8-aa23-4fc2e0eceef1', 'e-xiAHoLpp0QiIqJ'),
('636c9342-e0ce-47e8-aa23-4fc2e0eceef1', 'gzka8x6v1sHM-0Dz'),
('94f4ec08-49a0-4bf0-8657-5bcf939d61b5', 'tUB7ZVuLhgxTP4Vd'),
('1f95f196-fa89-400a-982b-17d01b7fb554', 'tUB7ZVuLhgxTP4Vd'),
('f6e3fbb6-8199-43a9-85b7-41d0744266c1', 'e-xiAHoLpp0QiIqJ');

insert into member (u_id, t_id) values
('636c9342-e0ce-47e8-aa23-4fc2e0eceef1', 'tUB7ZVuLhgxTP4Vd'),
('d50b038d-2521-4300-948d-f3d4ca79cd63', 'tUB7ZVuLhgxTP4Vd'),
('79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', 'tUB7ZVuLhgxTP4Vd'),
('52c4eabf-89bb-45ac-aca7-29797afdde36', 'tUB7ZVuLhgxTP4Vd'),
('30b59dc0-02a5-441a-9afc-58fd4ba34b93', 'e-xiAHoLpp0QiIqJ'),
('eb00f5ec-78a4-4630-b71c-29185919ef5a', 'e-xiAHoLpp0QiIqJ'),
('eb00f5ec-78a4-4630-b71c-29185919ef5a', 'eCNWfCKg_km0KdgQ'),
('30b59dc0-02a5-441a-9afc-58fd4ba34b93', 'tUB7ZVuLhgxTP4Vd'),
('1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', 'tUB7ZVuLhgxTP4Vd');

insert into manager (u_id, t_id) values
('d50b038d-2521-4300-948d-f3d4ca79cd63', 'tUB7ZVuLhgxTP4Vd'),
('79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', 'tUB7ZVuLhgxTP4Vd'),
('52c4eabf-89bb-45ac-aca7-29797afdde36', 'tUB7ZVuLhgxTP4Vd'),
('30b59dc0-02a5-441a-9afc-58fd4ba34b93', 'e-xiAHoLpp0QiIqJ'),
('eb00f5ec-78a4-4630-b71c-29185919ef5a', 'eCNWfCKg_km0KdgQ'),
('30b59dc0-02a5-441a-9afc-58fd4ba34b93', 'tUB7ZVuLhgxTP4Vd'),
('1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', 'tUB7ZVuLhgxTP4Vd'),
('636c9342-e0ce-47e8-aa23-4fc2e0eceef1', 'tUB7ZVuLhgxTP4Vd');

insert into request (req_id, t_id, u_id, date, name, description, committee, note, status) values
('1y0o4u3oqkx7ro49', 'tUB7ZVuLhgxTP4Vd', '636c9342-e0ce-47e8-aa23-4fc2e0eceef1', '2023-12-15 01:02:03', 'Orientation 2024 Storyline and Finale', 'Storyling skit and finale skit+dances', 'Orientation Finale Decor Committee', 'ask IC for updated script', 2),
('nUYKzbv6zUG8ZCBt', 'tUB7ZVuLhgxTP4Vd', '94f4ec08-49a0-4bf0-8657-5bcf939d61b5', '2024-2-23 12:34:56', 'Positivitea Week', 'Positivitea booth at canteen w music and kahoot', 'Positivitea', null, 0),
('1aG4CkSWfz9Nw7zF', 'gzka8x6v1sHM-0Dz', '636c9342-e0ce-47e8-aa23-4fc2e0eceef1', '2024-3-5 21:08:47', 'CM6131 Task 3 Group 1', 'Demonstration', 'M24604', null, 0),
('EfKqpX-MBvkzVvu-', 'tUB7ZVuLhgxTP4Vd', 'eb00f5ec-78a4-4630-b71c-29185919ef5a', '2024-2-27 00:00:09', 'Secret event', null, null, null, 2),
('IusWqdszqWXJh8KW', 'tUB7ZVuLhgxTP4Vd', 'a03f51f2-54cf-4803-97af-0b5986fc7ae5', '2023-12-25 00:00:00', 'Orientation 2024 Activities', 'Mass dance, briefings with slides', 'Orientation Core Team', null, 0),
('DEMO1-szqWXJh8KW', 'gzka8x6v1sHM-0Dz', '79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', '2024-2-15 11:11:11', 'Chem Task 3', 'Demo', 'M24601', null, 0),
('DEMO2-szqWXJh8KW', 'tUB7ZVuLhgxTP4Vd', '79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', '2024-2-15 11:11:11', 'Testing', 'Testing 123', 'Media Club', null, 0);

insert into req_date (req_id, start, end, description) values
('1y0o4u3oqkx7ro49', '2024-01-02 08:30:00', '2024-01-02 09:00:00', 'Day 1 AM'),
('1y0o4u3oqkx7ro49', '2024-01-02 15:00:00', '2024-01-02 15:30:00', 'Day 1 PM'),
('1y0o4u3oqkx7ro49', '2024-01-03 08:00:00', '2024-01-03 08:30:00', 'Day 2 AM'),
('1y0o4u3oqkx7ro49', '2024-01-03 14:00:00', '2024-01-03 14:30:00', 'Day 2 PM'),
('1y0o4u3oqkx7ro49', '2024-01-02 18:30:00', '2024-01-02 20:30:00', 'Finale'),
('nUYKzbv6zUG8ZCBt', '2024-02-28 10:00:00', '2024-02-28 14:00:00', null),
('nUYKzbv6zUG8ZCBt', '2024-02-29 10:00:00', '2024-02-29 14:00:00', null),
('1aG4CkSWfz9Nw7zF', '2024-03-19 08:00:00', '2024-03-19 10:00:00', 'Practice session'),
('1aG4CkSWfz9Nw7zF', '2024-03-28 08:00:00', '2024-03-28 10:00:00', 'Presentation session'),
('EfKqpX-MBvkzVvu-', '2024-02-27 13:00:00', '2024-02-28 13:00:00', null),
('EfKqpX-MBvkzVvu-', '2024-02-28 13:00:00', '2024-02-29 13:00:00', null),
('IusWqdszqWXJh8KW', '2024-01-04 08:00:00', '2024-01-04 18:30:00', 'Day 3'),
('IusWqdszqWXJh8KW', '2024-01-04 20:30:00', '2024-01-04 21:30:00', 'Day 3 Debrief');

insert into deployment (dep_id, req_id, t_id, start, end, creator_id, create_date, approver_id, approve_date, note) values
('P2P7GMMA3DB4aOKY', '1y0o4u3oqkx7ro49', 'tUB7ZVuLhgxTP4Vd', '2024-01-02 08:30:00', '2024-01-02 09:00:00', '79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', '2023-12-20', '8f2512c4-c35f-4386-998b-e582f09a9dc3', '2023-12-23', 'Day 1 AM'),
('tN3El8CP-pkDZFas', '1y0o4u3oqkx7ro49', 'tUB7ZVuLhgxTP4Vd', '2024-01-02 15:00:00', '2024-01-02 15:30:00', '79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', '2023-12-20', '8f2512c4-c35f-4386-998b-e582f09a9dc3', '2023-12-23', 'Day 1 PM'),
('5EDC98LoMsViRQ2-', '1y0o4u3oqkx7ro49', 'tUB7ZVuLhgxTP4Vd', '2024-01-03 08:00:00', '2024-01-03 08:30:00', '79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', '2023-12-20', '8f2512c4-c35f-4386-998b-e582f09a9dc3', '2023-12-23', 'Day 2 AM'),
('MnJDRcvMmBWuRw-h', '1y0o4u3oqkx7ro49', 'tUB7ZVuLhgxTP4Vd', '2024-01-03 14:00:00', '2024-01-03 14:30:00', '79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', '2023-12-20', '8f2512c4-c35f-4386-998b-e582f09a9dc3', '2023-12-23', 'Day 2 PM'),
('HUUOGMhVP0MOJeOS', '1y0o4u3oqkx7ro49', 'tUB7ZVuLhgxTP4Vd', '2024-01-04 17:00:00', '2024-01-04 20:30:00', '79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', '2023-12-20', '8f2512c4-c35f-4386-998b-e582f09a9dc3', '2023-12-23', 'Finale'),
('Ha0ZrmEtewUQFox5', 'nUYKzbv6zUG8ZCBt', 'tUB7ZVuLhgxTP4Vd', '2024-02-28 10:00:00', '2024-02-28 14:00:00', '1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', '2024-2-23', null, null, null),
('KVjK8YV80moO-6CT', 'nUYKzbv6zUG8ZCBt', 'tUB7ZVuLhgxTP4Vd', '2024-02-29 10:00:00', '2024-02-29 14:00:00', '1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', '2024-2-23', null, null, null),
('3XW3_ElA6FFLW1F4', 'EfKqpX-MBvkzVvu-', 'tUB7ZVuLhgxTP4Vd', '2024-02-28 00:00:00', '2024-02-28 11:00:00', '1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', '2024-2-27', '30b59dc0-02a5-441a-9afc-58fd4ba34b93', '2024-2-27', null),
('YEA3XsvfxRAXLpXd', 'EfKqpX-MBvkzVvu-', 'tUB7ZVuLhgxTP4Vd', '2024-02-28 13:00:00', '2024-02-29 13:00:00', '1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', '2024-2-27', '30b59dc0-02a5-441a-9afc-58fd4ba34b93', '2024-2-27', null),
('9xnJPr7Pzj3W0yYF', 'IusWqdszqWXJh8KW', 'tUB7ZVuLhgxTP4Vd', '2024-01-04 08:00:00', '2024-01-04 18:30:00', '1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', '2023-12-19', null, null, null),
('g-mUc5gCaL0_jCTA', 'IusWqdszqWXJh8KW', 'tUB7ZVuLhgxTP4Vd', '2024-01-04 20:30:00', '2024-01-04 21:30:00', '1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', '2023-12-19', null, null, null);

insert into item (item, t_id, count, visible, description, category) values
('Bose S1 Pro', 'tUB7ZVuLhgxTP4Vd', 2, true, 'Portable bluetooth speaker', 'Speakers'),
('Bose S1 Pro + Microphone', 'tUB7ZVuLhgxTP4Vd', 2, true, 'Portable bluetooth speaker and wired microphone', 'Speakers'),
('Senrun', 'tUB7ZVuLhgxTP4Vd', 2, true, 'Luggage speaker with microphone', 'Speakers'),
('Prism+ TV', 'tUB7ZVuLhgxTP4Vd', 2, true, 'Big TV (movable on wheels)', null),
('Beaker (100mL)', 'gzka8x6v1sHM-0Dz', 81, true, null, 'Glassware'),
('Beaker (250mL)', 'gzka8x6v1sHM-0Dz', 65, true, null, 'Glassware'),
('Beaker (600mL)', 'gzka8x6v1sHM-0Dz', 39, true, null, 'Glassware'),
('Bunsen burner', 'gzka8x6v1sHM-0Dz', 40, true, null, 'Heating'),
('Lighter (spark)', 'gzka8x6v1sHM-0Dz', 46, true, null, 'Heating'),
('Hot plate with magnetic stirrer', 'gzka8x6v1sHM-0Dz', 27, true, null, 'Heating'),
('Crucible tongs', 'gzka8x6v1sHM-0Dz', 28, true, 'Stainless steel', 'Heating');

insert into service (service, t_id, visible, description, category) values
('Photo', 'tUB7ZVuLhgxTP4Vd', true, null, null),
('Video', 'tUB7ZVuLhgxTP4Vd', true, null, null),
('AV', 'tUB7ZVuLhgxTP4Vd', true, null, null),
('Livestream', 'tUB7ZVuLhgxTP4Vd', false, null, null);

insert into item_req (req_id, item, t_id, count) values
('nUYKzbv6zUG8ZCBt', 'Prism+ TV', 'tUB7ZVuLhgxTP4Vd', 1),
('nUYKzbv6zUG8ZCBt', 'Bose S1 Pro', 'tUB7ZVuLhgxTP4Vd', 2),
('1aG4CkSWfz9Nw7zF', 'Beaker (250mL)', 'gzka8x6v1sHM-0Dz', 2),
('1aG4CkSWfz9Nw7zF', 'Bunsen burner', 'gzka8x6v1sHM-0Dz', 1),
('1aG4CkSWfz9Nw7zF', 'Lighter (spark)', 'gzka8x6v1sHM-0Dz', 1),
('1aG4CkSWfz9Nw7zF', 'Hot plate with magnetic stirrer', 'gzka8x6v1sHM-0Dz', 1),
('1aG4CkSWfz9Nw7zF', 'Crucible tongs', 'gzka8x6v1sHM-0Dz', 2),
('EfKqpX-MBvkzVvu-', 'Bose S1 Pro', 'tUB7ZVuLhgxTP4Vd', 2);

insert into service_req (req_id, service, t_id) values
('1y0o4u3oqkx7ro49', 'Photo', 'tUB7ZVuLhgxTP4Vd'),
('1y0o4u3oqkx7ro49', 'Video', 'tUB7ZVuLhgxTP4Vd'),
('1y0o4u3oqkx7ro49', 'AV', 'tUB7ZVuLhgxTP4Vd'),
('IusWqdszqWXJh8KW', 'AV', 'tUB7ZVuLhgxTP4Vd');

insert into item_dep (dep_id, item, t_id, count, note) values
('Ha0ZrmEtewUQFox5', 'Prism+ TV', 'tUB7ZVuLhgxTP4Vd', 1, 'get from IT'),
('Ha0ZrmEtewUQFox5', 'Bose S1 Pro', 'tUB7ZVuLhgxTP4Vd', 1, 'Bose 1'),
('KVjK8YV80moO-6CT', 'Prism+ TV', 'tUB7ZVuLhgxTP4Vd', 1, 'get from IT'),
('KVjK8YV80moO-6CT', 'Bose S1 Pro', 'tUB7ZVuLhgxTP4Vd', 1, 'Bose 2'),
('3XW3_ElA6FFLW1F4', 'Bose S1 Pro', 'tUB7ZVuLhgxTP4Vd', 2, null),
('YEA3XsvfxRAXLpXd', 'Bose S1 Pro', 'tUB7ZVuLhgxTP4Vd', 1, null);

insert into service_dep (dep_id, service, t_id, u_id, role) values
('P2P7GMMA3DB4aOKY', 'AV', 'tUB7ZVuLhgxTP4Vd', '79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', 'IC'),
('P2P7GMMA3DB4aOKY', 'AV', 'tUB7ZVuLhgxTP4Vd', '30b59dc0-02a5-441a-9afc-58fd4ba34b93', 'Lights'),
('P2P7GMMA3DB4aOKY', 'AV', 'tUB7ZVuLhgxTP4Vd', '1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', 'Sound'),
('HUUOGMhVP0MOJeOS', 'Photo', 'tUB7ZVuLhgxTP4Vd', '52c4eabf-89bb-45ac-aca7-29797afdde36', 'Finale'),
('HUUOGMhVP0MOJeOS', 'Video', 'tUB7ZVuLhgxTP4Vd', '8f2512c4-c35f-4386-998b-e582f09a9dc3', 'Static cam'),
('HUUOGMhVP0MOJeOS', 'AV', 'tUB7ZVuLhgxTP4Vd', '79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', 'IC'),
('HUUOGMhVP0MOJeOS', 'AV', 'tUB7ZVuLhgxTP4Vd', '30b59dc0-02a5-441a-9afc-58fd4ba34b93', 'Lights'),
('HUUOGMhVP0MOJeOS', 'AV', 'tUB7ZVuLhgxTP4Vd', '1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', 'Sound'),
('9xnJPr7Pzj3W0yYF', 'AV', 'tUB7ZVuLhgxTP4Vd', 'd50b038d-2521-4300-948d-f3d4ca79cd63', 'Roamer'),
('g-mUc5gCaL0_jCTA', 'AV', 'tUB7ZVuLhgxTP4Vd', 'd50b038d-2521-4300-948d-f3d4ca79cd63', 'Slide');

insert into can_serve (u_id, service, t_id) values
('52c4eabf-89bb-45ac-aca7-29797afdde36', 'Photo', 'tUB7ZVuLhgxTP4Vd'),
('8f2512c4-c35f-4386-998b-e582f09a9dc3', 'Photo', 'tUB7ZVuLhgxTP4Vd'),
('8f2512c4-c35f-4386-998b-e582f09a9dc3', 'Video', 'tUB7ZVuLhgxTP4Vd'),
('8f2512c4-c35f-4386-998b-e582f09a9dc3', 'AV', 'tUB7ZVuLhgxTP4Vd'),
('79be1b8f-9b5c-4f78-9aea-85a2bde41e1f', 'AV', 'tUB7ZVuLhgxTP4Vd'),
('30b59dc0-02a5-441a-9afc-58fd4ba34b93', 'AV', 'tUB7ZVuLhgxTP4Vd'),
('1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89', 'AV', 'tUB7ZVuLhgxTP4Vd'),
('636c9342-e0ce-47e8-aa23-4fc2e0eceef1', 'AV', 'tUB7ZVuLhgxTP4Vd'),
('d50b038d-2521-4300-948d-f3d4ca79cd63', 'AV', 'tUB7ZVuLhgxTP4Vd');

delimiter //
create procedure userteams(in u_id char(36), in id_handle varchar(16), in is_public boolean, in is_fav boolean, in is_role int)
begin
    select t_id, name, description, details, handle, public, favourites,
        exists(select true from favourite f where f.t_id=t.t_id and f.u_id=u_id) fav,
        case
            when owner_id=u_id then 3
            when exists(select true from manager m where m.u_id=u_id and m.t_id=t.t_id) then 2
            when exists(select true from member m where m.u_id=u_id and m.t_id=t.t_id) then 1
            else 0
        end role
    from team t
    having (public or fav or role or id_handle is not null)
    and (id_handle is null or t_id = id_handle or handle = id_handle)
    and (is_public is null or is_public = public)
    and (is_fav is null or is_fav = fav)
    and (is_role is null or is_role <= role);
end//

create procedure userrequests(in u_id char(36), in t_id binary(16), in creator char(36), in managed boolean, in is_status int)
begin
    select r.*, t.name team
    from request r, team t
    where r.t_id = t.t_id
    and (t_id is null or r.t_id=t_id)
    and (creator is null or r.u_id=creator)
    and (is_status is null or r.status=is_status)
    and (((managed is null or managed=true) and exists(select * from manager m where m.u_id=u_id and m.t_id=r.t_id))
        or ((managed is null or managed=false) and r.u_id=u_id));
end//

create procedure userdeployments(in u_id char(36), in t_id binary(16), in req_id binary(16), in is_approved int)
begin
    select d.*, t.name team, r.name request
    from deployment d, team t, request r
    where d.t_id = t.t_id and d.req_id = r.req_id
    and (t_id is null or d.t_id=t_id)
    and (req_id is null or d.req_id=req_id)
    and (is_approved is null or (d.approver_id is not null)=is_approved)
    and (exists(select * from manager m where m.u_id=u_id and m.t_id=d.t_id)
        or u_id in (select s.u_id from service_dep s where s.dep_id=d.dep_id));
end//

delimiter ;