// /app/api/salvar-tema/route.ts
import { NextResponse } from 'next/server'
import { themeSchema } from '@/app/(painel)/personalizar/lib/themeSchema'

export async function POST(req: Request) {
  const body = await req.json()

  const result = themeSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', issues: result.error.flatten() },
      { status: 400 }
    )
  }

  const temaValidado = result.data

  // aqui você salvaria no banco ou onde quiser
  return NextResponse.json({ ok: true, data: temaValidado })
}
