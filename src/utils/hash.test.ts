import CryptoJS from "crypto-js";

import { hashPassword } from "./hash";

describe("Hash", () => {
  it("should return the correct hash", () => {
    const password = "password";

    const expectedHash = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    const hashedPassword = hashPassword(password);

    expect(hashedPassword).toBe(expectedHash);
  });

  it("should return different hashes for different passwords", () => {
    const password1 = "password123";
    const password2 = "password456";

    const hashedPassword1 = hashPassword(password1);
    const hashedPassword2 = hashPassword(password2);

    expect(hashedPassword1).not.toBe(hashedPassword2);
  });

  it("should return a consistent hash for the same password", () => {
    const password = "password";

    const hashedPassword1 = hashPassword(password);
    const hashedPassword2 = hashPassword(password);

    expect(hashedPassword1).toBe(hashedPassword2);
  });
});
