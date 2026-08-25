const { body, param, validationResult } = require('express-validator');

const webhookRules = [
  body('Name')
    .trim()
    .notEmpty().withMessage('validation.required')
    .isLength({ max: 120 }).withMessage('validation.nameTooLong'),

  body('Description')
    .optional({ nullable: true })
    .isLength({ max: 500 }).withMessage('validation.descriptionTooLong')
    .default(''),

  body('URL')
    .trim()
    .notEmpty().withMessage('validation.required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('validation.invalidUrl'),
];

const idRule = [
  param('id').isInt({ min: 1 }).withMessage('validation.invalidId'),
];

/**
 * Middleware: returns 422 with structured errors if validation fails.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

module.exports = { webhookRules, idRule, handleValidation };
