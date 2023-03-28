import { eq } from 'drizzle-orm/expressions'
import { db } from 'lib/db/client'
import { events, options } from 'lib/db/schema'

export const runtime = 'experimental-edge'
export async function GET(_: Request, { params }: any) {
  const { unique } = params
  const getEvent = await db
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
  return new Response(JSON.stringify(getEvent), { status: 200 })
}
