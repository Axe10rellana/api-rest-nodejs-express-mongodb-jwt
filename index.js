import "dotenv/config";
import "./database/connectDB.js";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import linkRouter from "./routes/link.route.js";
import redirectRouter from "./routes/redirect.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
const whiteList = [process.env.ORIGIN1];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whiteList.includes(origin)) {
        return callback(null, origin);
      }

      return callback(`Error De CORS origin: ${origin} No Autorizado!`);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//ejemplo backend redirect (opcional)
app.use("/", redirectRouter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/links", linkRouter);

//solo para el ejemplo de login/token
//app.use(express.static("public"));

app.listen(PORT, () =>
  console.info(`Servidor de express http://localhost:${PORT}`)
);
