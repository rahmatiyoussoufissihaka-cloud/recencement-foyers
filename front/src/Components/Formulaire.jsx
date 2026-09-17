import {  useState, useEffect, useRef, forwardRef, useImperativeHandle} from "react"
import { Input } from "../Components/Forms/Input";
import { Button } from "../Components/Forms/Button";

const Formulaire = forwardRef(({ onSave, onCancel, fullData }, ref) => {  
    const [formData, setFormData] = useState({
        nomResponsable: '',
        adresse: '',
        commune: '',
        nombrePersonnes: '',
        telephone: ''
    })
  
    useEffect(() => {
        if (fullData) {
        setFormData({ nomResponsable: fullData.nomResponsable, adresse: fullData.adresse, commune: fullData.commune, nombrePersonnes:fullData.nombrePersonnes, telephone: fullData.telephone });
        } else {
        setFormData({  nomResponsable: '',
        adresse: '',
        commune: '',
        nombrePersonnes: '',
        telephone: '' });
        }
    }, [fullData]); 

  // Crée une référence locale reliée directement à la case HTML de saisie
  const inputNomRef = useRef(null);

  //Exposer la fonction "donnerLeFocus" vers le fichier App.jsx
  useImperativeHandle(ref, () => ({
    donnerLeFocus: () => {
      if (inputNomRef.current) {
        inputNomRef.current.focus(); // Active le curseur d'écriture
      }
    }
  }));

  

const editingId = fullData !== null;

  const handleChange = ({ name, value }) => {
  
  setFormData((prev) => {
    return {
      ...prev,
      [name]: value
    };
  });
};

  //Sauvegarder 
  const handleSubmit = (e) => {
    e.preventDefault();
    // Vérifier  si le numero de téléphone est valide
    const phoneRegex = /^\+?[0-9\s-]+$/; 
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      alert("⚠️ Le numéro de téléphone n'est pas valide.");
      return;
    }  
    // convertir le nombre de personnes en entier
    const nombre= parseInt(formData.nombrePersonnes, 10);

    // Vérifier que c'est un entier supérieur ou égal à 1
    if (isNaN(nombre) || nombre < 1) {
      alert("⚠️ Le nombre de personnes doit être un entier supérieur ou égal à 1.");
      return;
    }
    const donneesPropres = {
    ...formData,
    nombrePersonnes: nombre 
    };
    onSave(donneesPropres);
    // vide le formulaire 
    setFormData({ nomResponsable: '',
        adresse: '', 
        commune: '', 
        nombrePersonnes: '', 
        telephone: ''});
    // Message de confirmation apres ajout
    alert("✅ Foyer enregistré avec succès !")        
  };
   // gérer l'annulation
    const gererAnnulation = () => {
        // On remet le formulaire à blanc localement
        setFormData({ nomResponsable: '', adresse: '', commune: '', nombrePersonnes: '', telephone: '' });       
        // On prévient le parent pour quitter le mode édition
        onCancel(); 
    };

   // verifier si le formulaire est vide
   const isFormEmpty = !formData.nomResponsable && 
        !formData.adresse && 
        !formData.commune && 
        !formData.nombrePersonnes &&
        !formData.telephone;

  return (
    <div>
        <h2 className='mb-3 p-2 fw-bold'> Formulaire à remplir </h2>
        <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            {editingId?(<span className="mx-3 fw-bold">
                Modifier le foyer
               </span>):(<span className="mx-3 fw-bold">
                  Ajouter un foyer
               </span>
               )
            }
            <hr className="flex-grow-1" />
        </div>
        <form onSubmit={handleSubmit} 
           className="bg-white rounded shadow-sm border-1 border py-3 m-2 row">
          <div>
                <Input
                ref={inputNomRef} 
                onChange={(value) => handleChange({ name: "nomResponsable", value })} 
                type="text"
                label="Nom du responsable" 
                name="nomResponsable" 
                value={formData.nomResponsable} 
                required={true}  />
           </div>
           <div className='col-md-6'>
                <Input 
                    type="text"
                    label="Adresse" 
                    name="adresse"
                    value={formData.adresse} 
                    onChange={(value) => handleChange({ name: "adresse", value})} 
                    required={true} 
                />
            </div>
            <div className='col-md-6'>
                <Input 
                    type="text"
                    label="Commune" 
                    name="commune"
                    value={formData.commune}
                    onChange={(value) => handleChange({ name: "commune", value})} 
                    required={true} 
                />
            </div>
            <div className='col-md-6'>
                <Input
                    label="Nombre de personnes"
                    type="number"
                    min="1"
                    step="1"
                    name="nombrePersonnes" 
                    value={formData.nombrePersonnes}
                    onChange={(value) => handleChange({ name: "nombrePersonnes", value})} 
                    required={true} 
                />
            </div>
            <div className='col-md-6 '>
                <Input
                label="Numero de Téléphone" 
                type="tel" 
                name="telephone" 
                value={formData.telephone}
                placeholder="Ex: +269 321 45 67"
                onChange={(value) => handleChange({ name: "telephone", value})} />
            </div>
            {editingId?(
                <div className="row mt-2 ">
                    <div className='col-md-6 col-12'>
                        <Button type="submit"
                            disabled={isFormEmpty}
                            className="btn btn-success px-4  py-2 w-75"> 
                            Mettre à jour
                        </Button>
                    </div>
                    <div className='col-md-6 col-12'>
                        <Button type='button' 
                            onClick={ gererAnnulation} 
                            className="btn btn-warning px-4  py-2 w-50 ">
                                Annuler
                        </Button>
                    </div>
                </div>
                ):
                (
                   <div className="row mt-2 ">
                        <div className='col-md-6  col-12'>
                            <Button 
                                type='button'
                                onClick={() => setFormData({ nomResponsable: '', commune: '', telephone: '', nombrePersonnes: '', adresse: ''})}
                                className="btn btn-secondary px-4 py-2  m-1 w-75">
                                Réinitialiser
                            </Button>
                        </div>
                        <div className='col-md-6 col-12'>
                            <Button
                                type ="submit"
                                disabled={isFormEmpty} 
                                className="btn btn-primary px-4  py-2 m-1 w-75">
                                Ajouter
                            </Button>
                        </div>
                    </div>)
                }
            </form>
       </div>
   );
});

export default Formulaire;



