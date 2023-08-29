import { User, createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function NewTweet({ user }: { user: User }) {
  const addTweet = async (formData: FormData) => {
    'use server'
    const title = String(formData.get('title'))
    const supabase = createServerActionClient<Database>({ cookies })

    await supabase.from('tweets').insert({ title, user_id: user.id })

    revalidatePath('/')
  }

  return (
    <form className='border border-gray-800 border-t-0' action={addTweet}>
      <div className='flex py-8 px-4'>
        <Image className='rounded-full' src={user.user_metadata.avatar_url} alt='user avatar' width={48} height={48} />
        <input
          className='flex-1 bg-inherit ml-2 text-2xl leading-loose placeholder:text-gray-500 px-2'
          name='title'
          placeholder='What is happening?!'
        />
      </div>
    </form>
  )
}
