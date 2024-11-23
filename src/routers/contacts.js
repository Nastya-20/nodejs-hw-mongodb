import { Router } from "express";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import * as contactControllers from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { contactAddSchema, contactUpdateSchema } from "../validation/contacts.js";
import { upload } from "../middlewares/multer.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get("/:contactId", isValidId, ctrlWrapper(contactControllers.getContactByIdController));

//upload.fields([{ name: "photo", maxCount: 1 }, { name: "subphoto", maxCount: 3 }]);
// upload.array("photo", 10); - 10-max кількість фото
contactsRouter.post("/", upload.single("photo"), validateBody(contactAddSchema), ctrlWrapper(contactControllers.addContactController));

contactsRouter.patch("/:contactId", upload.single("photo"), isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactControllers.patchContactController));

contactsRouter.delete("/:contactId", isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;


