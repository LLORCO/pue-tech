import { beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.fn();
const redirect = vi.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ cookie: "x=1" }) }));
vi.mock("next/navigation", () => ({ redirect }));

const { getAdminSession, requireAdmin } = await import("./session");

const fakeSession = {
  session: { id: "s1", userId: "u1", token: "t", expiresAt: new Date() },
  user: { id: "u1", email: "admin@puetech.test", name: "Admin" },
};

describe("requireAdmin", () => {
  beforeEach(() => {
    getSession.mockReset();
    redirect.mockClear();
  });

  it("redirige a /panel/login cuando no hay sesión", async () => {
    getSession.mockResolvedValue(null);
    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT:/panel/login");
    expect(redirect).toHaveBeenCalledWith("/panel/login");
  });

  it("devuelve la sesión cuando existe", async () => {
    getSession.mockResolvedValue(fakeSession);
    await expect(requireAdmin()).resolves.toBe(fakeSession);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("consulta a Better Auth con los headers de la petición", async () => {
    getSession.mockResolvedValue(null);
    await expect(getAdminSession()).resolves.toBeNull();
    const arg = getSession.mock.calls[0][0] as { headers: Headers };
    expect(arg.headers.get("cookie")).toBe("x=1");
  });
});
