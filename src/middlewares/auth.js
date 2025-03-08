import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret-key";

export function auth(req) {
  // Extract token from cookies
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Define protected and auth routes
  const protectedRoutes = ["/todo"]; // Add more routes as needed (e.g., "/dashboard")
  const authRoutes = ["/login", "/register"];

  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  try {
    if (token) {
      // Verify token
      jwt.verify(token, JWT_SECRET);

      // If user is authenticated and trying to access auth routes, redirect to /todo
      if (authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/todo", req.url));
      }

      // Allow request to proceed for authenticated users
      return NextResponse.next();
    } else {
      // No token: redirect unauthenticated users from protected routes to /login
      if (protectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Allow request to proceed for public routes
      return NextResponse.next();
    }
  } catch (error) {
    // Log error for debugging (optional, remove in production if not needed)
    console.error("Token verification failed:", error.message);

    // Invalid token: treat as unauthenticated, redirect from protected routes
    if (protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Allow request to proceed for public routes
    return NextResponse.next();
  }
}

export const authenticate = async (request) => {
  const token = request.cookies.get("token")?.value; // Read from cookie instead of header
  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
};

export const config = {
  matcher: ["/login", "/register", "/todo"],
};
