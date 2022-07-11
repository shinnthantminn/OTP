const joi = require("joi");

module.exports = {
  schemaBody: {
    user: {
      register: {
        // body validation
        body: joi.object({
          username: joi.string().min(3).required(),
          email: joi.string().email().required(),
          password: joi.string().min(5).required(),
          googleId: joi.optional(),
        }),
        // patch validation
        patch: joi.object({
          username: joi.string().min(3),
          email: joi.string().email(),
          password: joi.string().min(5),
          googleId: joi.optional(),
        }),
      },
      login: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(5).required(),
      }),
      verify: joi.object({
        otp: joi.string().min(5).required(),
      }),
      resend: joi.object({
        email: joi.string().email().required(),
      }),
    },
    course: {
      create: {
        body: joi.object({
          coursename: joi.string().required(),
          category: joi.string().required(),
          price: joi.number().required(),
        }),
      },
    },
  },
  schemaParam: {
    id: joi.object({
      id: joi
        .string()
        .regex(/^[a-fA-f0-9]{24}$/)
        .required(),
    }),
  },
};
