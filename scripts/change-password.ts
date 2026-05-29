import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const EMAIL = "lead@collegiax.app";
const NEW_PASSWORD = "newpassword123"; // Change this to your desired password

const sqlite = new Database("./local.db");

const hash = bcrypt.hashSync(NEW_PASSWORD, 12);
const result = sqlite.prepare("UPDATE users SET password_hash = ? WHERE email = ?").run(hash, EMAIL);

if (result.changes > 0) {
  console.log(`Password updated successfully for ${EMAIL}`);
} else {
  console.log(`User ${EMAIL} not found.`);
}

sqlite.close();
