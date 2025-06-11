'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RefPage({ params }: { params: { ref: string } }) {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('phandshop_ref', params.ref)
      router.replace('/') // ou para a página de criação de loja
    }
  }, [params.ref, router])

  return null // Pode colocar um loading se quiser
}
