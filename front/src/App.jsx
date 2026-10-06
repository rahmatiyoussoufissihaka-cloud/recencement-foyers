import { useState, useEffect} from 'react'
import Formulaire from './Components/Formulaire';
import { Liste } from './Components/Liste';
import { foyerService } from './services/foyerService';



function App() {
  const [editingId, setEditingId]=useState(null)
  //Etat pour stocker les valeurs des items
  const [items, setItems] =useState([])
  const [chargement, setChargement] = useState(true);
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
      setChargement(true);
      setErreur(null);
      const donnees = await foyerService.getAll(); 
      setItems(donnees);
    } 
    catch (err) {
      setErreur(err.message); 
    } 
    finally {
      setChargement(false);
    }
  };
  
    //Modifier un foyer (PATCH /api/foyers/{id})
    const handleEdit= (item) => {
    setEditingId(item);
    setShow(true);
};
    const notification = (message) => {
    setNotice(message);
    
    // On force un rafraîchissement propre du compte à rebours
    const minuteur = setTimeout(() => {
      setNotice('');
    }, 3000);
     return () => clearTimeout(minuteur)
  }

   //Sauvegarder un foyer (POST ou PATCH)
   const handleSave = (itemResult, wasEditing) => {
      console.log("Données reçues après enregistrement :", itemResult);
      const foyerPropre = itemResult?.data ? itemResult.data : itemResult;
      if (!foyerPropre || typeof foyerPropre !== 'object') {
          console.error("Le format renvoyé par l'API n'est pas un objet valide.");
          return;
      }

      if (wasEditing) {
          // Met à jour la ligne modifiée
          setItems(items.map(item => item.id === foyerPropre.id ? foyerPropre : item));
          setEditingId(null); 
          notification('Foyer modifié avec succès !');
          
        } else {
          // Ajoute le nouveau foyer à la liste
          setItems([...items, foyerPropre]);
          notification('Foyer  ajouté avec succès !');
          
      };
    
      setShow(false); 
  };
  //Supprimer un foyer(DELETE /api/foyers/{id})
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce foyer ?")) {
        try {
            await foyerService.delete(id);
            setItems(items.filter(item => item.id !== id));
            if (editingId?.id === id) setEditingId(null);
        } 
        catch (err) {
           alert(err.message);
        }
    }
  };
  
  return(
    <div className='container my-3'>
      <h1 className='mb-3 p-2 fw-bold'>Recensement des Foyers</h1>
      <div>
        
      </div>
      {notice && (
        <div className="alert alert-success alert-dismissible fade show" role="alert"> 
          ✅ {notice}
          </div>)}
      <Formulaire onSave={handleSave} 
      show={show}
      setShow={setShow}
      onCancel={()=>setEditingId(null)}
      key={editingId ? editingId.id : 'mode-ajout'} fullData={editingId} />
      {chargement && <p className="p-2 text-center fw-bold text-primary" >🔄 Chargement en cours... </p>}
      {erreur && <p className="error">⚠️ Erreur : {erreur}</p>}
      {!chargement && !erreur && (
        <Liste  items={items}  onClickEdit={handleEdit} onClickDelete={handleDelete}   />
      )}
       
    </div>
  )

}


export default App
