// Mock the db module so these tests never touch a real MySQL connection.
jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

const db = require("../config/db");
const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");

// Small helper to build a fake Express `res` object we can assert against.
function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("applicationController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createApplication", () => {
    test("rejects requests missing a title or organization", async () => {
      const req = { body: { title: "" }, user: { id: 1 } };
      const res = mockResponse();

      await createApplication(req, res);

      expect(db.query).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      );
    });

    test("inserts a new application scoped to the logged-in user", async () => {
      db.query.mockResolvedValueOnce([{ insertId: 42 }]);

      const req = {
        body: {
          title: "SWE Intern",
          organization: "Acme Corp",
          type: "Job",
          status: "Wishlist",
          date_applied: "",
          deadline: "2026-01-15",
          link: "",
          notes: "",
        },
        user: { id: 7 },
      };
      const res = mockResponse();

      await createApplication(req, res);

      expect(db.query).toHaveBeenCalledTimes(1);
      const [, params] = db.query.mock.calls[0];
      expect(params[0]).toBe(7); // user_id is the first bound param
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ applicationId: 42 })
      );
    });

    test("returns 500 if the database call fails", async () => {
      db.query.mockRejectedValueOnce(new Error("db is down"));

      const req = {
        body: { title: "SWE Intern", organization: "Acme" },
        user: { id: 1 },
      };
      const res = mockResponse();

      await createApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getApplications", () => {
    test("only returns applications belonging to the logged-in user", async () => {
      const fakeRows = [{ id: 1, title: "Test App", user_id: 7 }];
      db.query.mockResolvedValueOnce([fakeRows]);

      const req = { user: { id: 7 } };
      const res = mockResponse();

      await getApplications(req, res);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [7]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeRows);
    });
  });

  describe("updateApplication", () => {
    test("returns 400 for a non-numeric id", async () => {
      const req = { params: { id: "not-a-number" }, body: {}, user: { id: 1 } };
      const res = mockResponse();

      await updateApplication(req, res);

      expect(db.query).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("returns 404 when no row matches that id + user", async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const req = {
        params: { id: "5" },
        body: { title: "Updated Title", organization: "Acme" },
        user: { id: 1 },
      };
      const res = mockResponse();

      await updateApplication(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteApplication", () => {
    test("deletes the row and confirms success", async () => {
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const req = { params: { id: "3" }, user: { id: 1 } };
      const res = mockResponse();

      await deleteApplication(req, res);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [3, 1]);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
