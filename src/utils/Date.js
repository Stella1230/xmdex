import dayjs from 'dayjs'

export const parseTime = (v) => {
  if (!v) return '-'
  const cleaned = String(v).replace(/\s+[A-Z]{2,4}\s+/, ' ')
  const d = dayjs(cleaned)
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : '-'
}
