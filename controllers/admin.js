const { request, response } = require('express');
const cloudinary = require('cloudinary').v2;

const Item = require('../models/item');
const { returnAccepted, returnAccess, returnAdminItem, returnBadRequest } = require('../helpers/return');

const getItem = async (req = request, res = response) => {
    let item;
    if(req.query.id) item = await Item.findById(req.query.id);
    else item = await Item.find({aceptado: false});
    returnAdminItem(res, item);
}

const deleteItem = async (req = request, res = response) => {
    if(!req.body.id) return returnBadRequest(res);
    await Item.findOneAndDelete(req.body.id);
    returnAccepted(res, true);
}

const acceptItem = async (req = request, res = response) => {
    if(req.body.id && req.body.accepted !== undefined) {
        if(await Item.findById(req.body.id) === null) return returnBadRequest(res);
        let item = await Item.findById(req.body.id);
        if(req.body.accepted === "true") {
            if(item.origin) {
                item._id = item.origin;
                item.editado = false;
                item.aceptado = true;
                item.origin = undefined;
                await Item.findByIdAndUpdate(item._id, item);
                await Item.findByIdAndDelete(req.body.id);

                const nombreArr = item.imagen.split('/');
                const nombre = nombreArr[nombreArr.length - 1];
                const [ public_id, extension ] = nombre.split('.');
                await cloudinary.uploader.destroy(public_id);
            }
            else await Item.findByIdAndUpdate(req.body.id, {aceptado: true});
        }
        else if(item.origin) {
            await Item.findByIdAndUpdate(item.origin, {aceptado: true});
            await Item.findByIdAndDelete(req.body.id);
            const nombreArr = item.imagen.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [ public_id, extension ] = nombre.split('.');
            await cloudinary.uploader.destroy(public_id);
        }
        returnAccepted(res, req.body.accepted);
    }
    else return returnBadRequest(res);
}

const accessAdmin = (req = request, res = response) => returnAccess(res, (req.query.password === 'EcoWikiAdmin'));

module.exports = {
    acceptItem,
    accessAdmin,
    getItem,
    deleteItem
}