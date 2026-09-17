import { useState } from "react";
import { Button } from "../Components/Forms/Button";

export function Liste({items, onClickEdit, onClickDelete}){
  //Etat du fitre
  const [communeSelectionnee, setCommuneSelectionnee] = useState("")
  //Etat du tri
  const [tri, setTri] = useState("");
  //Etat de consultation d'un foyer
  const [foyerSelectionne, setFoyerSelectionne] = useState(null);
  //Récupérer les communes automatiquement   
  const communes = [...new Set(
    items.map((item) => item.commune)
  )];
         console.log(onClickEdit)
  //Consulter un foyer
  const handleView = (item) => {
    setFoyerSelectionne(item);
  }
  // Nombre total des personnes recensées
  const totalPersonnes = items.reduce((total, item) =>
   total + item.nombrePersonnes, 0);
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

  return(
    <div className="mt-5">
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
      <div className="row g-3 m-4">
        <div className="col-12 col-md-6">
          <label className="form-label fw-bold">
            Filtrer par commune
          </label>
          <select
            className="form-select"
            value={communeSelectionnee}
            onChange={(e) => setCommuneSelectionnee(e.target.value)}>
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
                      onClick={() => onClickEdit(item)}
                        className="btn btn-primary m-1" >
                        Modifier
                     </Button>
                   <Button 
                   type='button'
                    onClick={()=> onClickDelete(item.id)}
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
   </div>
        
    )

}