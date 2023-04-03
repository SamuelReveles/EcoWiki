const { request, response } = require('express');

const Item = require('../models/item');

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

module.exports = {
    createItem,
}