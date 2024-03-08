// ==========================================================================================================
// ESJ02_CRUD  (CRUD avec EJS) NodeJS Express                                           http://localhost:3000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\ESJ02_CRUD
// fichier: app.js
// tuto chaine : https://www.youtube.com/watch?v=PAm_QcN6Ffs&t=6343s
// git         : https://github.com/RaddyTheBrand/Nodejs-User-Management-Express-EJS-MongoDB
// flash       : https://raddy.dev/blog/user-management-system-nodejs-express-mongodb-ejs-crud/
// mongoDBaccès: https://www.mongodb.com/cloud/atlas/register
// test        :  node app.js
//                npm run dev          => lance nodemon, en Utilisant les scripts de package.json ***
// DESCRIPTION :  http://localhost:3000/client
//
// installation: npm install express dotenv ejs
//               npm install mongodb mongoose validator
//               npm install express-session connect-flash express-fileupload cookie-parser
//               npm install express-ejs-layouts express-fileupload method-override
//               npm install nodemon --save-dev                                                                                                
// ==========================================================================================================
// import des modules nécessaires
const express = require('express')
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const urlSoumettreUneRecette  = '/api/recette/soumettre-recette'
require('dotenv').config({path: './serveur/config/.env'})

/*****************************************/
/* Initialisation de l'API (du serveur)  */
const appServeur = express();

/*****************************************/
/* Mise en place du paramétrage          */
  appServeur.use(express.json());
  appServeur.use(methodOverride('_method'));
  appServeur.use(express.urlencoded({ extended: true }));
  appServeur.use(express.static('public'));                   // static Files
  appServeur.use(cookieParser('CookingBlogSecure'));
  appServeur.use(session({
    secret: 'Ejs02CrudSecretSession',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }    
  }));
  appServeur.use(flash({ sessionKeyName: 'flashMessage' }));
  appServeur.use(fileUpload());
  // Moteur de création de modèles (templating Engine)
  appServeur.use(expressLayouts);
  appServeur.set('layout', './layouts/main');
  appServeur.set("view engine", "ejs")

/*****************************************/
/* Mise en place du routage              */
appServeur.get('/', (req, res) => res.send(`Je suis en ligne (EJS02_CRUD). Tout est OK pour l'instant."`));
// recette
const clientRoutes = require('./serveur/routes/client-routes.js')
appServeur.use('/client', clientRoutes);
//
// 404
appServeur.get('*', (req, res) => {
  // non trouivé
  res.status(404).render('PAGE404'); // 404 NON Trouvé
  //res.status(501).send("Qu'est-ce que tu fais bon sang de bois!?!"); // 501 ressource non implémenté
});

/******************************************************************/
/* Démarrer la connexion BASE DE DONNEES    (MongoDB Atlas)       */
require("./serveur/models/database")

/******************************************************************/
/* Démarrer le serveur: sur port 3000                             */
const port = process.env.PORT; // 3000;
appServeur.listen(port, () => {
    console.log("SERVEUR: EJS02_CRUD, demarré sur http://localhost:"+port);
});
