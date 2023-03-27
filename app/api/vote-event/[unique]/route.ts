import { voteEvent } from 'lib/db/query'
import { pusherServer } from 'lib/pusher'

// export const runtime = 'edge'
// edge not supported anjimm bgt :(
export const PATCH = async (request: Request) => {
  return await request.json().then(async (body) => {
    const { unique, option_id } = body
    const updated_event = await voteEvent(unique, option_id)
    if (!updated_event) {
      return new Response(JSON.stringify('error when insert to db'), {
        status: 500,
      })
    }

    try {
      await pusherServer.trigger(`vote-${unique}`, 'new-data', updated_event)
      return new Response(JSON.stringify('ok'), {
        status: 200,
      })
    } catch (error) {
      console.log(error)
      return new Response(JSON.stringify(error), {
        status: 500,
      })
    }
  })
}
