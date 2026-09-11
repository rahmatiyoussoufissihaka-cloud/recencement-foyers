/**
 * @param {boolean} checked
 * @param {(event)=>void} onCheck
 * @param {string} label
 */
import { useId } from "react"



export function Checkbox({checked, onCheck, label}){
  const id= useId()
    return<div>
        
         <input id= {id}  type="checkbox" className="form-check-input mx-2" onChange={(e)=>onCheck(e.target.checked)} checked={checked} />
         <label className="form-check-label fw-bold" htmlFor={id} >{label}</label>
       
       
    </div>
}