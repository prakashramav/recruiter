import { AppError } from '../utils/AppError.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error.errors) {
        const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        return next(new AppError(errorMessages, 400));
      }
      next(error);
    }
  };
};
