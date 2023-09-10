const filesPayloadExists = (req, res, next) => {
    if (!req.files) return res.status(400).json({
        success: 0,
        message: "Missing files"
    })

    next()
}

module.exports = filesPayloadExists