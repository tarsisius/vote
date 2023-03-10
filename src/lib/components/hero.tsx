import Link from 'next/link'

export default function HomeHero() {
  return (
    <div className='flex flex-col justify-start mx-auto w-full max-w-screen-md px-2.5 sm:px-0'>
      <h1 className='mt-5 font-display text-5xl font-extrabold leading-[1.15] sm:text-6xl sm:leading-[1.15]'>
        Polling
        <br />
        Super Easy
      </h1>
      <p className='mt-8 text-lg font-normal sm:text-xl '>
        Get answers through a poll.
      </p>
      <div className='mt-8 flex'>
        <Link
          className='bg-my-purple px-4 flex h-10 items-center justify-center  rounded-md transition-all duration-75 focus:outline-none'
          href={'/create'}
        >
          Create your Poll
        </Link>
      </div>
    </div>
  )
}
