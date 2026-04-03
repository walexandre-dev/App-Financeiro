export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T12:00:00')
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr + 'T12:00:00')
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date)
}

export const formatMonth = (dateStr: string): string => {
  const date = new Date(dateStr + '-01T12:00:00')
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(date)
}

export const getCurrentMonthRange = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

export const getMonthRange = (year: number, month: number) => {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

export const generateId = (): string =>
  crypto.randomUUID()
