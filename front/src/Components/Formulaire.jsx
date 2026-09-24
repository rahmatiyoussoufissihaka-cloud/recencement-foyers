import {  useState, useEffect, useRef, forwardRef, useImperativeHandle} from "react"
import { Input } from "../Components/Forms/Input";
import { Button } from "../Components/Forms/Button";

const Formulaire = forwardRef(({ onSave, fullData, show, setShow }, ref) => {  
    const [formData, setFormData] = useState({
        nomResponsable: '',
        adresse: '',
        commune: '',
        nombrePersonnes: '',
        telephone: ''
    })
     useEffect(() => {
    if (fullData) {
        setFormData({
            nomResponsable: fullData.nomResponsable,
            adresse: fullData.adresse,
            commune: fullData.commune,
            nombrePersonnes: fullData.nombrePersonnes,
            telephone: fullData.telephone
        });
    }
}, [fullData]);

    const nomRef = useRef(null);
    const adresseRef = useRef(null);
    const communeRef = useRef(null);
    const nombreRef = useRef(null);
    const telephoneRef = useRef(null);
    //permetre a la touche entrée de passer au champ suivant
    const handleEnter = (event, nextRef) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if(nextRef){
                nextRef.current?.focus();
            }
            else{
                event.currentTarget.form?.requestSubmit()
            }
         }
    };
  //Exposer la fonction "donnerLeFocus" vers le fichier App.jsx
    useImperativeHandle(ref, () => ({
        donnerLeFocus: () => {
            if (nomRef.current) {
                nomRef.current.focus(); // Active le curseur d'écriture
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
   // verifier si le formulaire est vide
   const isFormEmpty = !formData.nomResponsable && 
        !formData.adresse && 
        !formData.commune && 
        !formData.nombrePersonnes &&
        !formData.telephone;

  return (
    <div>
        <Button type="button" className="btn btn-primary" onClick={setShow} >
            Ajouter un foyer
        </Button>
        {show &&
        <div className="modal fade show d-block " style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {editingId? (<h5 className="fw-bold">Modifier un foyer</h5>):(<h5 className="fw-bold">Ajouter un foyer</h5>) }
                        <Button type="button" className="btn-close" onClick={()=>setShow(null)} ></Button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit} 
                        className="bg-white rounded shadow-sm border-1 border py-3 m-2 row">
                        <div>
                            <Input
                            ref={nomRef}
                            id="nomResponsable"  
                            onChange={(value) => handleChange({ name: "nomResponsable", value })} 
                            type="text"
                            label="Nom du responsable" 
                            name="nomResponsable" 
                            value={formData.nomResponsable} 
                            onKeyDown={(e) => handleEnter(e, adresseRef)}
                            required={true}  />
                        </div>
                        <div className='col-md-6'>
                            <Input 
                                ref={adresseRef}
                                id="adresse"
                                type="text"
                                label="Adresse" 
                                name="adresse"
                                value={formData.adresse} 
                                onChange={(value) => handleChange({ name: "adresse", value})} 
                                onKeyDown={(e) => handleEnter(e, communeRef)}
                                required={true} 
                            />
                        </div>
                        <div className='col-md-6'>
                            <Input 
                                ref={communeRef}
                                id="commune"
                                type="text"
                                label="Commune" 
                                name="commune"
                                value={formData.commune}
                                onChange={(value) => handleChange({ name: "commune", value})}
                                onKeyDown={(e) => handleEnter(e, nombreRef)} 
                                required={true} 
                            />
                        </div>
                        <div className='col-md-6'>
                            <Input
                                ref={nombreRef}
                                id="nombrePersonnes"
                                label="Nombre de personnes"
                                type="number"
                                min="1"
                                step="1"
                                name="nombrePersonnes" 
                                value={formData.nombrePersonnes}
                                onChange={(value) => handleChange({ name: "nombrePersonnes", value})} 
                                onKeyDown={(e) => handleEnter(e, telephoneRef)}
                                required={true} 
                            />
                        </div>
                        <div className='col-md-6 '>
                            <Input
                                ref={telephoneRef}
                                id= "telephone"
                                label="Numero de Téléphone" 
                                type="tel" 
                                name="telephone" 
                                value={formData.telephone}
                                placeholder="Ex: +269 321 45 67"
                                onChange={(value) => handleChange({ name: "telephone", value})}
                                onKeyDown={(e) => handleEnter(e, null)} />
                        </div>
                        {editingId?(
                            <div className=" mt-2 ">
                                <Button type="submit"
                                    disabled={isFormEmpty}
                                    className="btn btn-success px-4  m-1 py-2 w-100"> 
                                    Mettre à jour
                                </Button>
                            </div>):
                            (<div className="mt-2 ">
                                    <Button
                                        type ="submit"
                                        disabled={isFormEmpty} 
                                        className="btn btn-primary px-4  py-2 m-1 w-100">
                                        Ajouter
                                    </Button>              
                            </div>)
                        }
                    </form>
                    <div className="modal-footer">
                        <Button 
                            type='button'
                            onClick={() => setShow(null)}
                            className="btn btn-danger">
                                Fermer
                        </Button>

                    </div>
              </div>
            </div>

        </div>
     </div>}
    </div>
   );
});

export default Formulaire;



