import createHttpError from "http-errors";
import * as contactServices from "../services/contacts.js";

export const getContactsController = async (req, res) => {
    const data = await contactServices.getContacts();
    res.status(200).json({
        status: 200,
        message: "Successfully found contacts",
        data,
    });
 };

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const data = await contactServices.getContactById(contactId);

    if (!data) {
        throw createHttpError(404, `Contact with id=${contactId} not found`);
     }
        res.status(200).json({
            status: 200,
            message: "Contact successfully found",
            data,
    });
};

export const addContactController = async (req, res) => {
    const data = await contactServices.addContact(req.body);
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data,
    });
};
export const upsertContactController = async (req, res) => {
    const { contactId: _contactId } = req.params;
    const result = await contactServices.updateContact({
        _contactId, payload: req.body, options: {
        upsert: true,
        }
    });
    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status: 200,
        message: "Contact upserted successfuly",
        data: result.data,
    });
};

export const patchContactController = async (req, res) => {
    const { contactId: _contactId } = req.params;

    const result = await contactServices.updateContact({ _contactId, payload: req.body });

    if (!result) {
        throw createHttpError(404, `Contact with id=${_contactId} not found `);
    }

     res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result.data,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId: _contactId } = req.params;

    const data = await contactServices.deleteContact({_id: _contactId });

    if (!data) {
        throw createHttpError(404, `Contact with id=${_contactId} not found `);
    };

     res.status(204).send();
};
