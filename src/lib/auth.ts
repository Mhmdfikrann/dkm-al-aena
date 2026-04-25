import { compare } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { hasDatabaseUrl, withDbRetry } from "@/db"
import { users, type User } from "@/db/schema"
import { eq } from "drizzle-orm"

export type SessionUser = {
  id: string
  username: string
  role: "BENDAHARA" | "KETUA"
}

const cookieName = "al_aena_session"

function getSecret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-only-secret-change-before-production",
  )
}

export async function loginUser(username: string, password: string) {
  const user = await findUser(username)

  if (!user) {
    return null
  }

  const isValid = await compare(password, user.passwordHash)

  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
    role: user.role,
  } satisfies SessionUser
}

export async function setSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret())

  const cookieStore = await cookies()

  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(cookieName)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(cookieName)?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, getSecret())

    if (
      typeof payload.id !== "string" ||
      typeof payload.username !== "string" ||
      (payload.role !== "BENDAHARA" && payload.role !== "KETUA")
    ) {
      return null
    }

    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    } satisfies SessionUser
  } catch {
    return null
  }
}

export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function requireRole(roles: SessionUser["role"][]) {
  const user = await requireUser()

  if (!roles.includes(user.role)) {
    redirect("/admin?error=forbidden")
  }

  return user
}

async function findUser(username: string): Promise<User | null> {
  if (!hasDatabaseUrl()) {
    const demoUsers: User[] = [
      {
        id: "demo-bendahara",
        username: "bendahara",
        passwordHash:
          "$2b$10$.IebtAfg7AqDtMOrlBZ2MewBNQDlwnesR95J9tCxlXjzdFjcnYQqO",
        role: "BENDAHARA",
        otp: null,
        otpExpiry: null,
        createdAt: new Date(),
      },
      {
        id: "demo-ketua",
        username: "ketua",
        passwordHash:
          "$2b$10$.IebtAfg7AqDtMOrlBZ2MewBNQDlwnesR95J9tCxlXjzdFjcnYQqO",
        role: "KETUA",
        otp: null,
        otpExpiry: null,
        createdAt: new Date(),
      },
    ]

    return demoUsers.find((user) => user.username === username) ?? null
  }

  const [user] = await withDbRetry((db) => {
    return db.select().from(users).where(eq(users.username, username)).limit(1)
  })

  return user ?? null
}
