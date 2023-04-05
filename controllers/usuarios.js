const { request, response } = require('express');

//Models
const Item = require('../models/item');

//Helpers
const { returnItem } = require('../helpers/return');

const createItem = async(req = request, res = response) => {
    const item = new Item({
        titulo: req.body.title,
        categoria: req.body.category,
        descripcion: req.body.description,
        distribuidores: req.body.distribuidores,
        referencias: req.body.referencias,
        autor: req.body.autor
    });

    await item.save();
    
    res.status(200).json({
        item,
        msg: 'Succesfull!'
    });
}

const getItem = async (req = request, res = response) => {
    if(req.query.id) return returnItem(res, await Item.findById(req.query.id));
    if(req.query.category) {
        const category = new RegExp(req.query.category, 'i');
        return returnItem(res, await Item.find({categoria: category}));
    }
    if(!req.query.name) return returnItem(res, await Item.find());
    const name = new RegExp(req.query.name, 'i');
    console.log(name);
    const item = await Item.find({titulo: name});
    returnItem(res, item);
}

const getAllCategories = async (req = request, res = response) => {
    const items = await Item.find();
    let categories = [];
    for await (const item of items)
        if(categories.indexOf(item.categoria) == -1) categories.push(item.categoria);
    returnItem(res, categories);
}

module.exports = {
    createItem,
    getItem,
    getAllCategories,

}