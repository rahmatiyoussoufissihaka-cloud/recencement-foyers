import { useState , useRef, useEffect} from 'react'
import Formulaire from './Components/Formulaire';
import { Liste } from './Components/Liste';
import { Switch } from './Components/Forms/Switch';


function App() {

  const [editingId, setEditingId]=useState(null)
  const [showTable, setShowTable] = useState(true);
  //Etat pour stocker les valeurs des items
  const [items, setItems] =useState([])

  // Modifier le titre de la page
    useEffect(() => {
      document.title = "Recensement des foyers";
    }, []);

  // Aller vers le formulaire
    useEffect(() => {
      if (editingId !== null) {
        const elementFormulaire = document.getElementById('bloc-formulaire');
           if(elementFormulaire){
            elementFormulaire.scrollIntoView({
            behavior: "smooth",
           block: "start",
         });
        }
      }
    }, [editingId]);  
//Créer une reference vers le formulaire
    const formRef= useRef(null)


  // Modifier un foyer
     const handleEdit = (item, index) => {
     // Charger les données dans l'état
       setEditingId({ ...item, index });
      //  Activer le Focus et le SCROLL automatique
        if (formRef.current) {
          // Donner le focus au champ d'écriture
          formRef.current.donnerLeFocus(); 
        }
     };

  
  //Supprimer un élément de la liste
    const handleDelete=(id)=>{
      const confirmation =window.confirm('Etes-vous sûr de vouloir supprimer ceci?')
        if(!confirmation ){
            return;
        }
        if (editingId?.id === id) {
            setEditingId(null);
        }   
      setItems((prev) => prev.filter((item) => item.id !== id));

      // Message de confirmation apres supression
      alert("✅ Élément supprimé avec succès !")
    };
    // Annuler les modifications
    const handleCancel = () => {
      setEditingId(null); 

      //Message de confirmation 
      alert("✅ Modification annulée avec succès.");
};
 
  //Sauvegarder 
    const handleSave = (donneesPropres) => {
      if (!donneesPropres || !donneesPropres.nomResponsable) {
       return; 
      }
      if (editingId && editingId.id) {
        setItems((prev) => prev.map((item) => item.id === editingId.id ? { ...donneesPropres, id: item.id } : item));
        setEditingId(null);
      } else {
          setItems((prev) => [...prev, { ...donneesPropres, id: crypto.randomUUID() }]);
        }
    };

  return(
    <div className='container my-3'>
      <h1 className='mb-3 p-2 fw-bold'>Recensement des Foyers</h1>
      <div id="bloc-formulaire">
        <Formulaire onSave={handleSave} onCancel={handleCancel} key={editingId ? editingId.id : 'mode-ajout'} fullData={editingId} />
      </div>
      <hr className="w-75 mx-auto my-4 border-2 border-dark" />
      <Switch
        checked={showTable}
        onChange={setShowTable}
        id="checked"
        label = {showTable ? "Masquer la liste des foyers" : "Afficher la liste des foyers"} 
      />
      {showTable && <Liste  items={items}  onClickEdit={(item) => setEditingId(item)} onClickDelete={handleDelete}   />}
    </div>
  )

}


export default App
