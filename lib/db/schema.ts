import {
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core'

export const events = mysqlTable(
  'events',
  {
    id: serial('id').primaryKey(),
    unique: text('unique').notNull(),
    title: text('title').notNull(),
    total: int('total').notNull().default(0),
    created_at: timestamp('created_at').notNull().defaultNow().onUpdateNow(),
  }
)

export const options = mysqlTable('options', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  total: int('total').notNull().default(0),
  event_id: int('event_id').notNull(),
})
