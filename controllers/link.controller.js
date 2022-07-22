import { Link } from "../models/Links.js";
import { nanoid } from "nanoid";

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ uid: req.uid });

    return res.status(201).json({ links });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Error De Servidor" });
  }
};

export const getLink = async (req, res) => {
  try {
    const { nanoLink } = req.params;
    const link = await Link.findOne({ nanoLink });

    if (!link)
      return res.status(404).json({ error: "Error 404: El Link No Existe" });

    return res.status(201).json({ longLink: link.longLink });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato De id Incorrecto" });
    }
    return res.status(500).json({ error: "Error De Servidor" });
  }
};

//getLink que se puede utilizar en un crud tradicional
export const getLinkCrud = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findById(id);

    if (!link)
      return res.status(404).json({ error: "Error 404: El Link No Existe" });

    if (!link.uid.equals(req.uid))
      return res.status(401).json({
        error: "No Tiene Permitido El Acceso A Los Datos De Este Usuario",
      });

    return res.status(201).json({ link });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato De id Incorrecto" });
    }
    return res.status(500).json({ error: "Error De Servidor" });
  }
};

export const createLink = async (req, res) => {
  try {
    let { longLink } = req.body;
    if (!longLink.startsWith("https://")) {
      longLink = `https://${longLink}`;
    }

    const link = new Link({ longLink, nanoLink: nanoid(6), uid: req.uid });
    const newLink = await link.save();

    return res.status(201).json({ newLink });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Error De Servidor" });
  }
};

export const removeLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findById(id);

    if (!link)
      return res.status(404).json({ error: "Error 404: El Link No Existe" });

    if (!link.uid.equals(req.uid))
      return res.status(401).json({
        error: "No Tiene Permitido El Acceso A Los Datos De Este Usuario",
      });

    await link.remove();

    return res.status(201).json({ link });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato De id Incorrecto" });
    }
    return res.status(500).json({ error: "Error De Servidor" });
  }
};

export const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    let { longLink } = req.body;
    if (!longLink.startsWith("https://")) {
      longLink = `https://${longLink}`;
    }
    const link = await Link.findById(id);

    if (!link)
      return res.status(404).json({ error: "Error 404: El Link No Existe" });

    if (!link.uid.equals(req.uid))
      return res.status(401).json({
        error: "No Tiene Permitido El Acceso A Los Datos De Este Usuario",
      });

    link.longLink = longLink;
    await link.save();

    return res.status(201).json({ link });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato De id Incorrecto" });
    }
    return res.status(500).json({ error: "Error De Servidor" });
  }
};
