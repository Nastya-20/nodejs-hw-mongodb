import { typeList } from "../constants/contacts.js";

export const parseContactFilterParams = ({ contactType, isFavourite }) => {
    if (contactType && !typeList.includes(contactType)) {
        throw new Error("Invalid contactType value");
    }

    const parsedIsFavourite = isFavourite === "true" ? true : isFavourite === "false" ? false : isFavourite;

    if (parsedIsFavourite !== undefined && typeof parsedIsFavourite !== "boolean") {
        throw new Error("Invalid isFavourite value, expected boolean");
    }

    return {
        contactType,
        isFavourite: parsedIsFavourite,
    };
};

