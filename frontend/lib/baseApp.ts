// Base App SDK integration
export function isBaseApp() {
  // Check if running inside Base app
  return typeof window !== 'undefined' && 
    (window as any).ethereum?.isBase || 
    (window as any).baseApp !== undefined
}

export function getBaseAppProvider() {
  if (typeof window === 'undefined') return null
  
  // Base app injects its own provider
  return (window as any).ethereum || (window as any).baseApp?.ethereum
}