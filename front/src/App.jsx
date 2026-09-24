import { useState, useEffect} from 'react'
import Formulaire from './Components/Formulaire';
import { Liste } from './Components/Liste';



function App() {
  const [editingId, setEditingId]=useState(null)
  //Etat pour stocker les valeurs des items
  const [items, setItems] =useState([])
  const [show, setShow]=useState(false)

  // Modifier le titre de la page
    useEffect(() => {
      document.title = "Recensement des foyers";
    }, []);
  
 
      
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
    
    //Modifier un foyer
    const handleEdit = (item) => {
    setEditingId(item);
    setShow(true);
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
        <Formulaire onSave={handleSave} 
        show={show}
        setShow={setShow}
        key={editingId ? editingId.id : 'mode-ajout'} fullData={editingId} />
        <Liste  items={items}  onClickEdit={handleEdit} onClickDelete={handleDelete}   />
      
       
    </div>
  )

}


export default App
