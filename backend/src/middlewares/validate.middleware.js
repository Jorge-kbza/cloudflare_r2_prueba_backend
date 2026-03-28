const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    req.body = data; // datos ya validados y tipados
    next();
  } catch (err) {
    return res.status(400).json({
      error: err.issues.map(e => e.message)
    });
  }
};

module.exports = validate;