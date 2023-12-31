import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthButtonClient from '../components/auth-button-client'

export const dynamic = 'force-dynamic'

export default async function Login() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/')
  }

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <AuthButtonClient session={session} />
    </div>
  )
}
