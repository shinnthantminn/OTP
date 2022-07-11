module.exports = {
  //body validation
  validateBody: (schema) => {
    return async (req, res, next) => {
      const result = await schema.validate(req.body);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else next();
    };
  },
  // unique validation
  validateUnique: (DB, ...name) => {
    return async (req, res, next) => {
      const num = [];
      for (const x of name) {
        const obj = {};
        obj[x] = req.body[x];
        const finder = await DB.findOne(obj);
        num.push(x);
        if (finder) {
          next(new Error(`this ${x} was existing in our server`));
        } else if (num.length === name.length) {
          next();
        }
      }
    };
  },

  // check id is wrong or right
  validateParam: (schema, name) => {
    return async (req, res, next) => {
      const obj = {};
      obj[name] = req.params[name];
      const result = schema.validate(obj);
      if (result.error) {
        next(new Error(result.error.details[0].message));
      } else next();
    };
  },
};
