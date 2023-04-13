import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm/mysql-core/expressions'
import { db } from '@/lib/db/client'
import { events, options } from '@/lib/db/schema'

export async function POST(req: Request) {
  const { title, option_array } = await req.json()
  const insertEvent = await db.insert(events).values({
    title,
    unique: nanoid(4),
  })
  if (!insertEvent.insertId) {
    return new Response(JSON.stringify({ error: 'Error inserting event' }), {
      status: 500,
    })
  }
  const insertOption = await db.insert(options).values(
    option_array.map((o: string) => {
      return {
        name: o,
        event_id: Number(insertEvent.insertId),
      }
    })
  )
  if (!insertOption.insertId) {
    return new Response(JSON.stringify({ error: 'Error inserting option' }), {
      status: 500,
    })
  }
  const getEvent = await db
    .select()
    .from(events)
    .where(eq(events.id, Number(insertEvent.insertId)))
    .then((data) => data[0])
  if (!getEvent) {
    return new Response(JSON.stringify({ error: 'fail' }), {
      status: 500,
    })
  }
  return new Response(JSON.stringify({ unique: getEvent.unique }), {
    status: 200,
  })
}
