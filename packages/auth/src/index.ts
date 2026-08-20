import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

export interface AuthClaims {
  sub: string;
  email?: string;
  role?: string;
  raw: JWTPayload;
}

export interface VerifyTokenOptions {
  jwtSecret?: string;
  supabaseUrl?: string;
}

/**
 * Milestone 0 auth stub: verifies Supabase JWTs when configured.
 * In local/dev without secrets, `dev-bypass` bearer returns a deterministic subject.
 * Disabled in production unless ALLOW_AUTH_DEV_BYPASS=1 (tests/local only).
 */
export async function verifyAccessToken(
  token: string,
  options: VerifyTokenOptions = {},
): Promise<AuthClaims> {
  const allowDevBypass =
    process.env.ALLOW_AUTH_DEV_BYPASS === "1" || process.env.NODE_ENV !== "production";

  if (token === "dev-bypass" && allowDevBypass) {
    return {
      sub: "dev-user",
      email: "dev@communityos.local",
      role: "authenticated",
      raw: { sub: "dev-user" },
    };
  }

  if (options.jwtSecret) {
    const secret = new TextEncoder().encode(options.jwtSecret);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    if (!payload.sub) {
      throw new Error("Token missing subject");
    }
    return {
      sub: payload.sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
      role: typeof payload.role === "string" ? payload.role : undefined,
      raw: payload,
    };
  }

  if (options.supabaseUrl) {
    const jwks = createRemoteJWKSet(
      new URL(`${options.supabaseUrl}/auth/v1/.well-known/jwks.json`),
    );
    const { payload } = await jwtVerify(token, jwks);
    if (!payload.sub) {
      throw new Error("Token missing subject");
    }
    return {
      sub: payload.sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
      role: typeof payload.role === "string" ? payload.role : undefined,
      raw: payload,
    };
  }

  throw new Error("Auth is not configured");
}

export function parseBearerToken(headerValue: string | undefined): string | null {
  if (!headerValue) return null;
  const [scheme, token] = headerValue.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}
