export default function timeToStr(hour: number, min: number) {
  return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}
