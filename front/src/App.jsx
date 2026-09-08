import { useState , useRef} from 'react'
import { Input } from '../Components/Forms/Input'
import { Button } from '../Components/Forms/Button'
import { Checkbox } from '../Components/Forms/Checkbox'

function App() {

 const [editingId, setEditingId]=useState(null)
 const [isChecked, setIsChecked] = useState(false);
const [items, setItems] =useState([
  {
  id:1,
  nomResponsable: "Amina Soilihi",
  adresse: "Pangani",
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
   
// Vérifier les champs obligatoires
    if (!formData.nomResponsable || 
      !formData.nombrePersonnes ||
       !formData.adresse || 
       !formData.commune) {
      alert("Remplissez tous les champs obligatoirs");
      return;
    }

   // Vérifier  si le numero de téléphone est valide
    const phoneRegex = /^\+?\d{1,3}[- ]?\d{1,4}[- ]?\d{1,4}[- ]?\d{1,9}$/;
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      alert("Le numéro de téléphone n'est pas valide.");
      return;
    }  
     
// convertir le nombre de personnes en entier
    const nombrePersonnes = parseInt(formData.nombrePersonnes, 10);

    // Vérifier que c'est un entier supérieur ou égal à 1
    if (isNaN(nombrePersonnes) || nombrePersonnes < 1) {
      alert("Le nombre de personnes doit être un entier supérieur ou égal à 1.");
      return;
    }


// Ajouter le formulaire
 const newItem= {
  id: Date.now(),
  nomResponsable: formData.nomResponsable,
  adresse: formData.adresse,
  commune: formData.commune,
  nombrePersonnes: nombrePersonnes,
  checked: false,
  telephone: formData.telephone

 }


//Vider le formulaire après l'ajout
 setItems(prev=>[...prev, newItem]);
 setFormData({
  nomResponsable: '',
  adresse: '',
  commune: '',
  nombrePersonnes: '',
  telephone: ''
 });

// Message de confirmation
 alert("Formulaire ajouté avec succès !")
 }


// verifier si le formulaire est vide
const isFormEmpty = !formData.nomResponsable && 
!formData.adresse && 
!formData.commune && 
!formData.nombrePersonnes &&
!formData.telephone;

// Désactiver le bouton Ajouter si le formulaire est vide
const isAddDisabled = isFormEmpty;

//Sauvegarder les modifications du formulaire
  const handleSave=(e)=>{
    e.preventDefault()
    // Vérifier les champs obligatoires
    if (!formData.nomResponsable ||
       !formData.nombrePersonnes || 
      !formData.adresse || 
      !formData.commune) {
      alert("Remplissez tous les champs");
      return;
    }

  // Vérifier  si le numero de téléphone est valide
    const phoneRegex = /^\+?\d{1,3}[- ]?\d{1,4}[- ]?\d{1,4}[- ]?\d{1,9}$/;
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      alert("Le numéro de téléphone n'est pas valide.");
      return;
    }


  // convertir le nombre de personnes en entier
    const nombrePersonnes = parseInt(formData.nombrePersonnes, 10);
   
  //verifier que c'est un entier supérieur ou égal à 1

    if (isNaN(nombrePersonnes) || nombrePersonnes < 1) {
      alert("Le nombre de personnes doit être un entier supérieur ou égal à 1.");
      return;
    }

  // Ajouter les modifications à l'élément correspondant dans la liste
  setItems((prev) =>
      prev.map((items) =>
        items.id === editingId
          ? {
              ...items,
              nomResponsable: formData.nomResponsable,
              adresse: formData.adresse,
              commune: formData.commune,
              nombrePersonnes: nombrePersonnes,
              telephone: formData.telephone
            }
          : items
      )
    );
 // Réinitialiser le formulaire
      setEditingId(null)
      setFormData({
      nomResponsable: "",
      adresse: '',
    commune: '',
    nombrePersonnes: '',
     telephone: ""
    })

    // Message de confirmation
 alert("✅ Modifications enregistrées avec succès !")
    }
  
//Supprimer un élément de la liste
const handleDelete=(id)=>{
   const confirmation =window.confirm('Etes-vous sûr de vouloir supprimer ceci?')
        if(!confirmation ){
          return;
           
        }
setItems(items.filter((item)=>item.id !==id))

  
    // Message de confirmation
 alert("✅ Élément supprimé avec succès !")
    }
   

const formRef= useRef(null)
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

  // Aller vers le formulaire
  setTimeout(() => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 0);

}

