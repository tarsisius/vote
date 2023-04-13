'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { LoadingIcon, PlusIcon, XIcon } from '@/components/icons'

export default function Form() {
  const [wait, setWait] = useState(false)
  const [title, setTitle] = useState<string>('')
  const [options, setOptions] = useState<string[]>(['', ''])

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setWait(true)
    const res = await fetch('/api/new-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        option_array: options,
      }),
    })
    if (res.ok) {
      const { unique } = await res.json()
      setWait(false)
      toast.success('Success create event')
      router.push(`/event/${unique}`)
    } else {
      setWait(false)
      toast.success('Failed create event')
    }
  }
  return (
    <form
      className='flex flex-col w-full px-4 py-3 text-left'
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <div className='flex flex-col w-full space-y-4'>
        <input
          className='bg-my-black text-white placeholder-opacity-40 placeholder:italic text-2xl font-bold focus:outline-none'
          type='text'
          placeholder="What's on your mind..."
          name='title'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
        <div className='flex flex-col w-full space-y-4'>
          {options.map((opt: any, i: number) => (
            <div
              className='bg-my-white bg-opacity-5 rounded-lg flex justify-start items-center px-5'
              key={i}
            >
              <div className='font-bold text-my-purple w-2 mr-10'>{i + 1}.</div>
              <input
                className='bg-transparent h-9 focus:outline-none font-bold w-full'
                type='text'
                placeholder={`Option #${i + 1}`}
                name={`opt${i + 1}`}
                value={opt.value}
                onChange={(e) => {
                  const list = [...options]
                  list[i] = e.target.value
                  setOptions(list)
                }}
                required
              />
              {!(options.length <= 2) && (
                <button
                  className='ml-auto'
                  type='button'
                  onClick={() => {
                    const list = [...options]
                    list.splice(i, 1)
                    setOptions(list)
                  }}
                >
                  <XIcon />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className='flex justify-between w-full space-x-4'>
          {options?.length < 5 && (
            <button
              className='w-9 h-9 flex items-center justify-center leading-6 bg-my-white bg-opacity-5 rounded-lg transition-all duration-75 focus:outline-none'
              type='button'
              onClick={() => {
                setOptions((prev) => [...prev, ''])
              }}
            >
              <PlusIcon />
            </button>
          )}
          <button
            className='bg-my-purple text-my-white px-4 flex h-9 w-20 items-center justify-center rounded-lg focus:outline-none ml-auto'
            type='submit'
          >
            {wait ? <LoadingIcon /> : 'Create'}
          </button>
        </div>
      </div>
    </form>
  )
}
