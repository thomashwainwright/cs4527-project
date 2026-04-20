import { describe, test, expect, vi } from "vitest";
import request from "supertest";
import app from "../app";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// mock DB + bcrypt
vi.mock("pg", () => {
  return {
    Pool: function () {
      return {
        query: vi.fn().mockResolvedValue({
          rows: [{ password_hash: "fake" }],
        }),
      };
    },
  };
});

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
  compare: vi.fn(),
}));

describe("POST /api/login", () => {
  test("returns 401 for invalid login", async () => {
    const bcrypt = await import("bcryptjs");
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post("/api/login").send({
      email: "test@test.com",
      password: "wrong",
    });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/check-auth", () => {
  test("returns false when no token exists", async () => {
    const res = await request(app).get("/api/check-auth");

    expect(res.status).toBe(200);
    expect(res.body.isAuthenticated).toBe(false);
  });

  test("returns true for valid token", async () => {
    const token = jwt.sign({ email: "test@example.com" }, "secret_key");

    const res = await request(app)
      .get("/api/check-auth")
      .set("Cookie", `token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.isAuthenticated).toBe(true);
    expect(res.body.email).toBe("test@example.com");
  });
});
