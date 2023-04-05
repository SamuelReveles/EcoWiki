function returnItem(res, item) {
    const status = (item) ? 200 : 400;
    const msg = (item.length === 0) ? "item not found" : undefined;
    return res.status(status).json({
        item,
        msg
    });
}

module.exports = {
    returnItem,
    
}