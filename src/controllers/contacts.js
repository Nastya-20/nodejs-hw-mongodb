import createHttpError from "http-errors";
import * as contactServices from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseContactFilterParams } from "../utils/parseContactFilterParams.js";
import { sortByList } from "../db/models/Contact.js";

export const getContactsController = async (req, res, next) => {
        const { page, perPage } = parsePaginationParams(req.query);
        const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
        const filter = parseContactFilterParams(req.query);
        const { _id: userId } = req.user;
        filter.userId = userId;

        const data = await contactServices.getContacts({
            page,
            perPage,
            sortBy,
            sortOrder,
            filter,
        });
    res.status(200).json({
        status: 200,
        message: "Successfully found contacts",
        data,
    });
 };

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const data = await contactServices.getContactById(contactId, userId);

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
    const { _id: userId } = req.user;
    const payload = { ...req.body, userId };
    const data = await contactServices.addContact(payload);

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data,
  });
};

export const upsertContactController = async (req, res) => {
    const { contactId: _contactId } = req.params;
    const { _id: userId } = req.user;
    const result = await contactServices.updateContact({
        _contactId, payload: {...req.body, userId}, options: {
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
    const { _id: userId } = req.user;

    const result = await contactServices.updateContact({ _contactId, payload: {...req.body, userId} });

    if (!result) {
        throw createHttpError(404, `Contact with id=${_contactId} not found `);
    }

     res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result.data,
    });
};

export const deleteContactController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const { _id: userId } = req.user;

        const deletedContact = await contactServices.deleteContact(contactId, userId);

        if (!deletedContact) {
            return next(createHttpError(404, `Contact with id=${contactId} not found`));
        }

        res.status(200).json({
            status: 200,
            message: `Contact with id=${contactId} successfully deleted`,
        });
    } catch (err) {
        next(err);
    }
};
