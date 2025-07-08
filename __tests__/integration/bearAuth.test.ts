
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/index";

const secret = process.env.JWT_SECRET_KEY || "test_secret";

describe("bearAuth middleware", () => {
  it("should block requests with no token", async () => {
    const res = await request(app).get("/user");
    expect([401, 403]).toContain(res.statusCode);
  });

  it("should block requests with invalid token", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer invalidtoken`);
    expect([401, 403]).toContain(res.statusCode);
  });

  it("should allow request with valid token & role", async () => {
    const token = jwt.sign({ sub: 1, role: "admin" }, secret, { expiresIn: "1h" });
    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 404]).toContain(res.statusCode);
  });
});
