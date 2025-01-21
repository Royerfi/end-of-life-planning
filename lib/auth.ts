import { jwtVerify, SignJWT } from 'jose';

interface JWTPayload {
  userId: string;
  email: string;
  [key: string]: unknown; // Replace `any` with `unknown` for stricter type checking
}

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || (() => {
    throw new Error("JWT_SECRET environment variable is required");
  })()
);

const tokenExpiration = parseInt(process.env.JWT_EXPIRATION || "86400", 10); // Default: 24 hours

export async function sign(payload: JWTPayload): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + tokenExpiration;

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(secret);
}

export async function verify(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    return payload as JWTPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
}
