const { request, response } = require('express');

//Models
const Item = require('../models/item');

//Helpers
const { returnItem, returnCreated, returnBadRequest } = require('../helpers/return');

const createItem = async (req = request, res = response) => {
    const item = new Item({
        titulo: req.body.title,
        categoria: req.body.category,
        descripcion: req.body.description,
        distribuidores: req.body.distribuidores,
        referencias: req.body.referencias,
        autor: req.body.autor
    });

    await item.save();
    
    returnCreated(res, item);
}

const editItem = async (req = request, res = response) => {

    if( !req.body.origin || !req.body.title || !req.body.category || !req.body.description ||
        !req.body.distribuidores || !req.body.referencias || !req.body.autor || !req.body.origin) return returnBadRequest(res);

    const item = new Item({
        titulo: req.body.title,
        categoria: req.body.category,
        descripcion: req.body.description,
        distribuidores: req.body.distribuidores,
        referencias: req.body.referencias,
        autor: req.body.autor,
        origin: req.body.origin,
        editado: true
    });

    await item.save();
    let origin = await Item.findById(req.body.origin);
    origin.editado = true;
    origin.aceptado = false;
    console.log(item);
    console.log(origin);
    // await Item.findByIdAndUpdate(req.body.origin, origin);

    returnCreated(res, item);
}

const getItem = async (req = request, res = response) => {
    if(req.query.id) return returnItem(res, await Item.findById(req.query.id));
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