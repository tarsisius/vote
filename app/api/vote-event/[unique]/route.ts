import { eq } from 'drizzle-orm/mysql-core/expressions'
import { pusherServer } from 'lib/pusher'
import { db } from 'lib/db/client'
import { events, options } from 'lib/db/schema'

export async function PATCH(req: Request, { params }: any) {
  const { unique } = params
  const { option_id } = await req.json()
  const updateOption = await db
    .select()
    .from(options)
    .where(eq(options.id, option_id))
    .then(async (option) => {
      return await db
        .update(options)
        .set({ total: option[0].total + 1 })
        .where(eq(options.id, option_id))
    })
  if (updateOption.rowsAffected === 0) {
    return new Response(JSON.stringify({ error: 'Error updating option' }), {
      status: 500,
    })
  }
  const updateEvent = await db
    .select()
    .from(events)
    .where(eq(events.unique, unique))
    .then(async (event) => {
      return await db
        .update(events)
        .set({ total: event[0].total + 1 })
        .where(eq(events.unique, unique))
    })
  if (updateEvent.rowsAffected === 0) {
    return new Response(JSON.stringify({ error: 'Error updating option' }), {
      status: 500,
    })
  }
  const getData = await db
    .select()
    .from(events)
    .where(eq(events.unique, unique))
    .then(async (data) => {
      return {
        event: data[0],
        option: await db
          .select()
          .from(options)
          .where(eq(options.event_id, data[0].id)),
      }
    })
  await pusherServer.trigger(`vote-${unique}`, 'new-data', getData)

  return new Response(JSON.stringify(getData), {
    status: 200,
    headers: {
      'Set-Cookie': `${unique}=${option_id}; HttpOnly; Path=/; Max-Age=${
        60 * 60 * 24 * 180
      }`,
    },
  })
}
