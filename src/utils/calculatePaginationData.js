export const calculatePaginationData = ({ data, totalItems, page, perPage }) => {
    const totalPages = Math.ceil(totalItems / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
        data,
        page,
        perPage,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
    };
};
