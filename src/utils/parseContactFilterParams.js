import { typeList } from "../constants/contacts.js";

export const parseContactFilterParams = ({ contactType, isFavourite }) => {
    if (contactType && !typeList.includes(contactType)) {
        throw new Error("Invalid contactType value");
    }

    return {
        contactType,
        isFavourite,
    };
};

