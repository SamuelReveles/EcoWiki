const { request, response } = require('express');
const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


//Models
const Item = require('../models/item');

//Helpers
const { returnItem, returnCreated, returnBadRequest } = require('../helpers/return');

const createItem = async (req = request, res = response) => {

    //Subir a cloudinary y extraer el secure_url
    const { secure_url } = await cloudinary.uploader.upload(req.files.imagen.tempFilePath);

    const item = new Item({
        titulo: req.body.titulo,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        distribuidores: req.body.distribuidores,
        referencias: req.body.referencias,
        imagen: secure_url,
        autor: req.body.autor
    });

    await item.save();
    
    returnCreated(res, item);
}

const editItem = async (req = request, res = response) => {
    //Subir a cloudinary y extraer el secure_url
    const { secure_url } = await cloudinary.uploader.upload(req.files.imagen.tempFilePath);

    if( !req.body.origin || !req.body.titulo || !req.body.categoria || !req.body.descripcion ||
        !req.body.distribuidores || !req.body.referencias || !req.body.autor || !req.body.origin) return returnBadRequest(res);
    
    const item = new Item({
        titulo: req.body.titulo,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        distribuidores: req.body.distribuidores,
        referencias: req.body.referencias,
        autor: req.body.autor,
        origin: req.body.origin,
        imagen: secure_url,
        editado: true
    });

    await item.save();
    let origin = await Item.findById(req.body.origin);

    const nombreArr = origin.imagen.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [ public_id, extension ] = nombre.split('.');
    await cloudinary.uploader.destroy(public_id);

    origin.editado = true;
    origin.aceptado = false;

    returnCreated(res, item);
}

const getItem = async (req = request, res = response) => {
    if(req.query.id) {
        let item = await Item.findById(req.query.id);
        return returnItem(res, await Item.findByIdAndUpdate(req.query.id, {visitas: (item.visitas + 1)}));
    }
    if(req.query.category) {
        const category = new RegExp(req.query.category, 'i');
        return returnItem(res, await Item.find({$and: [{categoria: category}, {aceptado: true}]}));
    }
    if(!req.query.name) return returnItem(res, await Item.find({aceptado: true}));
    const name = new RegExp(req.query.name, 'i');
    const item = await Item.find({$and: [{titulo: name}, {aceptado: true}]});
    returnItem(res, item);
}

const getAllCategories = async (req = request, res = response) => {
    const items = await Item.find({aceptado: true});
    let categories = [];
    for await (const item of items)
        if(categories.indexOf(item.categoria) == -1) categories.push(item.categoria);
    returnItem(res, categories);
}

module.exports = {
    createItem,
    getItem,
    getAllCategories,
    editItem
}