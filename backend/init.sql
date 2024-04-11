set global time_zone = '+00:00';
set time_zone = "+00:00";

create table user (
    u_id        char(36)    primary key,
    name        varchar(64) not null,
    email       varchar(64) not null,
    is_member   boolean     not null default false,
    is_manager  boolean     not null default false
);

create table team (
    t_id        binary(10)  primary key,
    owner_id    char(36)    not null,
    name        varchar(50) not null,
    public      boolean     not null default false,
    favourites  int         default 0,
    description varchar(150),
    details     text,
    handle      varchar(20) unique,
    foreign key (owner_id) references user(u_id) on delete cascade
);

create table favourite (
    u_id        char(36),
    t_id        binary(10),
    primary key (u_id, t_id),
    foreign key (u_id) references user(u_id) on delete cascade,
    foreign key (t_id) references team(t_id) on delete cascade
);

create table member (
    u_id        char(36),
    t_id        binary(10),
    primary key (u_id, t_id),
    foreign key (u_id) references user(u_id) on delete cascade,
    foreign key (t_id) references team(t_id) on delete cascade
);

create table manager (
    u_id        char(36),
    t_id        binary(10),
    primary key (u_id, t_id),
    foreign key (u_id) references user(u_id) on delete cascade,
    foreign key (t_id) references team(t_id) on delete cascade
);

create table request (
    req_id      binary(10) primary key,
    t_id        binary(10) not null,
    u_id        char(36) not null,
    date        datetime not null,
    name        varchar(50),
    description varchar(500),
    committee   varchar(50),
    note        varchar(150),
    status      int         not null default 0,
    foreign key (t_id) references team(t_id) on delete cascade,
    foreign key (u_id) references user(u_id) on delete cascade
);

create table deployment (
    dep_id      binary(10) primary key,
    req_id      binary(10) not null,
    t_id        binary(10) not null,
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
    req_id      binary(10),
    start       datetime,
    end         datetime,
    description varchar(150) default '',
    primary key (req_id, start, end, description),
    foreign key (req_id) references request(req_id) on delete cascade
);

create table item (
    item        varchar(50),
    t_id        binary(10),
    count       int,
    visible     boolean,
    description varchar(150),
    category    varchar(50),
    primary key (item, t_id),
    foreign key (t_id) references team(t_id) on delete cascade
);

create table service (
    service     varchar(50),
    t_id        binary(10),
    visible     boolean,
    description varchar(150),
    category    varchar(50),
    primary key (service, t_id),
    foreign key (t_id) references team(t_id) on delete cascade
);

create table service_req (
    req_id      binary(10),
    service     varchar(50),
    t_id        binary(10),
    primary key (req_id, service, t_id),
    foreign key (req_id) references request(req_id) on delete cascade,
    foreign key (service, t_id) references service(service, t_id) on delete cascade
);

create table item_req (
    req_id      binary(10),
    item        varchar(50),
    t_id        binary(10),
    count int,
    primary key (req_id, item, t_id),
    foreign key (req_id) references request(req_id) on delete cascade,
    foreign key (item, t_id) references item(item, t_id) on delete cascade
);

create table service_dep (
    dep_id      binary(10),
    u_id        char(36),
    service     varchar(50) not null,
    t_id        binary(10) not null,
    role        varchar(100),
    primary key (dep_id, u_id),
    foreign key (dep_id) references deployment(dep_id) on delete cascade,
    foreign key (u_id) references user(u_id) on delete cascade,
    foreign key (service, t_id) references service(service, t_id) on delete cascade
);

create table item_dep (
    dep_id      binary(10),
    item        varchar(50),
    t_id        binary(10),
    count       int,
    note        varchar(150),
    primary key (dep_id, item, t_id),
    foreign key (dep_id) references deployment(dep_id) on delete cascade,
    foreign key (item, t_id) references item(item, t_id) on delete cascade
);

