'use client'

import React, { useState } from 'react'

type Produto = {
  id: number
  nome: string
  categoria: string
  estoque: number
  preco: number
  ativo: boolean
  imagem: string
}

const produtosMock: Produto[] = [
  {
    id: 1,
    nome: 'Camiseta Roxa',
    categoria: 'Vestuário',
    estoque: 120,
    preco: 59.9,
    ativo: true,
    imagem: 'https://via.placeholder.com/100x100.png?text=Camiseta+Roxa',
  },
  {
    id: 2,
    nome: 'Tênis Casual',
    categoria: 'Calçados',
    estoque: 45,
    preco: 199.9,
    ativo: true,
    imagem: 'https://via.placeholder.com/100x100.png?text=Tênis+Casual',
  },
  {
    id: 3,
    nome: 'Caneca Personalizada',
    categoria: 'Acessórios',
    estoque: 0,
    preco: 39.9,
    ativo: false,
    imagem: 'https://via.placeholder.com/100x100.png?text=Caneca+Personalizada',
  },
]

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState(produtosMock)
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  function toggleModal() {
    setModalAberto(!modalAberto)
  }

  function gerarCatalogoMeta(produtos: Produto[]) {
    return produtos.map(prod => ({
      id: prod.id.toString(),
      title: prod.nome,
      description: '', // você pode adicionar descrição depois
      availability: prod.estoque > 0 ? 'in stock' : 'out of stock',
      condition: 'new',
      price: `${prod.preco.toFixed(2)} BRL`,
      link: `https://phandshop.com/produto/${prod.id}`,
      image_link: prod.imagem,
      brand: 'Phandshop',
    }))
  }

  function baixarCatalogoMeta() {
    const catalogo = gerarCatalogoMeta(produtos)
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(catalogo, null, 2))
    const dlAnchorElem = document.createElement('a')
    dlAnchorElem.setAttribute('href', dataStr)
    dlAnchorElem.setAttribute('download', 'catalogo-meta.json')
    dlAnchorElem.click()
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#3b0d64' }}>
      <h1 style={{ marginBottom: '20px' }}>Lista de Produtos</h1>

      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={toggleModal}
          style={{
            padding: '10px 15px',
            backgroundColor: '#6b21a8',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          + Adicionar Produto
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#ddd' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Foto</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>ID</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Nome</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Categoria</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Estoque</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Preço (R$)</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                Nenhum produto encontrado.
              </td>
            </tr>
          ) : (
            produtosFiltrados.map(prod => (
              <tr key={prod.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={prod.imagem}
                    alt={prod.nome}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{prod.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{prod.nome}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{prod.categoria}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{prod.estoque}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  {prod.preco.toFixed(2).replace('.', ',')}
                </td>
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    color: prod.ativo ? 'green' : 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {prod.ativo ? 'Ativo' : 'Inativo'}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  <button
                    style={{
                      marginRight: '10px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      backgroundColor: '#4c1d95',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                    }}
                    onClick={() => alert(`Editar produto ${prod.nome}`)}
                  >
                    Editar
                  </button>
                  <button
                    style={{
                      padding: '5px 10px',
                      cursor: 'pointer',
                      backgroundColor: '#a21caf',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                    }}
                    onClick={() => alert(`Excluir produto ${prod.nome}`)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button
        onClick={baixarCatalogoMeta}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          backgroundColor: '#4267B2',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Exportar Catálogo Facebook/Meta
      </button>

      {modalAberto && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={toggleModal}
        >
          <div
            style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', minWidth: '300px' }}
            onClick={e => e.stopPropagation()}
          >
            <h2>Adicionar Produto (Mock)</h2>
            <p>Funcionalidade futura para cadastrar produto.</p>
            <button onClick={toggleModal} style={{ marginTop: '20px' }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
