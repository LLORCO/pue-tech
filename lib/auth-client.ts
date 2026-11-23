import { createAuthClient } from "better-auth/react";

// Mismo origen: el cliente usa window.location.origin + /api/auth.
export const authClient = createAuthClient();
