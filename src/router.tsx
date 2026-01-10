import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Loading spinner for SPA shell
function DefaultPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="animate-spin w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full" />
    </div>
  )
}

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: DefaultPending,
  })

  return router
}