// Nombre total des personnes recensées
const totalPersonnes = items.reduce((total, item) => total + item.nombrePersonnes, 0);


return(
<div className='container my-3'>
  <h1 className='mb-3 p-2 fw-bold'>Recensement des Foyers</h1>
  <h2 className='mb-3 p-2 fw-bold'> Formulaire à remplir </h2>

  <div className="d-flex align-items-center my-4">
  <hr className="flex-grow-1" />

  {editingId?(<span className="mx-3 fw-bold">
   
    Modifier un foyer
  </span>):(<span className="mx-3 fw-bold">
     Ajouter un foyer
  </span>
)
 }
  <hr className="flex-grow-1" />
</div>

  <form ref={formRef} className='mb-3 p-2 border border-secondary  rounded'>
    <Input
     type="text"
     label="Nom du responsable" 
     name="nomResponsable" 
     value={formData.nomResponsable} 
     onChange={(value) => handleChange({ name: "nomResponsable", value })}
     required={true} />
     <hr className="border-1 border-dark" />
    <Input 
     type="text"
    label="Adresse" 
    name="adresse"
     value={formData.adresse} 
     onChange={(value) => handleChange({ name: "adresse", value })} 
     required={true} />
     
     <hr className=" border-1 border-dark" />
    <Input 
    type="text"
    label="Commune" 
    name="commune"
     value={formData.commune}
      onChange={(value) => handleChange({ name: "commune", value })} 
      required={true} />
      <hr className="border-1 border-dark" />
    <Input
     label="Nombre de personnes"
     type="number"
     min="1"
     step="1"
      name="nombrePersonnes" 
      value={formData.nombrePersonnes}
       onChange={(value) => handleChange({ name: "nombrePersonnes", value })} 
       required={true} />
       <hr className="border-1 border-dark" />
    <Input
     label="Numero de Téléphone" 
     type="tel" 
     name="telephone" 
     value={formData.telephone}
      placeholder="Ex: +269 321 45 67"
      onChange={(value) => handleChange({ name: "telephone", value })} />
      <hr className="border-1 border-dark" />

      {editingId === null? (
        <Button onClick={handleAdd} disabled={isAddDisabled} className="btn btn-primary">
          Ajouter
        </Button>
      ): (
        <Button onClick={handleSave} disabled={isAddDisabled} className="btn btn-success"> 
          Sauvegarder
        </Button>
      )}
  </form>

   <hr   className="w-75 mx-auto my-4 border-2 border-dark" />
   <label className="form-check-label fw-bold">
      {isChecked ? "Masquer la liste des foyers" : "Afficher la liste des foyers"}
    </label>
   <Checkbox checked={isChecked} onCheck={setIsChecked} />
   {isChecked && <div className="mt-5">
    
    <div>
<div className="d-flex align-items-center my-4">
  <hr className="flex-grow-1" />

  <span className="mx-3 fw-bold">
    Liste des foyers
  </span>

  <hr className="flex-grow-1" />
</div>

<span className='fw-bold mb-4'>
   Nombre de foyers : {items.length}
</span>
<br />
<span className='fw-bold mt-3'>Nombre des personnes recensées : {totalPersonnes}</span>
</div>
<div className='table-responsive'>
  <table className="table table-hover align-middle text-center table-striped table-bordered border-secondary table-info mt-3">
    <thead>
      <tr>
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
          <td className='align-item-center'>{item.nomResponsable}</td>
          <td>{item.adresse}</td>
          <td>{item.commune}</td>
          <td>{item.nombrePersonnes}</td>
          <td>{item.telephone}</td>
          <td>
            <Button onClick={() => handleEdit(item)} className="btn btn-primary m-1" >Modifier</Button>
            <Button onClick={()=> handleDelete(item.id)} className="btn btn-danger m-1s">
             Supprimer
             </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    
    </div>}

</div>

)

}


export default App
