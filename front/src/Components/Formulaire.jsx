import {  useState, useEffect, useRef, forwardRef, useImperativeHandle} from "react"
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
    const nomRef = useRef(null);
    const adresseRef = useRef(null);
    const communeRef = useRef(null);
    const nombreRef = useRef(null);
    const telephoneRef = useRef(null);
    const isEditing = Boolean(fullData);
    useEffect(() => {
        if (isEditing) {
            setFormData({
                nomResponsable: fullData.nomResponsable || '',
                adresse: fullData.adresse || '',
                commune: fullData.commune || '',
                nombrePersonnes: fullData.nombrePersonnes || '',
                telephone: fullData.telephone || ''
            });
        }
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
    
    const gererSoumission = async (e) => {
        e.preventDefault();
        setEnCours(true);
        setMessage('');
        setIsError(false)
       
        // convertir le nombre de personnes en entier
        const nombre= parseInt(formData.nombrePersonnes, 10);
        if (isNaN(nombre) || nombre < 1) {
            setIsError(true)
            setMessage("⚠️ Erreur : Le nombre de personnes doit être un entier supérieur ou égal à 1.");
            setEnCours(false);
        return; 
        }
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
                // Mode Ajout -> Appel POST
                resultat = await foyerService.create(donneesAEnvoyer);
                setFormData({ nomResponsable: '', adresse: '', commune: '', nombrePersonnes: '', telephone:'' }); 
                 
            }
            setIsError(false);
            setMessage('');       
            onSave(resultat, isEditing);
        } 
        catch (erreur) {
            setIsError(true);
            setMessage(`⚠️ Erreur : ${erreur.message}`);
        } 
        finally {
            setEnCours(false);
        }
    };
    
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
                                <h5 className="fw-bold"> 📝 Modifier un foyer</h5>
                                <Button type="button" className="btn-close" onClick={onCancel} ></Button>
                            </>)
                            :(<>
                                <h5 className="fw-bold">➕ Ajouter un foyer</h5>
                                <Button type="button" className="btn-close" onClick={()=>setShow(null)} ></Button>
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
                                required={true}  
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
                        {message && <p className={isError && "error"}>{message}</p>}
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



