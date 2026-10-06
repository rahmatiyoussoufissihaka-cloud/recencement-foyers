const API_URL = 'http://localhost:8000/api/foyers';
 

export const foyerService = {
  // GET /api/foyers
  getAll: async () => {
    const reponse = await fetch(API_URL);
    console.log("Réponse brute de l'API :", reponse);
    
    if (!reponse.ok) {
      const corpsErreur = await reponse.json().catch(() => ({}));
      throw new Error(corpsErreur.error || 'Erreur lors de la récupération.');
    }
    const objetResultat = await reponse.json();
    return objetResultat.data; 
  },

  // POST /api/foyers
  create: async (donneesFoyer) => {
    const reponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donneesFoyer),
    });

    const corpsJson = await reponse.json().catch(() => ({}));

    if (!reponse.ok) {
     
      if (corpsJson.details) {
       
        const premierMessage = Object.values(corpsJson.details)[0];
        throw new Error(`${corpsJson.error} : ${premierMessage}`);
      }
      throw new Error(corpsJson.error || 'Erreur lors de la création.');
    }

    return corpsJson.data; 
  },

  // PATCH /api/foyers/{id}
  updatePartiel: async (id, champsModifies) => {
    const reponse = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(champsModifies),
    });

    const corpsJson = await reponse.json().catch(() => ({}));

    if (!reponse.ok) {
      if (corpsJson.details) {
        const premierMessage = Object.values(corpsJson.details)[0];
        throw new Error(`${corpsJson.error} : ${premierMessage}`);
      }
      throw new Error(corpsJson.error || 'Erreur de modification.');
    }

    return corpsJson.data; 
  },

  // DELETE /api/foyers/{id}
  delete: async (id) => {
    const reponse = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    
    if (!reponse.ok) {
      const corpsJson = await reponse.json().catch(() => ({}));
      throw new Error(corpsJson.error || 'Impossible de supprimer.');
    }
    
    return true; 
  }
};
