import supertest from "supertest";
import { server } from "./server";

describe("Server", function () {
  const request = supertest.agent(server);

  afterAll((done) => {
    server.close(done);
  });

  it("should get /api", async () => {
    const res = await request.get("/api");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { name: "Meet Shah1" } });
  });
});
