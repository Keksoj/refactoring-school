const { sortSanitizer, sortSanitizerRefactored } = require("./sortsanitizer");

// apps/api/src/toolbox/sanitizers.spec.js

describe("sortSanitizer", () => {
    test("should return the first sortable field ASC if query sort are not set", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(sortSanitizer(undefined, defaultSortableFields)).toEqual([
            "foo",
            "ASC",
        ]);
    });

    test("should return the first sortable field ASC if query sort is not an array", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(sortSanitizer({ bar: "DESC" }, defaultSortableFields)).toEqual([
            "foo",
            "ASC",
        ]);
    });

    test("should return the first sortable field ASC if query sort is not a sortable field", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(
            sortSanitizer(["notSortable", "DESC"], defaultSortableFields)
        ).toEqual(["foo", "ASC"]);
    });

    test("should replace the sort order with ASC if the query param sort order is not valid", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(
            sortSanitizer(["bar", "horizontal"], defaultSortableFields)
        ).toEqual(["bar", "ASC"]);
    });

    test("should remove the supernumerary parameters of the sorting array", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(
            sortSanitizer(
                ["bar", "DESC", "this", "is", "too", "much"],
                defaultSortableFields
            )
        ).toEqual(["bar", "DESC"]);
    });

    test("should return a well formated sort from query parameter", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(sortSanitizer(["bar", "DESC"], defaultSortableFields)).toEqual([
            "bar",
            "DESC",
        ]);
    });
});

// the same tests for the refactored function
describe("sortSanitizerRefactored", () => {
    test("should return the first sortable field ASC if sortBy is not set", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(
            sortSanitizerRefactored(
                { sortBy: undefined, orderBy: "DESC" },
                defaultSortableFields
            )
        ).toEqual(["foo", "ASC"]);
    });

    test("should return the first sortable field ASC if orderBy is not set", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(
            sortSanitizerRefactored(
                { sortBy: "bar", orderBy: undefined },
                defaultSortableFields
            )
        ).toEqual(["foo", "ASC"]);
    });

    // ce test n'a pas de sens puisque sort est nécessairement un objet
    // test("should return the first sortable field ASC if query sort is not an array", () => {
    //     const defaultSortableFields = ["foo", "bar"];
    //     expect(
    //         sortSanitizerRefactored({ bar: "DESC" }, defaultSortableFields)
    //     ).toEqual(["foo", "ASC"]);
    // });

    test("should return the first sortable field ASC if query sort is not a sortable field", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(
            sortSanitizerRefactored(
                { sortBy: "notSortable", orderBy: "DESC" },
                defaultSortableFields
            )
        ).toEqual(["foo", "ASC"]);
    });

    test("should replace the sort order with ASC if the query param sort order is not valid", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(
            sortSanitizerRefactored(
                { sortBy: "bar", orderBy: "horizontal" },
                defaultSortableFields
            )
        ).toEqual(["bar", "ASC"]);
    });

    test("should remove the supernumerary parameters of the sort object", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(
            sortSanitizerRefactored(
                { sortBy: "bar", orderBy: "DESC", nonsense: "this" },
                defaultSortableFields
            )
        ).toEqual(["bar", "DESC"]);
    });

    test("should return a well formated sort from query parameter", () => {
        const defaultSortableFields = ["foo", "bar"];
        expect(
            sortSanitizerRefactored(
                { sortBy: "bar", orderBy: "DESC" },
                defaultSortableFields
            )
        ).toEqual(["bar", "DESC"]);
    });
});
