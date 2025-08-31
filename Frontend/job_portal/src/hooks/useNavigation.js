'use client'
import { useRouter } from 'next/navigation'

export const useNavigation = () => {
  const router = useRouter()
  
  const navigate = (path) => {
    router.push(path)
  }
  
  return { navigate }
}
