import axios from "axios";
import { validationResult, body, param } from "express-validator";

export const validationResultsExpress = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const paramLinkValidator = [
  param("id", "Formato No Válido (expressValidator)")
    .trim()
    .notEmpty()
    .escape(),
  validationResultsExpress,
];

export const bodyLinksValidator = [
  body("longLink", "Formato De Link Incorrecto")
    .trim()
    .notEmpty()
    .custom(async (value) => {
      try {
        if (!value.startsWith("https://")) {
          value = `https://${value}`;
        }

        await axios.get(value);
        return value;
      } catch (error) {
        console.error(error.message);
        throw new Error("Error 404: No Se Encontro EL longLink");
      }
    }),
  validationResultsExpress,
];

export const bodyRegisterValidator = [
  body("email", "Formato De Email Incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "El Password Debe Tener Como Minimo 6 Caracteres")
    .trim()
    .isLength({ min: 6 }),
  body("password", "Formato De Password Incorrecto").custom(
    (value, { req }) => {
      if (value !== req.body.repassword) {
        throw new Error("Los Passwords No Coinciden");
      }
      return value;
    }
  ),
  validationResultsExpress,
];

export const bodyLoginValidator = [
  body("email", "Formato De Email Incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password", "El Password Debe Tener Como Minimo 6 Caracteres")
    .trim()
    .isLength({ min: 6 }),
  validationResultsExpress,
];
