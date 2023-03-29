import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'

import { eq } from 'drizzle-orm/expressions'
import { db } from 'lib/db/client'
import { events, options } from 'lib/db/schema'

import Vote from 'components/vote'

async function getEvent(unique: string) {
  const data = await db
    .select({
      id: events.id,
      unique: events.unique,
      title: events.title,
      total: events.total,
    })
    .from(events)
    .where(eq(events.unique, unique))
    .then(async (data) => {
      if (!data[0]) {
        return null
      }
      return {
        event: data[0],
        option: await db
          .select()
          .from(options)
          .where(eq(options.event_id, data[0].id)),
      }
    })

  return data
}

export const dynamic = 'force-dynamic'

export default async function Event({ params }: any) {
  const { unique } = params

  const cookieStore = cookies()
  const event_cookie = cookieStore.get(unique)

  let voted
  if (event_cookie) {
    voted = event_cookie.value
  }

  const data = await getEvent(unique)
  if (!data) {
    notFound()
  }
  return (
    <div className='flex flex-col w-full px-4 py-3 text-left'>
      <div className='flex flex-col w-full space-y-4'>
        <p className='bg-my-black text-white text-2xl font-bold'>
          {data.event.title}
        </p>
        <Vote initialData={data} unique={unique} voted={voted} />
      </div>
    </div>
  )
}
