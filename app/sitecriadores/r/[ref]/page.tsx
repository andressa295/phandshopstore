'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import styles from './RefPage.module.css'

function getNomeParceiro(ref: string) {
  if (!ref) return 'um parceiro Phandshop';
  return ref
    .split('-')
    .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');
}

// MUDANÇA 2: A função agora não recebe mais 'params' como propriedade
export default function RefPage() {
  const router = useRouter()
  // MUDANÇA 3: Usamos o hook para pegar os parâmetros da URL
  const params = useParams<{ ref: string }>();

  const nomeParceiro = getNomeParceiro(params.ref);

  useEffect(() => {
    // O resto do código funciona exatamente igual!
    if (typeof window !== 'undefined' && params.ref) {
      localStorage.setItem('phandshop_ref', params.ref)
    }

    const timer = setTimeout(() => {
      router.replace('/cadastro') 
    }, 2000);

    return () => clearTimeout(timer);

  }, [params.ref, router])

  return (
    <main className={styles.container}>
      <div className={styles.box}>
        <Image 
          src="/logo.png"
          alt="Phandshop"
          width={200}
          height={50}
        />
        <p className={styles.text}>
          Você foi indicado por <strong>{nomeParceiro}</strong>.
        </p>
        <p className={styles.subtext}>
          Seja bem-vindo(a)! Estamos te redirecionando para a criação da sua loja...
        </p>
        <div className={styles.spinner}></div>
      </div>
    </main>
  )
}