import { useState , useRef, useEffect} from 'react'
import { Input } from '../Components/Forms/Input'
import { Button } from '../Components/Forms/Button'
import { Switch } from '../Components/Forms/Switch'

function App() {

 const [editingId, setEditingId]=useState(null)
 const [showTable, setShowTable] = useState(true);
 //Etat du fitre
 const [communeSelectionnee, setCommuneSelectionnee] = useState("");
 //Etat du tri
 const [tri, setTri] = useState("");
 //Etat de consultation d'un foyer
 const [foyerSelectionne, setFoyerSelectionne] = useState(null);
 //Etat pour stocker les valeurs des items
const [items, setItems] =useState([])
const [formData, setFormData] = useState({
  nomResponsable: '',
  adresse: '',
  commune: '',
  nombrePersonnes: '',
  telephone: ''
})
// Modifier le titre de la page
useEffect(() => {
  document.title = "Recensement des foyers";
}, []);

// Aller vers le formulaire
  useEffect(() => {
  if (editingId !== null) {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [editingId]);  
   
//Créer une reference vers le formulaire
const formRef= useRef(null)

//La fonction handleChange capture l'événement de saisie
const handleChange = (target) => {
  const { name, value } = target;
  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
}

//Consulter un foyer
const handleView = (item) => {
  setFoyerSelectionne(item);
}
 
//Récupérer les communes automatiquement
const communes = [...new Set(
  items.map((item) => item.commune)
)];

// Filtrer et trier 
const foyersFiltresEtTries = [...items]

//Filtrer par commune
  .filter((item) => {
    if (communeSelectionnee === "") {
      return true;
    }

    return item.commune === communeSelectionnee;
  })
  // Trier par nom
    .sort((a, b) => {
  // trier par nom
    if (tri === "nomResponsable") {
   return  a.nomResponsable.localeCompare(b.nomResponsable, "fr", {
        sensitivity: "base",});
   }
  // Trier par nombre de personnes
    if (tri === "nombrePersonnes") {
      
    return  Number(b.nombrePersonnes) - Number(a.nombrePersonnes); 
    }
    return 0;
  });



// Ajouter une formulaire

   const handleAdd= (e)=>{
    e.preventDefault()
   // Vérifier  si le numero de téléphone est valide
    const phoneRegex = /^\+?[0-9\s-]+$/; 
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      alert("⚠️ Le numéro de téléphone n'est pas valide.");
      return;
    }  
     
    // convertir le nombre de personnes en entier
    const nombrePersonnes = parseInt(formData.nombrePersonnes, 10);

    // Vérifier que c'est un entier supérieur ou égal à 1
    if (isNaN(nombrePersonnes) || nombrePersonnes < 1) {
      alert("⚠️ Le nombre de personnes doit être un entier supérieur ou égal à 1.");
      return;
    }

   // Ajouter le formulaire
  const newItem= {
  id: Date.now(),
  nomResponsable: formData.nomResponsable,
  adresse: formData.adresse,
  commune: formData.commune,
  nombrePersonnes: nombrePersonnes,
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

  // Message de confirmation apres ajout
   alert("✅ Formulaire ajouté avec succès !")
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
  // Vérifier  si le numero de téléphone est valide
    const phoneRegex = /^\+?[0-9\s-]+$/;
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      alert("⚠️ Le numéro de téléphone n'est pas valide.");
      return;
    }
  // convertir le nombre de personnes en entier
    const nombrePersonnes = parseInt(formData.nombrePersonnes, 10);
   
  //verifier que c'est un entier supérieur ou égal à 1

    if (isNaN(nombrePersonnes) || nombrePersonnes < 1) {
      alert("⚠️ Le nombre de personnes doit être un entier supérieur ou égal à 1.");
      return;
    }

  // Ajouter les modifications dans la liste
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

  // Message de confirmation apres modification
 alert("✅ Modifications enregistrées avec succès !")
    }
  
//Supprimer un élément de la liste
    const handleDelete=(id)=>{
        const confirmation =window.confirm('Etes-vous sûr de vouloir supprimer ceci?')
          if(!confirmation ){
            return;
        }
setItems(items.filter((item)=>item.id !==id))

  
  // Message de confirmation apres supression
 alert("✅ Élément supprimé avec succès !")
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
const totalPersonnes = items.reduce((total, item) =>
       total + item.nombrePersonnes, 0);


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
  <form ref={formRef}
   onSubmit={editingId?
     handleSave
    :handleAdd
   }
  className=' bg-white rounded shadow-sm border-1 border py-3 m-2 row'>
    <div>
      <Input
     type="text"
     label="Nom du responsable" 
     name="nomResponsable" 
     value={formData.nomResponsable} 
     onChange={(value) => handleChange({ name: "nomResponsable", value })}
     required={true}  />
     
    </div>
    <div className='col-md-6'>
      <Input 
     type="text"
    label="Adresse" 
    name="adresse"
     value={formData.adresse} 
     onChange={(value) => handleChange({ name: "adresse", value })} 
     required={true} />
    </div>
    <div className='col-md-6'>
      <Input 
    type="text"
    label="Commune" 
    name="commune"
     value={formData.commune}
      onChange={(value) => handleChange({ name: "commune", value })} 
      required={true} />
    </div>
      
    <div className='col-md-6'>
      <Input
     label="Nombre de personnes"
     type="number"
     min="1"
     step="1"
      name="nombrePersonnes" 
      value={formData.nombrePersonnes}
       onChange={(value) => handleChange({ name: "nombrePersonnes", value })} 
       required={true} />
    </div>
       
    <div className='col-md-6 '>
      <Input
     label="Numero de Téléphone" 
     type="tel" 
     name="telephone" 
     value={formData.telephone}
      placeholder="Ex: +269 321 45 67"
      onChange={(value) => handleChange({ name: "telephone", value })} />
      
    </div>

      {editingId === null? (
        <div className="row mt-2 ">
          <div className='col-md-6  col-12'>
          <Button 
          type='button'
            onClick={() => setFormData({ nomResponsable: '', commune: '', telephone: '', nombrePersonnes: '', adresse: ''})}
            className="btn btn-secondary px-4 py-2  m-1 w-75"
          >
            Réinitialiser
          </Button>
        </div>
          <div className='col-md-6 col-12'>
            <Button
            type ="submit"
            disabled={isAddDisabled} 
            className="btn btn-primary px-4  py-2 m-1 w-75">
          Ajouter
        </Button>
          </div>
        </div>
      ): (
        <div className='d-flex justify-content-center  mt-2'>
          <Button type="submit"
           disabled={isAddDisabled}
            className="btn btn-success px-4  py-2 w-75"> 
          Sauvegarder
        </Button>
        </div>
      )}
  </form>
   <hr   className="w-75 mx-auto my-4 border-2 border-dark" />
    <Switch 
     checked={showTable}
      onChange={setShowTable}
        id="checked"
         label = {showTable ? "Masquer la liste des foyers" : "Afficher la liste des foyers"} />
   {showTable && <div className="mt-5">
    
    <div>
      
<div className="d-flex align-items-center my-4">
  <hr className="flex-grow-1" />

  <span className="mx-3 fw-bold">
    Liste des foyers
  </span>

  <hr className="flex-grow-1" />
</div>
<div className='row '>
<div className=' col-md-6 mt-3 mb-4'>
  <span className='fw-bold p-3 border border-1 rounded shadow-sm'>
 
   Nombre de foyer(s): {items.length}
</span>
</div>

<div className='col-md-6 mt-3 mb-4'>
  <span className='fw-bold p-3 border border-1 rounded shadow-sm'>
  
  Nombre de personne(s): {totalPersonnes }
  </span>
</div>
</div>
</div>

<div className="row g-3 m-4">

  <div className="col-12 col-md-6">
    <label className="form-label fw-bold">
      Filtrer par commune
    </label>

    <select
      className="form-select"
      value={communeSelectionnee}
      onChange={(e) => setCommuneSelectionnee(e.target.value)}
    >
      <option value="">Toutes les communes</option>

      {communes.map((commune) => (
        <option key={commune} value={commune}>
          {commune}
        </option>
      ))}
    </select>
  </div>
  <div className="col-12 col-md-6">
    <label className="form-label fw-bold">
      Trier par
    </label>

    <select
      className="form-select"
      value={tri}
      onChange={(e) => setTri(e.target.value)}
    >
      <option value="">Aucun tri</option>
      <option value="nomResponsable">Nom</option>
      <option value="nombrePersonnes">
        Nombre de personnes
      </option>
    </select>
  </div>
</div>
<div className='table-responsive'>
  <table className="table table-hover align-middle text-center table-striped table-bordered border-1 shadow-sm table-info mt-3">
    <thead>
      <tr>
        <th>N°</th>
        <th>Nom du responsable</th>
        <th>Commune</th>
        <th>Nombre de personnes</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {foyersFiltresEtTries.length === 0 ? (
    <tr>
      <td colSpan="5" className="text-center py-4">
        Aucun foyer trouvé.
      </td>
    </tr>):(
  foyersFiltresEtTries.map((item, index) => (
        <tr key={item.id}>
          <td>{index + 1}</td>
          <td className='align-item-center'>{item.nomResponsable}</td>
          <td>{item.commune}</td>
          <td>{item.nombrePersonnes}</td>
          <td>
            <Button 
            type='button' 
            onClick={() => handleEdit(item)}
             className="btn btn-primary m-1" >
              Modifier
              </Button>
            <Button 
            type='button'
             onClick={()=> handleDelete(item.id)}
              className="btn btn-danger m-1">
             Supprimer
             </Button>
              <Button 
              type='button'
               onClick={() => handleView(item)} 
               className="btn btn-info m-1" >
               Consulter
               </Button>
          </td>
        </tr>
      ))
    )}
    </tbody>
  </table>
</div>
{foyerSelectionne && (
  <div
    className="modal fade show d-block"  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    tabIndex="-1"
    role="dialog"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
      <div className="modal-header bg-info">
          <h5 className="modal-title">
            Informations du foyer
          </h5>
          <Button
            className="btn-close"
            onClick={() => setFoyerSelectionne(null)}>
            </Button>
        </div>
        <div className="modal-body bg-light">
          <p>
            <strong>Responsable :</strong>{" "}
            {foyerSelectionne.nomResponsable}
          </p>
          <p>
            <strong>Adresse :</strong>{" "}
            {foyerSelectionne.adresse}
          </p>
          <p>
            <strong>Commune :</strong>{" "}
            {foyerSelectionne.commune}
          </p>
          <p>
            <strong>Nombre de personnes :</strong>{" "}
            {foyerSelectionne.nombrePersonnes}
          </p>
          <p>
            <strong>Téléphone :</strong>{" "}
            {foyerSelectionne.telephone}
          </p>
        </div>
        <div className="modal-footer">
          <Button
          type='button'
          className="btn btn-danger "
            onClick={() => setFoyerSelectionne(null)}
          >
          Fermer
          </Button>
        </div>
      </div>
    </div> 
  </div>
)}
</div>}
</div>
)

}


export default App
