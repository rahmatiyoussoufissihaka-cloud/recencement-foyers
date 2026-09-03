
/**
 * @param {string} value
 * @param {string} label
 * @param {(v:boolean)=>void} onChange
 */
import { useId } from "react"

export function Input({label, value, onChange }) {
    const id= useId()
    return <div className="mb-3">
        <b htmlFor={id}>{label}</b> 
        <input id={id} type="text" className="form-control border-2 border-dark "  value={value} onChange={(e)=>onChange(e.target.value)} />
        
    </div>
}





 
