
/**
 * @param {string} value
 * @param {string} label
 * @param {(v:boolean)=>void} onChange
 */
import { useId } from "react"

export function Input({label, value, onChange }) {
    const id= useId()
    return <div className="my-3 row align-items-center mx-2">
        <label htmlFor={id} className="form-label col-sm-3 col-form-label fw-bold ">
            {label} :
        </label>
        <div className="col-sm-9">
            <input id={id} type="text" className="form-control border-2 border-dark "  value={value} onChange={(e)=>onChange(e.target.value)} />
      
        </div>
        
    </div>
}





 
