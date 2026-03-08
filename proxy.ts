import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define las rutas públicas (accesibles sin login)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  // Si NO es una ruta pública, protégela
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
