import { Outlet, createRootRoute, useMatches } from "@tanstack/react-router";

import Header from "../components/Header";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const matches = useMatches()
  const currentRoute = matches[matches.length - 1]?.routeId
  
  const routesWithoutHeader = ['/login', '/register', '/reset-password']
  const shouldShowHeader = !routesWithoutHeader.includes(currentRoute || '')

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="h-screen flex flex-col bg-background overflow-hidden">
          {shouldShowHeader && <Header />}
          <main className={`flex-1 overflow-hidden ${shouldShowHeader ? '' : 'h-full'}`}>
            <Outlet />
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}
