import { eq } from 'drizzle-orm/expressions'
import { events, options } from 'lib/db/schema'
import { db } from 'lib/db/client'
import { nanoid } from 'nanoid'

export async function voteEvent(unique: string, option_id: number) {
  const updateOption = await db
    .select()
    .from(options)
    .where(eq(options.id, option_id))
    .then(
      async (option) =>
        await db
          .update(options)
          .set({ total: option[0].total + 1 })
          .where(eq(options.id, option_id))
    )
  const updateEvent = await db
    .select()
    .from(events)
    .where(eq(events.unique, unique))
    .then(
      async (event) =>
        await db
          .update(events)
          .set({ total: event[0].total + 1 })
          .where(eq(events.unique, unique))
    )
  const getEvent = await db
    .select()
    .from(events)
    .where(eq(events.unique, unique))
  const getOption = await db
    .select()
    .from(options)
    .where(eq(options.event_id, getEvent[0].id))
  const [updatedOptionRes, updatedEventRes, getEventRes, getOptionRes] =
    await Promise.allSettled([updateOption, updateEvent, getEvent, getOption])
  if (
    updatedOptionRes.status === 'fulfilled' &&
    updatedEventRes.status === 'fulfilled' &&
    getEventRes.status === 'fulfilled' &&
    getOptionRes.status === 'fulfilled'
  ) {
    return {
      event: getEventRes.value[0],
      option: getOptionRes.value,
    }
  }
  return null
}
export async function newEvent(event: any) {
  const { title, new_options } = event
  const addEvent = await db.insert(events).values({ title, unique: nanoid(4) })
  const addOption = await db.insert(options).values(
    ...new_options.map((option: string) => {
      return {
        name: option,
        event_id: Number(addEvent.insertId),
      }
    })
  )
  const getEvent = await db
    .select()
    .from(events)
    .where(eq(events.id, Number(addEvent.insertId)))
  const [eventRes, optionRes, newEventRes] = await Promise.allSettled([
    addEvent,
    addOption,
    getEvent,
  ])
  if (
    eventRes.status === 'fulfilled' &&
    optionRes.status === 'fulfilled' &&
    newEventRes.status === 'fulfilled'
  ) {
    return {
      unique: newEventRes.value[0].unique,
    }
  }
  return null
}

export async function eventByUnique(unique: string) {
  const getEvent = await db
    .select()
    .from(events)
    .where(eq(events.unique, unique))

  if (getEvent[0] === undefined) return null
  const getOption = await db
    .select()
    .from(options)
    .where(eq(options.event_id, getEvent[0].id))
  const [eventRes, optionRes] = await Promise.allSettled([getEvent, getOption])
  if (eventRes.status === 'fulfilled' && optionRes.status === 'fulfilled') {
    return {
      event: eventRes.value[0],
      option: optionRes.value,
    }
  }
  return null
}
