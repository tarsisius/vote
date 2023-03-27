import { eventByUnique } from 'lib/db/query'


export const GET = async (_: Request, { params }: any) => {
  const { unique } = params
  const event_data = await eventByUnique(unique)
  if (!event_data) {
    return new Response(JSON.stringify('error when get from db'), {
      status: 404,
    })
  }
  return new Response(JSON.stringify({...event_data}), { status: 200 })
}
