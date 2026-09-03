export function Checkbox({checked, onCheck}){
    return<div>
        
        <input  type="checkbox" className="form-check-input " onChange={(e)=>onCheck(e.target.checked)} checked={checked} />
        
    </div>
}