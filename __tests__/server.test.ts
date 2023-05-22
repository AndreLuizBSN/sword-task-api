import { user } from "../src/services"; 
import { UserInterface, UserType } from "../src/interfaces/user.interface";

describe("Validation User data tests", () => {
    test("Math test", () => {
      const data: UserInterface = {
        name: "User test Validate",
        active: true,
        created_at: "2023-05-10",
        type: UserType.TECH,
        email: "uservalidate@mail.com",
        password: "123",
        password_confirmation: "123"
      }
      const res = user.validate(data);
      expect(res.ok).toBe(true);
    });
  });