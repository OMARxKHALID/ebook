const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    res.status(400);
    const errors = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    next(new Error(JSON.stringify(errors)));
  }
};

module.exports = validate;
