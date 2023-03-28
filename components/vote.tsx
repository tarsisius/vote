'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { LinkIcon } from 'components/icons'
// import { pusherClient } from 'lib/pusher'

interface VoteProps {
  initialData: any
  unique: string
}
export default function Vote({ initialData, unique }: VoteProps) {
  const [wait, setWait] = useState(false)
  const [selected, setSelected] = useState<number>()
  const [newData, setNewData] = useState<typeof initialData>()

  useEffect(() => {
    // const channel = pusherClient.subscribe(`vote-${unique}`)
    // channel.bind('new-data', (data: any) => {
    //   setNewData(data)
    // })
    // return () => {
    //   channel.unbind_all()
    //   channel.unsubscribe()
    // }
  }, [])

  async function handleSubmit() {
    setWait(true)
    const res = await fetch(`/api/vote-event/${unique}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        unique,
        option_id: selected,
      }),
    })
    setWait(false)
    if (res.ok) {
      toast.success('Success vote')
    } else {
      toast.success('Failed vote')
    }
  }
  return (
    <>
      {!newData
        ? initialData.option.map((option: any, i: number) => (
            <div
              key={i}
              className={`bg-my-white bg-opacity-5 rounded-lg flex justify-start items-center px-5 cursor-pointer ${
                selected === option.id &&
                'border border-my-purple border-opacity-50'
              }`}
              onClick={() => setSelected(option.id)}
            >
              <div className='font-bold text-my-purple w-2 mr-10'>{i + 1}.</div>
              <div className='flex items-center bg-transparent h-9 font-bold'>
                {option.name}
              </div>
              <div className='ml-auto flex space-x-4 items-center'>
                <div className='text-xs font-light italic'>
                  {option.total} votes
                </div>
                <div className='font-normal text-sm'>
                  {(!newData
                    ? initialData.event.total
                    : newData.event.total) !== 0
                    ? Math.round(
                        (option.total /
                          (!newData
                            ? initialData.event.total
                            : newData.event.total)) *
                          100
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          ))
        : newData.option.map((option: any, i: number) => (
            <div
              key={i}
              className={`bg-my-white bg-opacity-5 rounded-lg flex justify-start items-center px-5 cursor-pointer ${
                selected === option.id &&
                'border border-my-purple border-opacity-50'
              }`}
              onClick={() => setSelected(option.id)}
            >
              <div className='font-bold text-my-purple w-2 mr-10'>{i + 1}.</div>
              <div className='flex items-center bg-transparent h-9 font-bold'>
                {option.name}
              </div>
              <div className='ml-auto flex space-x-4 items-center'>
                <div className='text-xs font-light italic'>
                  {option.total} votes
                </div>
                <div className='font-normal text-sm'>
                  {(!newData
                    ? initialData.event.total
                    : newData.event.total) !== 0
                    ? Math.round(
                        (option.total /
                          (!newData
                            ? initialData.event.total
                            : newData.event.total)) *
                          100
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          ))}
      <div className='flex justify-between items-center w-full'>
        <span className='text-sm font-light italic'>
          {!newData ? initialData.event.total : newData.event.total} votes
        </span>
        <div className='flex space-x-6'>
          <button
            className='w-9 h-9 flex items-center justify-center leading-6 bg-my-white bg-opacity-5 rounded-lg transition-all duration-75 focus:outline-none'
            type='button'
            //   onClick={handleCopy}
          >
            <LinkIcon />
          </button>
          <button
            className='bg-my-purple px-4 flex h-9 w-20 items-center justify-center rounded-lg focus:outline-none'
            type='button'
            disabled={selected === undefined}
            onClick={handleSubmit}
          >
            {wait ? '...' : 'Vote'}
          </button>
        </div>
      </div>
    </>
  )
}
