import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Vérifier immédiatement
    checkMobile()

    // Ajouter les écouteurs d'événements
    window.addEventListener("resize", checkMobile)
    window.addEventListener("orientationchange", checkMobile)

    // Nettoyer les écouteurs
    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("orientationchange", checkMobile)
    }
  }, [])

  return isMobile
}
