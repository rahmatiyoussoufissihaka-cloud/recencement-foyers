import { useState } from "react";
import { Button } from "../Components/Forms/Button";


export function Liste({foyers, onClickEdit, onClickDelete}){
  //Etat du fitre
  const [communeSelected, setCommuneSelected] = useState("")
  //Etat du tri
  const [tri, setTri] = useState("");
  //Etat de consultation d'un foyer
  const [foyerSelected, setFoyerSelected] = useState(null);
  //Récupérer les communes automatiquement   
  const communes = [...new Set(
    foyers.map((foyer) => foyer.commune)
  )];
         
  //Consulter un foyer
  const handleView = (foyer) => {
    setFoyerSelected(foyer);
  }
  // Nombre total des personnes recensées
  const totalPersonnes = foyers.reduce((total, foyer) =>
    total + foyer.nombrePersonnes, 0);
   // Filtrer et trier 
   const foyersFiltresEtTries = [...foyers]
  //Filtrer par commune
  .filter((foyer) => {
      if (communeSelected=== "") {
      return true;
    }
   return foyer.commune === communeSelected;
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
            Nombre de foyer(s): {foyers.length}
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
            value={communeSelected}
            onChange={(e) => setCommuneSelected(e.target.value)}>
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
            foyersFiltresEtTries.map((foyer, index) => (
              <tr key={foyer.id}>
                <td>{index + 1}</td>
                <td className='align-item-center'>{foyer.nomResponsable}</td>
                <td>{foyer.commune}</td>
                <td>{foyer.nombrePersonnes}</td>
                <td>
                   <Button 
                        type='button' 
                        onClick={() => onClickEdit(foyer)}
                        className="btn btn-primary m-1" >
                        Modifier
                     </Button>
                    <Button 
                      type='button'
                      onClick={()=> onClickDelete(foyer.id)}
                      className="btn btn-danger m-1">
                      Supprimer
                  </Button>
                  <Button 
                      type='button'
                      onClick={() => handleView(foyer)} 
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
    {foyerSelected && (
      <div
        className="modal fade show d-block"  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        tabIndex="-1"
        role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-info">
              <h5 className="modal-title">
                Informations du foyer
              </h5>
              <Button
                className="btn-close"
                onClick={() => setFoyerSelected(null)}>
              </Button>
            </div>
            <div className="modal-body bg-light">
              <p>
                <strong>Responsable :</strong>{" "}
                {foyerSelected.nomResponsable}
              </p>
              <p>
                <strong>Adresse :</strong>{" "}
                {foyerSelected.adresse}
              </p>
              <p>
                <strong>Commune :</strong>{" "}
                {foyerSelected.commune}
              </p>
              <p>
                <strong>Nombre de personnes :</strong>{" "}
                {foyerSelected.nombrePersonnes}
              </p>
              <p>
                <strong>Téléphone :</strong>{" "}
                {foyerSelected.telephone}
              </p>
            </div>
            <div className="modal-footer">
              <Button
                type='button'
                className="btn btn-danger "
                onClick={() => setFoyerSelected(null)}>
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