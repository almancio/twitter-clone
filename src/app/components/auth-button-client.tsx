'use client'

import { type Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function AuthButtonClient({ session }: { session: Session | null }) {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const handleLogIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleLogOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return !session ? (
    <button className='tex-xs text-gray-400 hover:text-gray-100' onClick={handleLogIn}>
      Log in with GitHub
    </button>
  ) : (
    <button className='tex-xs text-gray-400 hover:text-gray-100' onClick={handleLogOut}>
      Log out
    </button>
  )
}
