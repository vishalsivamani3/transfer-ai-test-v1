'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

export default function SignOutButton({ className = '' }: { className?: string }) {
  const router = useRouter()
  const { actions } = useAuth()

  const handleClick = async () => {
    await actions.signOut()
    router.refresh()   // re-render any server components that depend on auth
    router.push('/')   // send user somewhere neutral
  }

  return (
    <button onClick={handleClick} className={className}>
      Sign out
    </button>
  )
}