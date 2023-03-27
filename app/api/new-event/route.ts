import { newEvent } from 'lib/db/query'

export const runtime = 'edge'

export const POST = async (request: Request) => {
  return await request
    .json()
    .then(async (body) => {
      const { title, new_options } = body
      const new_event = await newEvent({ title, new_options })
      if (!new_event) {
        return new Response(JSON.stringify('error when insert to db'), {
          status: 500,
        })
      }
      return new Response(JSON.stringify({ unique: new_event.unique }), {
        status: 200,
      })
    })
    .catch(() => {
      return new Response(JSON.stringify('error when parse body'), {
        status: 500,
      })
    })
}
