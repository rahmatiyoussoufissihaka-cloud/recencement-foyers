import { useState, useEffect} from 'react'
import Formulaire from './Components/Formulaire';
import { Liste } from './Components/Liste';
import { foyerService } from './services/foyerService';



function App() {
  const [editingFoyer, setEditingFoyer]=useState(null)
  //Etat pour stocker les valeurs des items
  const [foyers, setFoyers] =useState([])
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [notice, setNotice ] = useState('');
  const [show, setShow]=useState(false)

  // Modifier le titre de la page
    useEffect(() => {
      document.title = "Recensement des foyers";
    }, []);
  
   // Lancer le chargement au démarrage du site
  useEffect(() => {
    chargerDonnees();
  }, []);

  //Charger la liste initiale (GET /api/foyers)
  const chargerDonnees = async () => {
    try {
      setLoading(true);
      setErreur(null);
      const donnees = await foyerService.getAll(); 
      setFoyers(donnees);
    } 
    catch (err) {
      setErreur(err.message); 
    } 
    finally {
      setLoading(false);
    }
  };
  
    //Modifier un foyer (PATCH /api/foyers/{id})
    const handleEdit= (foyer) => {
      setEditingFoyer(foyer);
      //Ouvrir le formulaire en mode édition
      setShow(true);
  };
    //Notification de succès
    const notification = (message) => {
      setNotice(message);
      
      // Masquer la notification après 3 secondes
      const minuteur = setTimeout(() => {
        setNotice('');
      }, 3000);
      return () => clearTimeout(minuteur);
  }

   //Sauvegarder un foyer (POST ou PATCH)
   const handleSave = (foyerResult, wasEditing) => {
      console.log("Données reçues après enregistrement :", foyerResult);
      const foyerPropre = foyerResult?.data ? foyerResult.data :foyerResult;
      if (!foyerPropre || typeof foyerPropre !== 'object') {
          console.error("Le format renvoyé par l'API n'est pas un objet valide.");
          return;
      }

      if (wasEditing) {
          // Met à jour la ligne modifiée
          setFoyers(foyers.map(foyer => foyer.id === foyerPropre.id ? foyerPropre : foyer));

          setEditingFoyer(null); 

          // Affiche une notification de succès
          notification('Foyer modifié avec succès !');
          
        } else {
          
          setFoyers([...foyers, foyerPropre]); // Ajoute le nouveau foyer à la liste
          notification('Foyer  ajouté avec succès !');
          
      };
       // fermer le formulaire après l'enregistrement
      setShow(false); 
  };

  //Supprimer un foyer(DELETE /api/foyers/{id})
  const handleDelete = async (id) => {

    //Trouver le foyer cliqué
    const findFoyer = foyers.find(f => f.id === id);
    const nomResponsable = findFoyer?.nomResponsable; //Idententifié un foyer par le nom de responsable
    const confirmation = window.confirm(`Etes-vous sûr de vouloir supprimer le foyer de ${nomResponsable} ?`);
    if (!confirmation) {
      return; 
    }

     try {
    
    await foyerService.delete(id); //Appel de la méthode DELETE 
    setFoyers(foyers.filter(foyer => foyer.id !== id));
    
    // Affiche une notification de succès
    notification(`Le foyer de ${nomResponsable} a été supprimé avec succès.`);
    
    if (editingFoyer?.id === id) setEditingFoyer(null);
    }
    catch (err) {
      alert(`Erreur lors de la suppression : ${err.message}`);
    }

  };
  
  return(
    <div className='container my-3'>
      {notice && (
        <div className="toast-notification alert d-flex alert-success border-0 shadow" role="alert"> 
           <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="bi bi-check-circle-fill flex-shrink-0" width="24" height="24" role="img" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
           </svg> 
          <div>{notice}</div>
        </div>
      )}
      <h1 className='mb-3 p-2 fw-bold'>Recensement des Foyers</h1>
      <Formulaire onSave={handleSave} 
      show={show}
      setShow={setShow}
      onCancel={()=>setEditingFoyer(null)}
      key={editingFoyer ? editingFoyer.id : 'mode-ajout'} fullData={editingFoyer} />
      {loading &&
        <div className='d-flex flex-column align-items-center gap-2 m-2'>
          <div className="spinner-border text-light" role="status"></div>
          <p className='visually-hidden'>Chargement en cours...</p>
        </div>}
      {erreur && <div className="alert d-flex alert-danger border-0 shadow" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0" viewBox="0 0 16 16" role="img" aria-label="Warning:">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
        <div> Erreur : {erreur}</div>
      </div>}
      {!loading && !erreur && (
        <Liste  foyers={foyers}  onClickEdit={handleEdit} onClickDelete={handleDelete}   />
      )}
       
    </div>
  )

}


export default App
