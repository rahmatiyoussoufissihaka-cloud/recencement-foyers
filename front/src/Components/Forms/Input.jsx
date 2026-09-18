import { useId, forwardRef } from "react"

/**
 * @param {string} value
 * @param {string} label
 * @param {boolean} required
 * @param {string} type
 * @param {string} placeholder
 * 
 * @param {(event)=>void} onChange
 */


export const Input=forwardRef (function Input({label, value, onChange, placeholder, required = false, type,onKeyDown }, ref) {
    const id= useId()
    return <div className="align-items-center mx-2">
        <label htmlFor={id}
         className="form-label col-form-label fw-bold ">
            {label} 
            {required && (        
                <span className="text-danger">*</span>
        )}
        </label>
        <div>
            <input id={id} 
            ref={ref}
            type={type}
             placeholder={placeholder}
             className="form-control border-2 shadow-sm m-1 " 
              value={value}
               onChange={(e)=>onChange(e.target.value)}  
               onKeyDown={onKeyDown}
               required={required} />
      
        </div>
        
    </div>
})





 
