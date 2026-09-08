export function Button({  onClick, children, disabled, className}) {
  return (
    <button  type="button" onClick={onClick} disabled={disabled}  className={className}>
      {children}
    </button>
  )
}