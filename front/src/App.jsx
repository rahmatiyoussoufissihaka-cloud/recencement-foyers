import { useState } from 'react'
import { Input } from '../Components/Forms/Input'
import { Button } from '../Components/Forms/Button'
import { Checkbox } from '../Components/Forms/Checkbox'

function App() {

 const [editingId, setEditingId]=useState(null)
const [items, setItems] =useState([
  {
  id:1,
  nomResponsable: "Amina Soilihi",
  adresse: "12 rue des Manguiers",
  commune: "Mamoudzou",
  nombrePersonnes: 4,
  checked: true,
  telephone: "+269 45 67 890"
},
{

  id:2,
  nomResponsable: "Saidou Abdou",
  adresse: "Karthala",
  commune: "Moroni",
  nombrePersonnes: 14,
  checked: false,
  telephone: "+269 33 12 345"
},
{
  id:3,
  nomResponsable: " Moussa Ibrahim",
  adresse: "Quartier 3",
  commune: "Ouani",
  nombrePersonnes: 7,
  checked: true,
  telephone: "+269 34 05 736"
}
])


const [formData, setFormData] = useState({
  nomResponsable: '',
  adresse: '',
  commune: '',
  nombrePersonnes: '',
  telephone: ''
})

const handleChange = (target) => {
  const { name, value } = target;
  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
}


// Ajouter une formulaire

   const handleAdd= (e)=>{
    e.preventDefault()
    if (!formData.nomResponsable || 
      !formData.nombrePersonnes ||
       !formData.adresse || 
       !formData.commune || 
       !formData.telephone) {
      alert("Remplissez tous les champs");
      return;
    }
 const newItem= {
  id: Date.now(),
  nomResponsable: formData.nomResponsable,
  adresse: formData.adresse,
  commune: formData.commune,
  nombrePersonnes: parseInt(formData.nombrePersonnes),
  checked: false,
  telephone: formData.telephone

 }
 console.log(newItem)
 setItems(prev=>[...prev, newItem]);
 setFormData({
  nomResponsable: '',
  adresse: '',
  commune: '',
  nombrePersonnes: '',
  telephone: ''
 })


   }


//Sauvegarder les modifications du formulaire
  const handleSave=(e)=>{
    e.preventDefault()
    if (!formData.nomResponsable ||
       !formData.nombrePersonnes || 
      !formData.adresse || 
      !formData.commune || 
      !formData.telephone) {
      alert("Remplissez tous les champs");
      return;
    }

  setItems((prev) =>
      prev.map((items) =>
        items.id === editingId
          ? {
              ...items,
              nomResponsable: formData.nomResponsable,
              adresse: formData.adresse,
              commune: formData.commune,
              nombrePersonnes: parseInt(formData.nombrePersonnes),
              telephone: formData.telephone
            }
          : items
      )
    );
      setEditingId(null)
      setFormData({
      nomResponsable: "",
      adresse: '',
    commune: '',
    nombrePersonnes: '',
     telephone: ""
    })
    }
  
//Supprimer un élément de la liste
const handleDelete=(id)=>{
  const selectedItems = items.filter((item)=>item.checked)    
  if(selectedItems.length ===0){
    alert("veillez sélectionner au moins un élément à supprimer.")
    return;
  }  
   const confirmation =window.confirm('Etes-vous sûr de vouloir supprimer ceci?')
        if(!confirmation ){
          return;
           
        }
setItems(items.filter((item)=>!item.checked))
    }

 // Cocher ou décocher un élément de la liste   
const handleCheck=(id)=>{
        setItems(items.map((item)=>item.id===id?
        {...item, checked: !item.checked}:item))
    }
   
 // Modifier le formulaire   
const handleEdit=(item)=>{
  setFormData({
    nomResponsable: item.nomResponsable,
    adresse: item.adresse,
    commune: item.commune,
    nombrePersonnes: item.nombrePersonnes,
    telephone: item.telephone
  })
  setEditingId(item.id)

}

// Nombre total des personnes recensées
const totalPersonnes = items.reduce((total, item) => total + item.nombrePersonnes, 0);


return(
<div className='container my-3'>
  <h1 className='mb-3 p-2 fw-bold'>Recensement des Foyers</h1>
  <h2 className='mb-3 p-2 fw-bold'> Formulaire à remplir </h2>
  <form className='mb-3 p-2 border border-secondary  rounded'>
    <Input
     label="Nom du responsable" 
     name="nomResponsable" 
     value={formData.nomResponsable} 
     onChange={(value) => handleChange({ name: "nomResponsable", value })} />
    <Input 
    label="Adresse" 
    name="adresse"
     value={formData.adresse} 
     onChange={(value) => handleChange({ name: "adresse", value })} />
    <Input 
    label="Commune" 
    name="commune"
     value={formData.commune}
      onChange={(value) => handleChange({ name: "commune", value })} />
    <Input
     label="Nombre de personnes"
      name="nombrePersonnes" 
      value={formData.nombrePersonnes}
       onChange={(value) => handleChange({ name: "nombrePersonnes", value })} />
    <Input
     label="Numero de Téléphone" 
     type="tel" 
     name="telephone" 
     value={formData.telephone}
      onChange={(value) => handleChange({ name: "telephone", value })} />

      {editingId === null? (
        <Button onClick={handleAdd} >
          Ajouter
        </Button>
      ): (
        <Button onClick={handleSave} >
          Sauvegarder
        </Button>
      )}
  </form>

   <hr />
<div>
<h2 className='mb-3 p-2 fw-bold'>Liste des foyers</h2>
<span className='fw-bold'>
   {items.length} formulaires
</span>
<br />
<span className='fw-bold'>Nombre des personnes recensées : {totalPersonnes}</span>


</div>
  <table className="table table-striped table-bordered border-secondary table-info mt-3">
    <thead>
      <tr>
        <th>Cocher pour selectionner</th>
        <th>Nom du responsable</th>
        <th>Adresse</th>
        <th>Commune</th>
        <th>Nombre de personnes</th>
        <th>Numero de Téléphone</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
     
      {items.map((item) => (
        <tr key={item.id}>
          <td>
            <Checkbox
              checked={item.checked}
              onCheck={() => handleCheck(item.id)}
              label="Coche pour sélectionner"
            />

        </td>
          <td>{item.nomResponsable}</td>
          <td>{item.adresse}</td>
          <td>{item.commune}</td>
          <td>{item.nombrePersonnes}</td>
          <td>{item.telephone}</td>
          <td>
            <Button onClick={() => handleEdit(item)}>Modifier</Button>
            
          </td>
        </tr>
      ))}
    </tbody>
  </table>
<Button  className="btn btn-danger" onClick={ handleDelete}>Supprimer</Button>
</div>

)

}


export default App
