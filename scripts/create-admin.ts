import { auth } from "../lib/auth";

// Crea la cuenta del administrador aunque el registro por HTTP esté cerrado,
// usando el adaptador interno y el hasher de contraseñas de Better Auth.
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Admin";
  if (!email || !password) {
    throw new Error("Define ADMIN_EMAIL y ADMIN_PASSWORD.");
  }

  const ctx = await auth.$context;
  const { minPasswordLength, maxPasswordLength } = ctx.password.config;
  if (password.length < minPasswordLength || password.length > maxPasswordLength) {
    throw new Error(
      `La contraseña debe tener entre ${minPasswordLength} y ${maxPasswordLength} caracteres.`,
    );
  }

  if (await ctx.internalAdapter.findUserByEmail(email)) {
    console.log(`Ya existe una cuenta con ${email}; no se hizo nada.`);
    return;
  }

  const hash = await ctx.password.hash(password);
  const user = await ctx.internalAdapter.createUser({ email, name }, { method: "admin" });
  try {
    await ctx.internalAdapter.linkAccount({
      userId: user.id,
      providerId: "credential",
      accountId: user.id,
      password: hash,
    });
  } catch (e) {
    await ctx.internalAdapter.deleteUser(user.id);
    throw e;
  }
  console.log(`Cuenta de administrador creada: ${email}`);
}

main().then(
  () => process.exit(0),
  (e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  },
);
