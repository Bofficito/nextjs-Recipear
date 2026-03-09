import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_ID = process.env.ADMIN_ID!;

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPublic =
    pathname === "/" || isAuthRoute || pathname.startsWith("/r/");
  const isBackoffice = pathname.startsWith("/backoffice");
  const isApiImport = pathname.startsWith("/api/import-recipe");

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/recetario", request.url));
  }

  if (isBackoffice && user?.id !== ADMIN_ID) {
    return NextResponse.redirect(new URL("/recetario", request.url));
  }

  if (isApiImport && !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return response;
}
