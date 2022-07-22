import { User } from "../models/User.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    //alternativa buscando por email
    let user = await User.findOne({ email });
    if (user) throw { code: 11000 };

    user = new User({ email, password });
    await user.save();

    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);

    return res.status(201).json({ token, expiresIn });
  } catch (error) {
    console.info(error.message);

    //alternativa por defecto mongoose
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "El Usuario Ya Existe En La Base De Datos" });
    }

    return res.status(500).json({ error: "Error De Servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(403)
        .json({ error: "El Usuario No Existe En La Base De Datos" });

    const respuestaPassword = await user.comparePassword(password);
    if (!respuestaPassword)
      return res.status(403).json({ error: "Password Incorrecto" });

    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);

    return res.status(201).json({ token, expiresIn });
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({ error: "Error De Servidor" });
  }
};

export const infoUser = async (req, res) => {
  try {
    const user = await User.findById(req.uid).lean();
    return res.status(201).json({ email: user.email, id: user.id });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Error De Servidor" });
  }
};

export const refreshToken = (req, res) => {
  try {
    const { token, expiresIn } = generateToken(req.uid);

    return res.status(201).json({ token, expiresIn });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Error De Servidor" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};
