import { Link } from "../models/Links.js";

export const redirectLink = async (req, res) => {
  try {
    const { nanoLink } = req.params;
    const link = await Link.findOne({ nanoLink });

    if (!link)
      return res.status(404).json({ error: "Error 404: El Link No Existe" });

    return res.redirect(link.longLink);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato De id Incorrecto" });
    }
    return res.status(500).json({ error: "Error De Servidor" });
  }
};
