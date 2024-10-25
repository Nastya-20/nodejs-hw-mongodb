import ContactCollection from "../db/models/Contact.js";

export const getContacts = async () => {
    return await ContactCollection.find();
};

export const getContactById = async (contactId) => {
    return await ContactCollection.findById(contactId);
};
