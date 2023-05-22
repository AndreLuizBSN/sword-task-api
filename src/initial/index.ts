import { execSql } from "../core/database"

const tables = [
    `CREATE TABLE if not exists users (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL UNIQUE,
        password varchar(255) NOT NULL,
        type varchar(10) NOT NULL,
        active boolean not null default 1,
        created_at datetime not null,
        token varchar(500) null,
        PRIMARY KEY (id)
    );`,
    `insert into users (id, name, email, password, type, active, created_at) values (
        1, 'Manager Base', 'manager@mail.com', '0795151defba7a4b5dfa89170de46277', 'MANAGER', 1, '2023-05-20'
    );`,
    `insert into users (id, name, email, password, type, active, created_at) values (
        2, 'Tech Base', 'techbase@mail.com', '7b591a2a55585e166465a838c28a2c5f', 'TECH', 1, '2023-05-20'
    );`,
    `CREATE TABLE if not exists tasks (
        id int NOT NULL AUTO_INCREMENT,
        title varchar(255) NOT NULL,
        summary varchar(2500) NOT NULL,
        user_id int NULL,
        created_at datetime not null,
        updated_at datetime not null,
        finished_at datetime null,
        PRIMARY KEY (id)
    );`
]

export const databaseInitialConfig = async () => {
    for (let s of tables) {
        try {
            await execSql({command: s})   
        } catch (error) {
            console.error(error);
            
        }
      }
}