'use client'
//library
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { toast } from 'react-hot-toast'
//hand coded
import { PlusIcon, XIcon } from 'lib/components/icons'
import { db } from 'lib/firebase/config'

export default function Create() {
  const [wait, setWait] = useState(false)
  const [qs, setQs] = useState<string>('')
  const [opts, setOpts] = useState<string[]>(['', ''])

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setWait(true)
    try {
      const docRef = doc(collection(db, 'polls'))
      await setDoc(docRef, {
        question: qs,
        options: opts.reduce((obj, i) => {
          return {
            ...obj,
            [i]: 0,
          }
        }, {}),
        total: 0,
        createdAt: serverTimestamp(),
      })
      setWait(false)
      toast.success('Success create poll')
      router.push(`/poll/${docRef.id}`)
    } catch (error) {
      setWait(false)
      toast.error('error, please try again:' + error)
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
          name='question'
          onChange={(e) => setQs(e.target.value)}
          value={qs}
          required
        />
        <div className='flex flex-col w-full space-y-4'>
          {opts.map((opt: any, i: number) => (
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
                  const list = [...opts]
                  list[i] = e.target.value
                  setOpts(list)
                }}
                required
              />
              {!(opts.length <= 2) && (
                <button
                  className='ml-auto'
                  type='button'
                  onClick={() => {
                    const list = [...opts]
                    list.splice(i, 1)
                    setOpts(list)
                  }}
                >
                  <XIcon />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className='flex justify-between w-full space-x-4'>
          {opts?.length < 5 && (
            <button
              className='w-9 h-9 flex items-center justify-center leading-6 bg-my-white bg-opacity-5 rounded-lg transition-all duration-75 focus:outline-none'
              type='button'
              onClick={() => {
                setOpts((prev) => [...prev, ''])
              }}
            >
              <PlusIcon />
            </button>
          )}
          <button
            className='bg-my-purple text-my-white px-4 flex h-9 w-20 items-center justify-center rounded-lg focus:outline-none'
            type='submit'
          >
            {wait ? '...' : 'Create'}
          </button>
        </div>
      </div>
    </form>
  )
}
