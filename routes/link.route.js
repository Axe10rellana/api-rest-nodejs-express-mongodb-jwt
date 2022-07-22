import { Router } from "express";
import {
  createLink,
  getLink,
  getLinks,
  removeLink,
  updateLink,
} from "../controllers/link.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import {
  bodyLinksValidator,
  paramLinkValidator,
} from "../middlewares/validatorManager.js";

const router = Router();

router.get("/", requireToken, getLinks);
//router.get("/:id", requireToken, getLinkCrud);  Para un crud tradicional
router.get("/:nanoLink", getLink);
router.post("/", requireToken, bodyLinksValidator, createLink);
router.delete("/:id", requireToken, paramLinkValidator, removeLink);
router.patch(
  "/:id",
  requireToken,
  paramLinkValidator,
  bodyLinksValidator,
  updateLink
);

export default router;
