const handler = require('./handler')

module.exports = function (req, res) {
    let {
        url,
        method
    } = req
    if (url === '/' || url === '/index') {
        handler.renderIndex(req, res)
    } else if (url === '/add') {
        handler.renderAdd(req, res)
    } else if (url.startsWith('/delete')) {
        handler.handlerDelete(req, res)
    } else if (url.startsWith('/fb') && method === 'GET') {
        handler.handlerGetAdd(req, res)
    } else if (url.startsWith('/fb') && method === 'POST') {
        handler.handlerPostAdd(req, res)
    } else if (url.startsWith('/static')) {
        handler.handlerStatic(req, res)
    } else {
        handler.handler404(req, res)
    }
}