export function BrandMark({ small = false }) {
  return (
    <img
      src="/logo_2.png"
      alt="Mahamma logo"
      className={small ? 'h-6 w-6 rounded object-contain' : 'h-10 w-10 rounded-lg object-contain'}
    />
  )
}
