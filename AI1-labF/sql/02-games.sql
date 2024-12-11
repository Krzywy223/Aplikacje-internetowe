create table games
(
    id      integer not null
        constraint games_pk
            primary key autoincrement,
    title text not null,
    description text not null
);
