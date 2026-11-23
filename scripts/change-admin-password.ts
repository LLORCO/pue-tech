import { auth } from "../lib/auth";

// Cambia la contraseña de la cuenta del administrador y cierra todas sus
// sesiones abiertas. La contraseña nueva se escribe en la terminal sin que
// se vea; si no hay terminal interactiva, se toma de ADMIN_PASSWORD.

function promptHidden(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    process.stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (chunk: string) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n") {
          cleanup();
          process.stdout.write("\n");
          resolve(value);
          return;
        }
        if (ch === "\u0003") {
          cleanup();
          process.stdout.write("\n");
          reject(new Error("Cancelado."));
          return;
        }
        if (ch === "\u007f" || ch === "\b") value = value.slice(0, -1);
        else value += ch;
      }
    };
    const cleanup = () => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
    };
    stdin.on("data", onData);
  });
}

async function readNewPassword(): Promise<string> {
  if (!process.stdin.isTTY) {
    const fromEnv = process.env.ADMIN_PASSWORD;
    if (!fromEnv) throw new Error("Sin terminal interactiva: define ADMIN_PASSWORD.");
    return fromEnv;
  }
  const first = await promptHidden("Contraseña nueva: ");
  const second = await promptHidden("Repítela: ");
  if (first !== second) throw new Error("Las contraseñas no coinciden; no se cambió nada.");
  return first;
}

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) throw new Error("Define ADMIN_EMAIL.");

  const ctx = await auth.$context;
  const user = await ctx.internalAdapter.findUserByEmail(email);
  if (!user) throw new Error(`No existe una cuenta con ${email}.`);

  const password = await readNewPassword();
  const { minPasswordLength, maxPasswordLength } = ctx.password.config;
  if (password.length < minPasswordLength || password.length > maxPasswordLength) {
    throw new Error(
      `La contraseña debe tener entre ${minPasswordLength} y ${maxPasswordLength} caracteres.`,
    );
  }

  await ctx.internalAdapter.updatePassword(user.user.id, await ctx.password.hash(password));
  await ctx.internalAdapter.deleteUserSessions(user.user.id);
  console.log(`Contraseña actualizada para ${email}. Se cerraron sus sesiones abiertas.`);
}

main().then(
  () => process.exit(0),
  (e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  },
);
