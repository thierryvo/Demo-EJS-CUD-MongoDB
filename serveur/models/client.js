// ==========================================================================================================
// ESJ02_CRUD  (CRUD avec EJS) NodeJS Express                                           http://localhost:3000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\ESJ02_CRUD
// fichier: serveur/models/client.js
// ==========================================================================================================
// import des modules necessaire
const mongoose = require('mongoose');
// modèle (ClientSchema)--------------------------------------------------------------------------------------
// clé unique:
const ClientSchema = new mongoose.Schema({
  nom: { type: String, required: 'nom est obligatoire.' },
  prenom: { type: String, required: 'prenom est obligatoire.' },
  telephone: { type: String, required: 'telephone est obligatoire.' },
  email: { type: String, required: 'email est obligatoire.' },
  detail: { type: String, required: 'detail est obligatoire.' },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
});
//
//
// table----------------------------------------------------------------------------------------------------
// CREER le Modèle à partir du Schéma: (Modèle/Class,  Schéma,  Collection/Table)   
const Client = mongoose.model('Client', ClientSchema, 'table-clients');
//
// Export:
module.exports = Client;
