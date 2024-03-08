// ==========================================================================================================
// ESJ02_CRUD  (CRUD avec EJS) NodeJS Express                                           http://localhost:3000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\ESJ02_CRUD
// fichier: serveur/routes/client-routes.js                                                                                               
// ==========================================================================================================
// import des modules necessaire
const clientControleur = require('../controleurs/client-controleurs');

/*************************************************/
/*** Récupération du routeur d'express           */
const routeur = require('express').Router();

/*************************************************/
/*** Routage de la ressource Recette             */
routeur.get('/add', clientControleur.soumettreUnClient);
routeur.post('/add', clientControleur.addClient);
// homepage: (acceuil) ici c'est un getAll avec pagination
routeur.get('/', clientControleur.homepage);
//
// view, edit, delete
routeur.get('/view/:id', clientControleur.getOne);
routeur.get('/edit/:id', clientControleur.soumettreEditOne);
routeur.put('/edit/:id', clientControleur.updateOne);
routeur.delete('/edit/:id', clientControleur.deleteOne);
//
routeur.post('/client-recherche', clientControleur.rechercheClients);
routeur.get('/about', clientControleur.about);
// 
module.exports = routeur;