import type { ReactNode } from 'react'

interface HeaderProps {
  title: string
  subtitle: string
  children?: ReactNode
}

export default function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-slate-500">{subtitle}</p>
      </div>
      {children}
    </header>
  )
}
