'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './RefPage.module.css'

// Função simples para transformar o slug em um nome mais amigável
// Em um app real, isso poderia buscar o nome do parceiro no banco de dados
function getNomeParceiro(ref: string) {
  if (!ref) return 'um parceiro Phandshop';
  // Transforma 'britney-silva' em 'Britney Silva'
  return ref
    .split('-')
    .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');
}

export default function RefPage({ params }: { params: { ref: string } }) {
  const router = useRouter()
  const nomeParceiro = getNomeParceiro(params.ref);

  useEffect(() => {
    // A lógica de salvar no localStorage continua a mesma
    if (typeof window !== 'undefined' && params.ref) {
      localStorage.setItem('phandshop_ref', params.ref)
    }

    // Após um pequeno delay para o usuário ler a mensagem, redireciona
    const timer = setTimeout(() => {
      // MUDANÇA: Redireciona para o cadastro, que é o próximo passo lógico
      router.replace('/cadastro') 
    }, 2000); // 2 segundos de delay

    // Limpa o timer se o componente for desmontado
    return () => clearTimeout(timer);

  }, [params.ref, router])

  // Em vez de retornar 'null', agora retornamos uma página de boas-vindas
  return (
    <main className={styles.container}>
      <div className={styles.box}>
        <Image 
          src="/logo.png" // Use a logo branca para o modo dark
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