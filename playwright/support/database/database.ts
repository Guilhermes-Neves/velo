import 'dotenv/config'
import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from './schema'

function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL não definida no .env')
  }

  if (
    connectionString.includes('db.') &&
    connectionString.includes('.supabase.co') &&
    connectionString.includes(':5432')
  ) {
    throw new Error(
      'No Windows, a porta 5432 do host db.*.supabase.co falha com EACCES (IPv6). ' +
        'Use a porta 6543: postgresql://postgres:[SENHA]@db.[projeto].supabase.co:6543/postgres',
    )
  }

  return connectionString
}

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    connectionString: getConnectionString(),
    max: 10,
    ssl: { rejectUnauthorized: false },
  }),
})

export const db = new Kysely<Database>({
  dialect,
})