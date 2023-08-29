'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Likes({
  tweet,
  addOptimisticTweet,
}: {
  tweet: TweetWithAuthor
  addOptimisticTweet: (newTweet: TweetWithAuthor) => void
}) {
  const router = useRouter()
  const handleLikes = async () => {
    const supabase = createClientComponentClient<Database>()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      if (tweet.user_has_liked_tweet) {
        addOptimisticTweet({ ...tweet, likes: tweet.likes - 1, user_has_liked_tweet: !tweet.user_has_liked_tweet })
        await supabase.from('likes').delete().match({ user_id: user.id, tweet_id: tweet.id })
      } else {
        addOptimisticTweet({ ...tweet, likes: tweet.likes + 1, user_has_liked_tweet: !tweet.user_has_liked_tweet })
        await supabase.from('likes').insert({ user_id: user.id, tweet_id: tweet.id })
      }
      router.refresh()
    }
  }

  return (
    <button className='group flex items-center' onClick={handleLikes}>
      <svg
        className={`group-hover:stroke-red-600 group-hover:fill-red-600 ${
          tweet.user_has_liked_tweet ? 'stroke-red-600 fill-red-600' : 'fill-none stroke-slate-600'
        }`}
        width='16'
        height='16'
        viewBox='0 0 24 24'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'>
        <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
        <path d='M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572'></path>
      </svg>
      <span
        className={`group-hover:text-red-600 text-sm ml-1 ${
          tweet.user_has_liked_tweet ? 'text-red-600' : 'stroke-slate-600'
        }`}>
        {tweet.likes}
      </span>
    </button>
  )
}
