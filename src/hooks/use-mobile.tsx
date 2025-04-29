
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to update based on window size
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    updateMobileState()

    // Set up media query listener for changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Modern API for event listener
    if (mql.addEventListener) {
      mql.addEventListener("change", updateMobileState)
    } else {
      // Fallback for older browsers
      mql.addListener(updateMobileState)
    }

    // Cleanup function
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", updateMobileState)
      } else {
        mql.removeListener(updateMobileState)
      }
    }
  }, [])

  // Return the current state
  return !!isMobile
}
