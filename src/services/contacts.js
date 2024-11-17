import ContactCollection from "../db/models/Contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { parseContactFilterParams } from "../utils/parseContactFilterParams.js";

export const getContacts = async ({
    page = 1,
    perPage = 10,
    sortBy = "_contactId",
    sortOrder = "asc",
    filter = {},
    userId,
}) => {
    try {
        const skip = (page - 1) * perPage;

        const parsedFilters = parseContactFilterParams(filter);

        let query = ContactCollection.find();

        if (parsedFilters.contactType) {
            query = query.where('contactType').equals(parsedFilters.contactType);
        }
        if (parsedFilters.isFavourite !== undefined) {
            query = query.where('isFavourite').equals(parsedFilters.isFavourite);
        }
        if (filter.userId) {
            query.where("userId").equals(filter.userId);
        }

        const totalItems = await ContactCollection.find({ userId }).merge(query).countDocuments();

        query = query.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });

        const data = await query.exec();

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

export const getContactById = async (contactId, userId) => {
    return await ContactCollection.findOne({_id: contactId, userId});
};

export const addContact = async (payload) => {
    return await ContactCollection.create(payload);
};

export const updateContact = async ({ _contactId, payload, options = {}, userId }) => {
    const updatedContact = await ContactCollection.findOneAndUpdate(
        { _id: _contactId, userId },
        payload, {
        ...options,
        new: true,
    }
    );

    return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
       const deletedContact = await ContactCollection.findOneAndDelete({
        _id: contactId,
        userId,
    });

    return deletedContact;
};


