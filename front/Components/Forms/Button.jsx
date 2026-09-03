export function Button({  onClick, children}) {
  return (
    <button  type="button" onClick={onClick}  className="btn btn-primary my-2">
      {children}
    </button>
  )
}