/*
 * Génère la valeur de ADMIN_PASSWORD_HASH à partir d'un mot de passe.
 * Usage : npm run admin:hash -- "mon mot de passe"
 */
import { hashPassword } from "../src/lib/admin/password.ts";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Usage : npm run admin:hash -- "mot de passe" (10 caractères minimum)');
  process.exit(1);
}
console.log(await hashPassword(password));
