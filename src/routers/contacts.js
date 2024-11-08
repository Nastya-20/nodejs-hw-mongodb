import { Router } from "express";
import * as contactControllers from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { contactAddSchema, contactUpdateSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";

const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get("/:contactId", isValidId, ctrlWrapper(contactControllers.getContactByIdController));

contactsRouter.post("/", validateBody(contactAddSchema), ctrlWrapper(contactControllers.addContactController));

contactsRouter.put("/:contactId", isValidId,  validateBody(contactAddSchema), ctrlWrapper(contactControllers.upsertContactController));

contactsRouter.patch("/:contactId", isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactControllers.patchContactController));

contactsRouter.delete("/:contactId", isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;


