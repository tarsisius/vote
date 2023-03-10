'use client'

import { useEffect, useState } from 'react'
import { doc, increment, onSnapshot, updateDoc } from 'firebase/firestore'
import { toast } from 'react-hot-toast'
import { db } from 'lib/firebase/config'

export default function Poll({ params }: { params: { id: string } }) {
  const [wait, setWait] = useState(true)
  const [data, setData] = useState<any>(null)
  const [selected, setSelected] = useState<string>('')

  const id = params.id

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'polls', id),
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id })
          console.log(data.total)
        } else {
          setData(null)
        }
        setWait(false)
      },
      (error) => {
        toast.error('error happened: ' + error.message)
      }
    )
    return () => unsub()
  }, [id])

  const handleVote = async () => {
    setWait(true)
    try {
      const docRef = doc(db, 'polls', id)
      await updateDoc(docRef, {
        ['options.' + selected]: increment(1),
        total: increment(1),
      })
      setWait(false)
      toast.success('Success vote')
    } catch (error) {
      setWait(false)
      toast.error('error, please try again:' + error)
    }
  }

  return (
    <>
      {wait ? (
        <p>Please wait</p>
      ) : (
        <>
          {console.log(data.total)}
          <div className='flex flex-col w-full px-4 py-3 text-left'>
            <div className='flex flex-col w-full space-y-4'>
              <p className='bg-my-black text-white text-2xl font-bold'>
                {data.question}
              </p>
              {Object.keys(data.options)
                .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
                .map((opt: any, i: number) => (
                  <div
                    key={i}
                    className={`bg-my-white bg-opacity-5 rounded-lg flex justify-start items-center px-5 cursor-pointer ${
                      selected === opt &&
                      'border border-my-purple border-opacity-50'
                    }`}
                    onClick={() => setSelected(opt)}
                  >
                    <div className='font-bold text-my-purple w-2 mr-10'>
                      {i + 1}.
                    </div>
                    <div className='flex items-center bg-transparent h-9 font-bold'>
                      {opt}
                    </div>
                    <div className='ml-auto flex space-x-4 items-center'>
                      <div className='text-xs font-light'>
                        {data.options[opt]} votes
                      </div>
                      <div className='font-normal text-sm'>
                        {data.total !== 0
                          ? Math.round((data.options[opt] / data.total) * 100)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                ))}

              <div className='flex justify-between items-center w-full'>
                <span className='text-sm font-light'>{data.total} votes</span>
                <button
                  className='bg-my-purple px-4 flex h-9 w-20 items-center justify-center rounded-lg focus:outline-none'
                  type='button'
                  disabled={selected === ''}
                  onClick={handleVote}
                >
                  {wait ? '...' : 'Vote'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
