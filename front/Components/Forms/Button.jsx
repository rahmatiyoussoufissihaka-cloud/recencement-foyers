export function Button({  onClick, children, disabled }) {
  return (
    <button  type="button" onClick={onClick} disabled={disabled}  className="btn btn-primary my-2">
      {children}
    </button>
  )
}