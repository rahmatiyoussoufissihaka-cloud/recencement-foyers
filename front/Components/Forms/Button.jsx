export function Button({  onClick, children, disabled }) {
  return (
    <button  type="button" onClick={onClick} disabled={disabled}  className="btn btn-primary m-1">
      {children}
    </button>
  )
}