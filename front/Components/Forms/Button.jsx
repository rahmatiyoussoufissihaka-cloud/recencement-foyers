/**
 * 
 * @param {(event)=>void} onClick 
 * @param {string} children 
 * @param {boolean} disabled 
 * @param {string} className 
 * @returns 
 */


export function Button({  onClick, children, disabled, className}) {
  return (
    <button  type="button" onClick={onClick} disabled={disabled}  className={className}>
      {children}
    </button>
  )
}