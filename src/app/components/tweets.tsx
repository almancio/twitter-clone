'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Likes from './likes'
import { useEffect, experimental_useOptimistic as useOptimistic } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(
    tweets,
    (CurrentOptimisticTweets, newTweet) => {
      const newOptimisticTweets = [...CurrentOptimisticTweets]
      const index = newOptimisticTweets.findIndex((tweet) => tweet.id === newTweet.id)
      newOptimisticTweets[index] = newTweet
      return newOptimisticTweets
    }
  )

  const router = useRouter()
  const supabase = createClientComponentClient()
  useEffect(() => {
    const channel = supabase
      .channel('Real time tweets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tweets' }, (payload) => {
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  return optimisticTweets.map((tweet) => (
    <div className='p-6 flex border border-gray-800' key={tweet.id}>
      <div className='h-12 w-12'>
        <Image className='rounded-full' src={tweet.author.avatar_url} alt='User avatar image' height={48} width={48} />
      </div>
      <div className='ml-4'>
        <p>
          <span className='font-bold'>{tweet.author.name}</span>
          <span className='text-sm ml-2 text-gray-400'>@{tweet.author.username}</span>
        </p>
        <p>{tweet.title}</p>
        <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
      </div>
    </div>
  ))
}
