"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const searchableFields = (searchableFields, searchTerm) => {
    return {
        $or: searchableFields.map((field) => ({
            [field]: {
                $regex: searchTerm,
                $options: 'i',
            },
        })),
    };
};
const fieldFilter = (filtersData) => {
    return {
        $and: Object.entries(filtersData).map(([field, value]) => ({
            [field]: value,
        })),
    };
};
exports.QueryBuilder = {
    searchableFields,
    fieldFilter,
};
