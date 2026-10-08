import {  useState, useEffect, useRef, forwardRef} from "react"
import { Input } from "../Components/Forms/Input";
import { Button } from "../Components/Forms/Button";
import { foyerService } from '../services/foyerService'

const Formulaire = forwardRef(({ onSave, fullData, show, setShow, onCancel }, ref) => {  
    const [enCours, setEnCours] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(true);
    const [formData, setFormData] = useState({
        nomResponsable: '',
        adresse: '',
        commune: '',
        nombrePersonnes: '',
        telephone: ''
    }) 

    //Références pour gérer le focus sur les champs du formulaire
    const nomRef = useRef(null);
    const adresseRef = useRef(null);
    const communeRef = useRef(null);
    const nombreRef = useRef(null);
    const telephoneRef = useRef(null);

    //Déterminer si le formulaire est en mode édition ou ajout
    const isEditing = Boolean(fullData);
    useEffect(() => {
        // Mettre à jour les données du formulaire lorsque fullData change (mode édition)
        if (isEditing) {
            setFormData({
                nomResponsable: fullData.nomResponsable || '',
                adresse: fullData.adresse || '',
                commune: fullData.commune || '',
                nombrePersonnes: fullData.nombrePersonnes || '',
                telephone: fullData.telephone || ''
            });
        }

        //Réinitialise le formulaire si on est en mode ajout
        else{
            setFormData({
                nomResponsable:'',
                adresse: '',
                commune:'',
                nombrePersonnes:'',
                telephone:''
            })
        }
        
         setMessage('');
        
    }, [fullData, isEditing]);


   //Effacer le message d'erreur si les champs sont vides
    useEffect(() => {
        // Récupère les valeurs de l'objet et vérifier s'elles sont vides
        const isAllEmpty= Object.values(formData). every(value=>value.trim()==='');          
        if (isAllEmpty) {
            setMessage('');
            setIsError(false);
        }
    }, [formData]);
    
    //Fonction pour gérer la soumission du formulaire
    const gererSoumission = async (e) => {
        e.preventDefault();
        setEnCours(true);
        setMessage('');
        setIsError(false)
        
        const nombre= parseInt(formData.nombrePersonnes, 10); // convertir le nombre de personnes en entier  
        //Vérifier si le nombre de personnes doit être un entier supérieur ou égal à 1
        if (isNaN(nombre) || nombre < 1) {
            setIsError(true)
            setMessage("Erreur : Le nombre de personnes doit être un entier supérieur ou égal à 1.");
            setEnCours(false);
        return; 
        }

        //Préparer les données à envoyer à l'API
        const donneesAEnvoyer = {
            ...formData,
            nombrePersonnes: nombre
        };
        try {
            let resultat;
            
            if (isEditing) {
                // Mode Édition -> Appel PATCH (ou PUT)
                resultat = await foyerService.updatePartiel(fullData.id, donneesAEnvoyer);
                
            } 
            else {
                
                resultat = await foyerService.create(donneesAEnvoyer);// Mode Ajout -> Appel POST
                setFormData({ nomResponsable: '',
                    adresse: '', 
                    commune: '',
                    nombrePersonnes: '',
                    telephone:'' 
              });   
                 
            }
            setIsError(false);
            setMessage('');    
            onSave(resultat, isEditing); // Appel de la fonction onSave pour informer le parent du succés de l'opération
        } 
        // Gestion des erreurs
        catch (erreur) {
            setIsError(true);
            setMessage(`Erreur : ${erreur.message}`);
        } 
        finally {
            setEnCours(false);
        }
    };
    
    // Fonction pour gérer la touche "Entrée" et passer au champ suivant
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
  
   
    //Fonction pour gérer les chargements des champs
    const handleChange = ({ name, value }) => {
        setFormData((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
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
                        {isEditing? (
                            <>
                                <h5 className="fw-bold"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor " className="bi bi-pencil-square me-1" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                     Modifier un foyer
                                </h5>
                                <Button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={onCancel}>  
                                </Button>
                            </>)
                            :(<>
                                <h5 className="fw-bold">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus-lg me-1" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                    </svg>
                                     Ajouter un foyer
                                </h5>
                                <Button 
                                    type="button"
                                    className="btn-close" 
                                    onClick={()=>setShow(null)} >
                                 </Button>
                            </>)
                        }
                    </div>
                    <div className="modal-body">
                        <form onSubmit={gererSoumission} 
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
                                required  
                            />
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
                                required
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
                                required
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
                                required
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
                                onKeyDown={(e) => handleEnter(e, null)} 
                            />
                        </div>
                        {isEditing?(
                            <div className=" mt-2 ">
                                <Button type="submit"
                                    disabled={isFormEmpty || enCours }
                                    className="btn btn-success px-4  m-1 py-2 w-100"> 
                                    {enCours ? 'Enregistrement...' : 'Mettre à jour'}
                                    
                                </Button>
                            </div>):
                            (<div className="mt-2 row">
                                    <div className="col-12 col-md-6">
                                        <Button
                                            type ="submit"
                                            disabled={isFormEmpty || enCours } 
                                            className="btn btn-primary px-4  py-2 m-1 w-100">
                                            {enCours ? 'Enregistrement...' : "Ajouter"}
                                            
                                        </Button> 
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <Button type="button" 
                                            onClick={() =>setFormData({ nomResponsable: '', adresse:'', commune:'', nombrePersonnes:'', telephone:''})}
                                            disabled={isFormEmpty || enCours } 
                                            className="btn btn-secondary px-4 py-2 m-1 w-100">
                                            Réinitialiser
                                        </Button>
                                    </div>             
                            </div>)
                        }
                        {message &&  ( <div className={isError &&  "alert alert-danger border-0 shadow  d-flex "}  role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                <div> {message}</div>
                            </div>
                        )}
                    </form>
                    <div className="modal-footer">
                       {isEditing?
                       ( <Button 
                            type='button'
                            onClick={onCancel}
                            className="btn btn-secondary">
                                Annuler
                        </Button>
                         ):
                       ( <Button 
                            type='button'
                            onClick={() => setShow(null)}
                            className="btn btn-danger">
                                Fermer
                        </Button>)   
                    }
                    </div>
              </div>
            </div>

        </div>
     </div>}
    </div>
   );
});

export default Formulaire;



