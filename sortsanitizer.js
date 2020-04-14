// apps/api/src/job-posting/sanitizers.js

/**
 * Method to clean the sort sent in query parameters
 *
 * @param {object} sort - sort from query parameters
 * @param {Array} sortableFields the fields allowed to be used as a sort
 * @returns {Array} Ready-to-use filters for the sql query
 */
const sortSanitizer = (sort, sortableFields) => {
    const sortTwoFirstParameters = [
        sort ? sort[0] || null : null,
        sort ? sort[1] || null : null,
    ];
    if (
        !sortTwoFirstParameters ||
        !sortableFields.includes(sortTwoFirstParameters[0])
    ) {
        return [sortableFields[0], "ASC"];
    }

    if (!["ASC", "DESC"].includes(sort[1])) {
        return [sortTwoFirstParameters[0], "ASC"];
    }

    return sortTwoFirstParameters;
};

/**
 * Method to clean the sort sent in query parameters
 *
 * @param {object} sort - sort from query parameters
 * @param {Array} sortableFields the fields allowed to be used as a sort
 * @returns {Array} Ready-to-use filters for the sql query
 */
const sortSanitizerRefactored = ({ sortBy, orderBy }, sortableFields) => {
    if (orderBy == undefined || !sortableFields.includes(sortBy)) {
        return [sortableFields[0], "ASC"];
    }

    if (!["ASC", "DESC"].includes(orderBy)) {
        return [sortBy, "ASC"];
    }

    return [sortBy, orderBy];
};

module.exports = { sortSanitizer, sortSanitizerRefactored };