create table can_serve (
    u_id        char(36),
    service     varchar(50),
    t_id        binary(10),
    primary key (u_id, service, t_id),
    foreign key (u_id) references user(u_id) on delete cascade,
    foreign key (service, t_id) references service(service, t_id) on delete cascade
);


delimiter $/$/$
create procedure userteams(in u_id char(36), in id_handle varchar(16), in is_public boolean, in is_fav boolean, in is_role int)
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
and (id_handle is null or (length(id_handle) = 10 and t_id = id_handle) or (id_handle like "@%" and handle = substring(id_handle from 2)))
and (is_public is null or is_public = public)
and (is_fav is null or is_fav = fav)
and (is_role is null or is_role <= role) $/$/$

create procedure userrequests(in u_id char(36), in t_id binary(10), in req_id binary(10), in creator char(36), in managed boolean, in is_status int)
select r.*, u.name user, t.name team
from request r, team t, user u
where r.t_id = t.t_id and r.u_id = u.u_id
and (t_id is null or r.t_id=t_id)
and (req_id is null or r.req_id=req_id)
and (creator is null or r.u_id=creator)
and (is_status is null or r.status=is_status)
and (((managed is null or managed=true) and exists(select * from manager m where m.u_id=u_id and m.t_id=r.t_id))
    or ((managed is null or managed=false) and r.u_id=u_id))
order by r.date desc $/$/$

create procedure memberdeployments(in u_id char(36), in is_past boolean)
select d.dep_id, d.req_id, d.t_id, d.start, d.end, d.note, s.service, s.role, t.name team, r.name request
from deployment d, service_dep s, team t, request r
where d.t_id = t.t_id and d.req_id = r.req_id
and s.dep_id = d.dep_id and s.u_id = u_id
and (is_past is null or (d.end < now())=is_past)
and d.approver_id is not null
order by d.start desc $/$/$

create procedure teamdeployments(in t_id binary(10), in req_id binary(10), in dep_id binary(10), in is_approved int)
select d.*, d.approver_id is not null approved, t.name team, r.name request, u.name creator
from deployment d, team t, request r, user u
where d.t_id = t.t_id and d.req_id = r.req_id and u.u_id = d.creator_id
and (t_id is null or d.t_id=t_id)
and (req_id is null or d.req_id=req_id)
and (dep_id is null or d.dep_id=dep_id)
and (is_approved is null or (d.approver_id is not null)=is_approved)
order by d.start desc $/$/$

create procedure updaterole(in u_id char(36))
update user u set
is_member = u.u_id in (select m.u_id from member m),
is_manager = u.u_id in (select m.u_id from manager m)
where u_id is null or u.u_id = u_id $/$/$

create procedure teammembers(in t_id char(10), in exclude char(10))
select u.u_id, u.name, u.email, 
    case
        when t.owner_id=u.u_id then 3
        when exists(select true from manager mn where mn.u_id=u.u_id and mn.t_id=t_id) then 2
        else 1
    end role
from member m, user u, team t
where m.u_id=u.u_id and t.t_id=m.t_id and t.t_id=t_id
and (exclude is null or m.u_id not in (select u_id from service_dep s where s.dep_id=exclude))
order by role desc $/$/$

create trigger manager_insert after insert on manager
for each row
begin
insert into member (t_id, u_id) values (new.t_id, new.u_id) on duplicate key update u_id=u_id;
call updaterole(new.u_id);
end $/$/$

create trigger manager_update after update on manager
for each row
begin
if old.u_id!=new.u_id then
    insert into member (t_id, u_id) values (new.t_id, new.u_id) on duplicate key update u_id=u_id;
end if;
call updaterole(old.u_id);
call updaterole(new.u_id);
end $/$/$

create trigger manager_delete after delete on manager
for each row
call updaterole(old.u_id);
drop trigger if exists member_delete $/$/$

create trigger member_insert after insert on member
for each row
call updaterole(new.u_id) $/$/$

