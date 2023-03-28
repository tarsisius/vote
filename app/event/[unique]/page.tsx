import Vote from 'components/vote'
import { notFound } from 'next/navigation'

export default async function Event({ params }: any) {
  const { unique } = params
  const res = await fetch(`${process.env.APP_URL}/api/get-event/${unique}`)
  if (!res.ok) {
    notFound()
  }
  const data = await res.json()
  return (
    <div className='flex flex-col w-full px-4 py-3 text-left'>
      <div className='flex flex-col w-full space-y-4'>
        <p className='bg-my-black text-white text-2xl font-bold'>
          {data.event.title}
        </p>
        <Vote initialData={data} unique={unique} />
      </div>
    </div>
  )
}
