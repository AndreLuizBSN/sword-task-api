import request from "supertest";

import app from "../src/app";



describe("Server.ts tests", () => {
    test("Math test", () => {
      expect(2 + 2).toBe(4);
    });
  });