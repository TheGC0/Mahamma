export function BrandMark({ small = false }) {
  return <span className={`brand-mark${small ? ' brand-mark--small' : ''}`}>M</span>
}
