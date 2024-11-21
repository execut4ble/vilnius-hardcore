import type { Handle } from '@sveltejs/kit';
import postgres from 'postgres';
import 'dotenv/config'

export const handle: Handle = async ({event, resolve}) => {
  const sql = postgres('postgres://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + '/' + process.env.DB_NAME);

  event.locals = {
    sql: sql
  };
  
  const response = await resolve(event);
  return response;
};