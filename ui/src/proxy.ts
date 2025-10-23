import { NextResponse } from "next/server"

export function proxy(_request: Request) {
  return NextResponse.next()
}

// If you need to scope which paths run through the proxy, uncomment and adjust:
// export const config = {
//   matcher: ["/home", "/app/:path*"],
// }