create trigger member_update after update on member
for each row
begin
if old.u_id!=new.u_id then
    delete from manager where u_id=old.u_id;
end if;
call updaterole(old.u_id);
call updaterole(new.u_id);
end $/$/$

create trigger member_delete after delete on member
for each row
begin
delete from manager where u_id=old.u_id;
call updaterole(old.u_id);
end $/$/$

create trigger owner_insert after insert on team
for each row
insert into manager (t_id, u_id) value (new.t_id, new.owner_id);

create trigger owner_update after update on team
for each row
update manager set u_id=new.owner_id where u_id=old.owner_id and t_id=old.t_id;

create trigger favcount_insert
after insert on favourite
for each row
    update team
    set favourites=favourites+1
    where t_id=new.t_id $/$/$

create trigger favcount_update
after update on favourite
for each row
begin
    update team 
    set favourites=favourites+1
    where t_id=new.t_id;
    update team
    set favourites=favourites-1
    where t_id=old.t_id;
end $/$/$

create trigger favcount_delete
after delete on favourite
for each row
update team
set favourites=favourites-1
where t_id=old.t_id $/$/$

delimiter ;

insert into `user` (`u_id`,`name`,`email`) values
("1f95f196-fa89-400a-982b-17d01b7fb554", "nobody", "nobody@nushigh.edu.sg"),
("1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "YONG ZHE DIAN", "h210170@nushigh.edu.sg"),
("30b59dc0-02a5-441a-9afc-58fd4ba34b93", "CHIN QIAO QI", "h210036@nushigh.edu.sg"),
("47f817c4-4a33-4f8b-abd5-0f23199dbef1", "Chemistry Department", "chem@nushigh.edu.sg"),
("52c4eabf-89bb-45ac-aca7-29797afdde36", "ANG E HERNG AYDEN", "h1910009@nushigh.edu.sg"),
("636c9342-e0ce-47e8-aa23-4fc2e0eceef1", "LAM EU LER", "h1910074@nushigh.edu.sg"),
("79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "CHIA SHENGJUN RYAN", "h1910018@nushigh.edu.sg"),
("8f2512c4-c35f-4386-998b-e582f09a9dc3", "Media Club", "media@nushigh.edu.sg"),
("94f4ec08-49a0-4bf0-8657-5bcf939d61b5", "HUANG YUEBIN", "h1910045@nushigh.edu.sg"),
("a03f51f2-54cf-4803-97af-0b5986fc7ae5", "NUS High Orientation", "orientation@nushigh.edu.sg"),
("d50b038d-2521-4300-948d-f3d4ca79cd63", "NUS High School IT", "nhsit@nushigh.edu.sg"),
("eb00f5ec-78a4-4630-b71c-29185919ef5a", "Leonhard Euler", "euler@u.nus.edu"),
("f2519a85-3e2a-4f2a-aac4-4305b8a84b6b", "PE Dept", "pe@nushigh.edu.sg"),
("f6e3fbb6-8199-43a9-85b7-41d0744266c1", "somebody", "somebody@nushigh.edu.sg");

insert into `team` (`t_id`,`owner_id`,`name`,`public`,`description`,`details`,`handle`) values
("4C_m6q4dXN", "f2519a85-3e2a-4f2a-aac4-4305b8a84b6b", "PE Dept Equipment Loan", 1, "Request for PE equipment for games and exercise", null, "pe_loan"),
("MGwSb5f0xj", "a03f51f2-54cf-4803-97af-0b5986fc7ae5", "OT'24 Logs", 0, null, "Submit all logs requests **1 week** before the first **dry run**.

Contact your comm IC for more details.", "o24logs"),
("aOS7wG5P02", "8f2512c4-c35f-4386-998b-e582f09a9dc3", "Media Club Requisition Form", 1, "Service requisition and equipment loan from Media Club", "https://tinyurl.com/NUSHMediaRequisitionGuidelines

* Please submit this form at **least 2** weeks in advance.

* All changes with regards to the event should be communicated to Media Club through WhatsApp or Email.

* Please note that not all requests can/will be fulfilled, and any decisions made by Media Club or IT staff are final.

* Photos and Videos will only be available **2 weeks** after the event has ended, not inclusive of common test or exam weeks.", "mediareq"),
("ikb-ZWQoT6", "eb00f5ec-78a4-4630-b71c-29185919ef5a", "Math tutoring by famous mathematician", 0, "Learn from the best", null, null),
("lfJtyCZOjp", "47f817c4-4a33-4f8b-abd5-0f23199dbef1", "Chemistry Lab Requisition", 1, "Chemistry Lab equipment requisition for lab sessions", "**Note:** We will only accede to requests where **chemicals and apparatus are already found** in our labs, relatively **common and safe** for usage.

If not, requests will not be approved, and you will need to think of alternative safer options.", "chemlab");

insert into `manager` (`u_id`,`t_id`) values
("1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "aOS7wG5P02"),
("30b59dc0-02a5-441a-9afc-58fd4ba34b93", "aOS7wG5P02"),
("52c4eabf-89bb-45ac-aca7-29797afdde36", "aOS7wG5P02"),
("636c9342-e0ce-47e8-aa23-4fc2e0eceef1", "aOS7wG5P02"),
("79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "aOS7wG5P02"),
("d50b038d-2521-4300-948d-f3d4ca79cd63", "aOS7wG5P02"),
("f6e3fbb6-8199-43a9-85b7-41d0744266c1", "ikb-ZWQoT6");

insert into `member` (`u_id`,`t_id`) values
("636c9342-e0ce-47e8-aa23-4fc2e0eceef1", "MGwSb5f0xj"),
("94f4ec08-49a0-4bf0-8657-5bcf939d61b5", "MGwSb5f0xj"),
("1f95f196-fa89-400a-982b-17d01b7fb554", "ikb-ZWQoT6");

insert into `favourite` (`u_id`,`t_id`) values
("636c9342-e0ce-47e8-aa23-4fc2e0eceef1", "MGwSb5f0xj"),
("f6e3fbb6-8199-43a9-85b7-41d0744266c1", "MGwSb5f0xj"),
("1f95f196-fa89-400a-982b-17d01b7fb554", "aOS7wG5P02"),
("636c9342-e0ce-47e8-aa23-4fc2e0eceef1", "aOS7wG5P02"),
("94f4ec08-49a0-4bf0-8657-5bcf939d61b5", "aOS7wG5P02"),
("636c9342-e0ce-47e8-aa23-4fc2e0eceef1", "lfJtyCZOjp");

insert into `request` (`req_id`,`t_id`,`u_id`,`date`,`name`,`description`,`committee`,`note`,`status`) values
("1HsIMbVaUm", "aOS7wG5P02", "eb00f5ec-78a4-4630-b71c-29185919ef5a", "2024-02-27 00:00:09.000", "Secret event", null, null, null, 2),
("TwRLG0WxEp", "lfJtyCZOjp", "636c9342-e0ce-47e8-aa23-4fc2e0eceef1", "2024-03-05 21:08:47.000", "CM6131 Task 3 Group 1", "Demonstration", "M24604", null, 0),
("bpbpIjYOa2", "aOS7wG5P02", "636c9342-e0ce-47e8-aa23-4fc2e0eceef1", "2023-12-15 01:02:03.000", "Orientation 2024 Storyline and Finale", "Storyling skit and finale skit+dances", "Orientation Finale Decor Committee", "ask IC for updated script", 2),
("eJvJ5Ou2eC", "aOS7wG5P02", "79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "2024-02-15 11:11:11.000", "Testing", "Testing 123", "Media Club", null, 0),
("k6w0bmz0uD", "aOS7wG5P02", "a03f51f2-54cf-4803-97af-0b5986fc7ae5", "2023-12-25 00:00:00.000", "Orientation 2024 Activities", "Mass dance, briefings with slides", "Orientation Core Team", null, 0),
("rVBT7e5VxX", "lfJtyCZOjp", "79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "2024-02-15 11:11:11.000", "Chem Task 3", "Demo", "M24601", null, 0),
("sN1pwvm3UR", "aOS7wG5P02", "94f4ec08-49a0-4bf0-8657-5bcf939d61b5", "2024-02-23 12:34:56.000", "Positivitea Week", "Positivitea booth at canteen w music and kahoot", "Positivitea", null, 0);

insert into `req_date` (`req_id`,`start`,`end`,`description`) values
("1HsIMbVaUm", "2024-02-27 13:00:00.000", "2024-02-28 13:00:00.000", ""),
("1HsIMbVaUm", "2024-02-28 13:00:00.000", "2024-02-29 13:00:00.000", ""),
("TwRLG0WxEp", "2024-03-19 08:00:00.000", "2024-03-19 10:00:00.000", "Practice session"),
("TwRLG0WxEp", "2024-03-28 08:00:00.000", "2024-03-28 10:00:00.000", "Presentation session"),
("bpbpIjYOa2", "2024-01-02 08:30:00.000", "2024-01-02 09:00:00.000", "Day 1 AM"),
("bpbpIjYOa2", "2024-01-02 15:00:00.000", "2024-01-02 15:30:00.000", "Day 1 PM"),
("bpbpIjYOa2", "2024-01-02 18:30:00.000", "2024-01-02 20:30:00.000", "Finale"),
("bpbpIjYOa2", "2024-01-03 08:00:00.000", "2024-01-03 08:30:00.000", "Day 2 AM"),
("bpbpIjYOa2", "2024-01-03 14:00:00.000", "2024-01-03 14:30:00.000", "Day 2 PM"),
("k6w0bmz0uD", "2024-01-04 08:00:00.000", "2024-01-04 18:30:00.000", "Day 3"),
("k6w0bmz0uD", "2024-01-04 20:30:00.000", "2024-01-04 21:30:00.000", "Day 3 Debrief"),
("sN1pwvm3UR", "2024-02-28 10:00:00.000", "2024-02-28 14:00:00.000", ""),
("sN1pwvm3UR", "2024-02-29 10:00:00.000", "2024-02-29 14:00:00.000", "");

insert into `deployment` (`dep_id`,`req_id`,`t_id`,`start`,`end`,`creator_id`,`create_date`,`approver_id`,`approve_date`,`note`) values
("015WabgG4I", "1HsIMbVaUm", "aOS7wG5P02", "2024-02-28 00:00:00.000", "2024-02-28 11:00:00.000", "1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "2024-02-27 00:00:00.000", "30b59dc0-02a5-441a-9afc-58fd4ba34b93", "2024-02-27 00:00:00.000", null),
("7RBLdUAfH5", "bpbpIjYOa2", "aOS7wG5P02", "2024-01-03 14:00:00.000", "2024-01-03 14:30:00.000", "79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "2023-12-20 00:00:00.000", "8f2512c4-c35f-4386-998b-e582f09a9dc3", "2023-12-23 00:00:00.000", "Day 2 PM"),
("7dQtxic61a", "bpbpIjYOa2", "aOS7wG5P02", "2024-01-04 17:00:00.000", "2024-01-04 20:30:00.000", "79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "2023-12-20 00:00:00.000", "8f2512c4-c35f-4386-998b-e582f09a9dc3", "2023-12-23 00:00:00.000", "Finale"),
("M1U2TWMIZD", "bpbpIjYOa2", "aOS7wG5P02", "2024-01-02 15:00:00.000", "2024-01-02 15:30:00.000", "79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "2023-12-20 00:00:00.000", "8f2512c4-c35f-4386-998b-e582f09a9dc3", "2023-12-23 00:00:00.000", "Day 1 PM"),
("VMReLOEgvM", "bpbpIjYOa2", "aOS7wG5P02", "2024-01-03 08:00:00.000", "2024-01-03 08:30:00.000", "79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "2023-12-20 00:00:00.000", "8f2512c4-c35f-4386-998b-e582f09a9dc3", "2023-12-23 00:00:00.000", "Day 2 AM"),
("Z7vg08Plnb", "bpbpIjYOa2", "aOS7wG5P02", "2024-01-02 08:30:00.000", "2024-01-02 09:00:00.000", "79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "2023-12-20 00:00:00.000", "8f2512c4-c35f-4386-998b-e582f09a9dc3", "2023-12-23 00:00:00.000", "Day 1 AM"),
("mKGqQfbq1t", "sN1pwvm3UR", "aOS7wG5P02", "2024-02-28 10:00:00.000", "2024-02-28 14:00:00.000", "1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "2024-02-23 00:00:00.000", null, null, null),
("oMymQEi8RV", "1HsIMbVaUm", "aOS7wG5P02", "2024-02-28 13:00:00.000", "2024-02-29 13:00:00.000", "1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "2024-02-27 00:00:00.000", "30b59dc0-02a5-441a-9afc-58fd4ba34b93", "2024-02-27 00:00:00.000", null),
("oY7e_F0-g9", "k6w0bmz0uD", "aOS7wG5P02", "2024-01-04 08:00:00.000", "2024-01-04 18:30:00.000", "1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "2023-12-19 00:00:00.000", null, null, null),
("sXwn2OqK9S", "k6w0bmz0uD", "aOS7wG5P02", "2024-01-04 20:30:00.000", "2024-01-04 21:30:00.000", "1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "2023-12-19 00:00:00.000", null, null, null),
("tiLGwtwXmF", "sN1pwvm3UR", "aOS7wG5P02", "2024-02-29 10:00:00.000", "2024-02-29 14:00:00.000", "1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "2024-02-23 00:00:00.000", null, null, null);

insert into `item` (`item`,`t_id`,`count`,`visible`,`description`,`category`) values
("Beaker (100mL)", "lfJtyCZOjp", 81, 1, null, "Glassware"),
("Beaker (250mL)", "lfJtyCZOjp", 65, 1, null, "Glassware"),
("Beaker (600mL)", "lfJtyCZOjp", 39, 1, null, "Glassware"),
("Bose S1 Pro", "aOS7wG5P02", 2, 1, "Portable bluetooth speaker", "Speakers"),
("Bose S1 Pro + Microphone", "aOS7wG5P02", 2, 1, "Portable bluetooth speaker and wired microphone", "Speakers"),
("Bunsen burner", "lfJtyCZOjp", 40, 1, null, "Heating"),
("Crucible tongs", "lfJtyCZOjp", 28, 1, "Stainless steel", "Heating"),
("Hot plate with magnetic stirrer", "lfJtyCZOjp", 27, 1, null, "Heating"),
("Lighter (spark)", "lfJtyCZOjp", 46, 1, null, "Heating"),
("Prism+ TV", "aOS7wG5P02", 2, 1, "Big TV (movable on wheels)", null),
("Senrun", "aOS7wG5P02", 2, 1, "Luggage speaker with microphone", "Speakers");

insert into `service` (`service`,`t_id`,`visible`,`description`,`category`) values
("AV", "aOS7wG5P02", 1, null, null),
("Livestream", "aOS7wG5P02", 0, null, null),
("Photo", "aOS7wG5P02", 1, null, null),
("Video", "aOS7wG5P02", 1, null, null);

insert into `can_serve` (`u_id`,`service`,`t_id`) values
("1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "AV", "aOS7wG5P02"),
("30b59dc0-02a5-441a-9afc-58fd4ba34b93", "AV", "aOS7wG5P02"),
("636c9342-e0ce-47e8-aa23-4fc2e0eceef1", "AV", "aOS7wG5P02"),
("79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "AV", "aOS7wG5P02"),
("8f2512c4-c35f-4386-998b-e582f09a9dc3", "AV", "aOS7wG5P02"),
("d50b038d-2521-4300-948d-f3d4ca79cd63", "AV", "aOS7wG5P02"),
("52c4eabf-89bb-45ac-aca7-29797afdde36", "Photo", "aOS7wG5P02"),
("8f2512c4-c35f-4386-998b-e582f09a9dc3", "Photo", "aOS7wG5P02"),
("8f2512c4-c35f-4386-998b-e582f09a9dc3", "Video", "aOS7wG5P02");

insert into `item_req` (`req_id`,`item`,`t_id`,`count`) values
("1HsIMbVaUm", "Bose S1 Pro", "aOS7wG5P02", 2),
("TwRLG0WxEp", "Beaker (250mL)", "lfJtyCZOjp", 2),
("TwRLG0WxEp", "Bunsen burner", "lfJtyCZOjp", 1),
("TwRLG0WxEp", "Crucible tongs", "lfJtyCZOjp", 2),
("TwRLG0WxEp", "Hot plate with magnetic stirrer", "lfJtyCZOjp", 1),
("TwRLG0WxEp", "Lighter (spark)", "lfJtyCZOjp", 1),
("sN1pwvm3UR", "Bose S1 Pro", "aOS7wG5P02", 2),
("sN1pwvm3UR", "Prism+ TV", "aOS7wG5P02", 1);

insert into `service_req` (`req_id`,`service`,`t_id`) values
("bpbpIjYOa2", "AV", "aOS7wG5P02"),
("k6w0bmz0uD", "AV", "aOS7wG5P02"),
("bpbpIjYOa2", "Photo", "aOS7wG5P02"),
("bpbpIjYOa2", "Video", "aOS7wG5P02");

insert into `item_dep` (`dep_id`,`item`,`t_id`,`count`,`note`) values
("015WabgG4I", "Bose S1 Pro", "aOS7wG5P02", 2, null),
("mKGqQfbq1t", "Bose S1 Pro", "aOS7wG5P02", 1, "Bose 1"),
("mKGqQfbq1t", "Prism+ TV", "aOS7wG5P02", 1, "get from IT"),
("oMymQEi8RV", "Bose S1 Pro", "aOS7wG5P02", 1, null),
("tiLGwtwXmF", "Bose S1 Pro", "aOS7wG5P02", 1, "Bose 2"),
("tiLGwtwXmF", "Prism+ TV", "aOS7wG5P02", 1, "get from IT");

insert into `service_dep` (`dep_id`,`u_id`,`service`,`t_id`,`role`) values
("7dQtxic61a", "1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "AV", "aOS7wG5P02", "Sound"),
("7dQtxic61a", "30b59dc0-02a5-441a-9afc-58fd4ba34b93", "AV", "aOS7wG5P02", "Lights"),
("7dQtxic61a", "52c4eabf-89bb-45ac-aca7-29797afdde36", "Photo", "aOS7wG5P02", "Finale"),
("7dQtxic61a", "79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "AV", "aOS7wG5P02", "IC"),
("7dQtxic61a", "8f2512c4-c35f-4386-998b-e582f09a9dc3", "Video", "aOS7wG5P02", "Static cam"),
("Z7vg08Plnb", "1fc1ad99-4cb4-4f73-b8f2-e4ffd94f3c89", "AV", "aOS7wG5P02", "Sound"),
("Z7vg08Plnb", "30b59dc0-02a5-441a-9afc-58fd4ba34b93", "AV", "aOS7wG5P02", "Lights"),
("Z7vg08Plnb", "79be1b8f-9b5c-4f78-9aea-85a2bde41e1f", "AV", "aOS7wG5P02", "IC"),
("oY7e_F0-g9", "d50b038d-2521-4300-948d-f3d4ca79cd63", "AV", "aOS7wG5P02", "Roamer"),
("sXwn2OqK9S", "636c9342-e0ce-47e8-aa23-4fc2e0eceef1", "AV", "aOS7wG5P02", "Slide");