import { Router } from "express";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import * as contactControllers from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { contactAddSchema, contactUpdateSchema } from "../validation/contacts.js";


const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get("/:contactId", isValidId, ctrlWrapper(contactControllers.getContactByIdController));

contactsRouter.post("/", validateBody(contactAddSchema), ctrlWrapper(contactControllers.addContactController));

contactsRouter.put("/:contactId", isValidId,  validateBody(contactAddSchema), ctrlWrapper(contactControllers.upsertContactController));

contactsRouter.patch("/:contactId", isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactControllers.patchContactController));

contactsRouter.delete("/:contactId", isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;


