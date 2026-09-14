/**
 * 
 * @param {boolean} checked 
 * @param {(e)=>void} onChange 
 * @param {string} label 
 * @returns 
 */

import { useId } from "react"

export function Switch({checked, onChange, label}){
    const id =useId()
return<div className="form-switch">
    <input className="form-check-input mx-2" id= {id} type='checkbox' role='switch' checked={checked} onChange={(e)=>onChange(e.target.checked)}  />
    <label htmlFor={id} className="form-check-label fw-bold">{label}</label>
</div>
}