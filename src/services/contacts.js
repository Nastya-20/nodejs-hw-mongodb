import ContactCollection from "../db/models/Contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { parseContactFilterParams } from "../utils/parseContactFilterParams.js";

export const getContacts = async ({
    page = 1,
    perPage = 10,
    sortBy = "_contactId",
    sortOrder = "asc",
    filter = {}
}) => {
    try {
        const parsedFilters = parseContactFilterParams(filter);

        const skip = (page - 1) * perPage;

        let query = ContactCollection.find();

        if (parsedFilters.contactType) {
            query = query.where('contactType').equals(parsedFilters.contactType);
        }
        if (parsedFilters.isFavourite !== undefined) {
            query = query.where('isFavourite').equals(parsedFilters.isFavourite);
        }

        query = query.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });

        const data = await query.exec();

        const totalItems = await ContactCollection.countDocuments(query.getFilter());

        const paginationData = calculatePaginationData({ totalItems, page, perPage });

        return {
            data,
            ...paginationData,
        };
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const getContactById = async (contactId) => {
    return await ContactCollection.findById(contactId);
};

export const addContact = async (payload) => {
    return await ContactCollection.create(payload);
};

export const updateContact = async ({ _contactId, payload, options = {} }) => {
    const rawResult = await ContactCollection.findOneAndUpdate({ _id:_contactId }, payload, {
        ...options,
        includeResultMetadata: true,
    });

    if (!rawResult || !rawResult.value) return null;

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject.upserted),
    };
};

export const deleteContact = async filter => {
    return await ContactCollection.findOneAndDelete(filter);
};


