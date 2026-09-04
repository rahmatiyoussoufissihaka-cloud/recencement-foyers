/**
 * @param {boolean} checked
 * @param {(v:boolean)=>void} onCheck
 * @param {string} label
 */




export function Checkbox({checked, onCheck}){
  
    return<div>
       
         <input  type="checkbox" className="form-check-input mx-2" onChange={(e)=>onCheck(e.target.checked)} checked={checked} />
       
       
    </div>
}