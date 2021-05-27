import { buildCreateTutorAssignment, buildUpdateTutorAssignment, uploadTutorAssignmentCSV } from "main/services/TutorAssignment/TutorAssignmentService";

import { fetchWithToken } from "main/utils/fetch";

jest.mock("main/utils/fetch", () => ({
    fetchWithToken:  jest.fn()
}));

describe("TutorAssignmentService tests", () => {

    const getToken = jest.fn();

    const onSuccess = jest.fn();

    const onError = jest.fn();

    beforeEach( () => {
        jest.clearAllMocks();
    });

    test("buildCreateTutorAssignment and invoke createTutorAssignment", async () => {
        const createTutorAssignment = buildCreateTutorAssignment(getToken, onSuccess, onError);
        await createTutorAssignment();
        expect(onSuccess).toBeCalledTimes(1);
    });
    test("buildUpdateTutorAssignment and invoke updateTutorAssignment", async () => {
        const updateTutorAssignment = buildUpdateTutorAssignment(getToken, onSuccess, onError);
        await updateTutorAssignment();
        expect(onSuccess).toBeCalledTimes(1);
    });
    test("buildCreateTutorAssignment where we expect onError to be called", async () => {
        fetchWithToken.mockImplementation( async () => { throw new Error("mock error"); } );
        const createTutorAssignment = buildCreateTutorAssignment(getToken, onSuccess, onError);
        await createTutorAssignment();
        expect(onError).toBeCalledTimes(1);
    });

    test("buildUpdateTutorAssignment where we expect onError to be called", async () => {
        fetchWithToken.mockImplementation( async () => { throw new Error("mock error"); } );
        const updateTutorAssignment = buildUpdateTutorAssignment(getToken, onSuccess, onError);
        await updateTutorAssignment();
        expect(onError).toBeCalledTimes(1);
    });

    test("uploadTutorAssignmentCSV and invoke uploadTutorAssignment", async () => {
        const uploadTutorAssignment = uploadTutorAssignmentCSV(getToken, onSuccess, onError);
        await uploadTutorAssignment();
        expect(onSuccess).toBeCalledTimes(1);
    });

    test("uploadTutorAssignmentCSV where we expect onError to be called", async () => {
        fetchWithToken.mockImplementation( async () => { throw new Error("mock error");});
        const uploadTutorAssignment = uploadTutorAssignmentCSV(getToken, onSuccess, onError);
        await uploadTutorAssignment();
        expect(onError).toBeCalledTimes(1);
    });

});
