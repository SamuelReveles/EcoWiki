function returnItem(res, item) {
    const status = (item) ? 200 : 400;
    const msg = (item.length === 0) ? "item not found" : undefined;
    return res.status(status).json({
        item,
        msg
    });
}

function returnCreated(res, item) {
    const status = (item) ? 201 : 401;
    const msg = (item.length === 0) ? "item not found" : undefined;
    return res.status(status).json({
        item,
        msg
    });
}

function returnAccepted(res, answer = false) {
    const status = (answer === true) ? 201 : 200;
    const msg = (answer === false) ? "item not accepted" : "item accepted";
    return res.status(status).json(msg);
}

function returnAccess(res, access) {
    const status = (access) ? 202 : 403;
    const msg = (access) ? "Access allowed" : "Access denied";
    return res.status(status).json(msg);
}

function returnAdminItem(res, item) {
    const status = (item) ? 200 : 400;
    const msg = (item === undefined) ? "item not found" : undefined;
    return res.status(status).json({
        item: (item === null) ? undefined : item,
        msg,
        admin: true
    });
}

function returnBadRequest(res) {
    return res.status(400).json({
        msg: 'Bad requested'
    });
}

module.exports = {
    returnItem,
    returnCreated,
    returnAccepted,
    returnAccess,
    returnAdminItem,
    returnBadRequest,

}