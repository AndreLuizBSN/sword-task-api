import mysql, { ConnectionOptions } from "mysql2/promise";
import path from 'path';
require('dotenv').config({path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`), override: true })

export interface SQLQuery {
  command: string;
  options?: any[];
}

var config: ConnectionOptions = {
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "nodedb",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  port: (process.env.DB_PORT || 3306) as number,
  connectionLimit: 100,
};

const conn = async () => {
  return await mysql.createConnection(config);
};

const convertToSql = (data: SQLQuery) => {
  if (!data.options) return data.command;
  var size = data.options.length;
  var ix = 1;
  while (ix <= size) {
    var dt:string = (data.options[ix - 1] ? `'${data.options[ix - 1]}'` : null) as string;
    data.command = data.command
      .split(`$${ix}`)
      .join(dt);
    ix++;
  }
  return data.command;
};

export const execSql = async (data: SQLQuery) => {
  var commandSql: string = convertToSql(data);

  var pool = await conn();
  var res = await pool.execute(commandSql);
  return res[0];
};
