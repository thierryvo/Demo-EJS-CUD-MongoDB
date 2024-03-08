// ==========================================================================================================
// ESJ02_CRUD  (CRUD avec EJS) NodeJS Express                                           http://localhost:3000
// ==========================================================================================================
// dossier: C:\WORK\NODEJS\ESJ02_CRUD
// fichier: serveur/routes/client-controleurs.js                                                                                               
// ==========================================================================================================
// import des modules necessaire
const Client = require("../models/client");
const ObjectID = require("mongoose").Types.ObjectId; // ID reconnu par la base de données ?

// -----------------------------------------------------------------------------------------------------------
/*****************************************/
// GET  soummettrerUnClient
exports.soumettreUnClient = async (req, res) => {
  const urlIndexClient = "/client/";
  const urlClientAdd = "/client/add";
  // RENDRE la PAGE: client/add
  const oTemplateData = {
    titre: "nodeJS - ADD CLIENT",
    urlIndexClient: urlIndexClient,
    urlClientAdd: urlClientAdd
  }
  res.status(200).render("client/add", oTemplateData);
};
  
/*****************************************/
// POST  addClient
exports.addClient = async (req, res) => {
    const {nom, prenom, telephone, email, detail} = req.body;
    const urlIndexClient = "/client/";
    //
    // AJOUTER le CLIENT
    try {
      const unClient = new Client({
        nom: nom,
        prenom: prenom,
        telephone: telephone,
        email: email,
        detail: detail
      });
      // CREATION & Message flash & redirect vers inedex page: ('/client/')
      await Client.create(unClient);
      await req.flash("info", "Un nouveau client a bien été ajouté.");
      res.redirect(urlIndexClient); 
    } catch (error) {
      console.log(error);
    }
};
  // -----------------------------------------------------------------------------------------------------------


/*****************************************/
// GET  homepage 
exports.homepage = async (req, res) => {
  const urlSoumettreUnClient = "/client/add"
  const urlClientActionView = "/client/view/"   // + ID
  const urlClientActionEdit = "/client/Edit/"   // + ID
  const urlClientActionDelete = "/client/Edit/" // + ID
  // récupération des messages flash ()
  const tabMessages = await req.flash("info");
  // PAGES: 12 lignes par pages
  let perPage = 12;
  let page = req.query.page || 1;

  try {
    // LECTURE des clients
    const tabClients = await Client.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    // count
    // Count is deprecated. Use countDocuments({}) or estimatedDocumentCount()
    // const count = await Customer.count();
    const count = await Client.countDocuments({});
    //
    // RENDRE la PAGE: index.ejs
    const oTemplateData = {
      titre: "nodeJS - Free NodeJs User Management System - Accueil",
      current: page,
      pages: Math.ceil(count / perPage),
      urlSoumettreUnClient: urlSoumettreUnClient,
      urlClientActionView: urlClientActionView,
      urlClientActionEdit: urlClientActionEdit,
      urlClientActionDelete: urlClientActionDelete,
      tabMessages: tabMessages,
      tabClients: tabClients
    }
    res.status(200).render("index", oTemplateData);
  } catch (error) {
    console.log(error);
  }
};

/*****************************************/
// GET  getOne  : get One Client
exports.getOne = async (req, res) => {
  const urlIndexClient = "/client/";
  // CONTROLE: id
  if (!ObjectID.isValid(req.params.id)){
    const message = "ID Incorrect : "
    return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
  }
  // ========================================
  try {
    const unClient = await Client.findById({"_id": req.params.id})
    // RENDRE la PAGE: client/view
    const oTemplateData = {
      titre: "Afficher les données client",
      urlIndexClient: urlIndexClient,
      r_client: unClient
    }
    res.status(200).render("client/view", oTemplateData);
  } catch (error) {
    console.log(error);
  }
};

