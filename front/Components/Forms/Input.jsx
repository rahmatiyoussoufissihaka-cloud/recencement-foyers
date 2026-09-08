
/**
 * @param {string} value
 * @param {string} label
 * @param {(v:boolean)=>void} onChange
 */
import { useId } from "react"

export function Input({label, value, onChange, placeholder,required = false, type }) {
    const id= useId()
    return <div className="my-3 row align-items-center mx-2">
        <label htmlFor={id}
         className="form-label col-sm-4 col-form-label fw-bold ">
            {label} 
            {required && (        
                <span className="text-danger">*</span>
        )}
        </label>
        <div className="col-sm-8">
            <input id={id} 
            type={type}
             placeholder={placeholder}
             className="form-control border-2 border-dark " 
              value={value}
               onChange={(e)=>onChange(e.target.value)}  
               required={required} />
      
        </div>
        
    </div>
}





 