// -----------------------------------------------------------------------------------------------------------
/*****************************************/
// GET  soumettreEditOne: FORMULAIRE edit Client
exports.soumettreEditOne = async (req, res) => {
  const urlIndexClient = "/client/";
  const urlClientEdit = "/client/edit/";    // + ID
  const urlClientDelete = "/client/edit/";  // + ID
  // CONTROLE: id
  if (!ObjectID.isValid(req.params.id)){
    const message = "ID Incorrect : "
    return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
  }
  // ========================================
  try {
    const unClient = await Client.findById({"_id": req.params.id})
    //
    // RENDRE la PAGE: client/edit
    const oTemplateData = {
      titre: "Modifier les données client",
      urlIndexClient: urlIndexClient,
      urlClientEdit: urlClientEdit,
      urlClientDelete: urlClientDelete,
      r_client: unClient
    }
    res.status(200).render("client/edit", oTemplateData);    
  } catch (error) {
    console.log(error);
  }
};
  
/*****************************************/
// PUT  updateOne: Client
exports.updateOne = async (req, res) => {
  const {nom, prenom, telephone, email, detail, } = req.body;
  const urlIndexClient = "/client/";
  try {
    const unClient = {
      nom: nom,
      prenom: prenom,
      telephone: telephone,
      email: email,
      detail: detail,
      updatedAt: Date.now()
    }
    // MISE à JOUR: CLIENT & redirection vers index (Dashboard)
    await Client.findByIdAndUpdate(req.params.id, unClient);
    await req.flash("info", "Le client (" + nom +", " + prenom + ") a bien été modifié.");
    res.redirect(urlIndexClient);
  } catch (error) {
    console.log(error);
  }
};
// -----------------------------------------------------------------------------------------------------------


/*****************************************/
// DELETE  deleteOne: Client
exports.deleteOne = async (req, res) => {
  const urlIndexClient = "/client/";
  // CONTROLE: id
  if (!ObjectID.isValid(req.params.id)){
    const message = "ID Incorrect : "
    return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
  }
  // vérification
  const unClient = await Client.findOne({"_id": req.params.id});
  if(unClient === null){
    const message = "ID Incorrect, client NON trouvé: "
    return res.status(400).json({status: "KO", message: message + req.params.id}); // 400 problème dans la requête
  }
  // suppression
  try {
    // SUPPRESSION du CLIENT & redirection vers index (Dashboard)
    const {nom, prenom} = unClient;
    await Client.deleteOne({ _id: req.params.id });
    await req.flash("info", "Le client (" + nom +", " + prenom + ") a bien été supprimé.");
    res.redirect(urlIndexClient);    
  } catch (error) {
    console.log(error);
  }
};

/*****************************************/
// POST  recherche clients
exports.rechercheClients = async (req, res) => {
  //
  const {rechercheTerme} = req.body;
  const wRechercheTerme = rechercheTerme.replace(/[^a-zA-Z0-9 ]/g, "");
  const urlSoumettreUnClient = "/client/add"
  const urlClientActionView = "/client/view/"   // + ID
  const urlClientActionEdit = "/client/Edit/"   // + ID
  const urlClientActionDelete = "/client/Edit/" // + ID
  try {
    // RECHERCHE des Clients sur nom & prenom
    const tabDeClients = await Client.find({
      $or: [
        { nom: { $regex: new RegExp(wRechercheTerme, "i") } },
        { prenom: { $regex: new RegExp(wRechercheTerme, "i") } }
      ],
    });
    // RENDRE la PAGE: resultat-recherche-clients
    const oTemplateData = {
      titre: "Résultat recherche Clients",
      urlSoumettreUnClient: urlSoumettreUnClient,
      urlClientActionView: urlClientActionView,
      urlClientActionEdit: urlClientActionEdit,
      urlClientActionDelete: urlClientActionDelete,
      tabDeClients: tabDeClients
    }
    res.status(200).render("resultat-recherche-clients", oTemplateData);
  } catch (error) {
    console.log(error);
  }
};


/*****************************************/
// GET  recherche clients
exports.about = async (req, res) => {
  try {
    //
    // RENDRE la PAGE: about
    const oTemplateData = {
      titre: "About",
    }
    res.status(200).render("about", oTemplateData);
  } catch (error) {
    console.log(error);
  }
};