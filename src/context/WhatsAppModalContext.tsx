import { createContext, useContext, useState, type ReactNode } from 'react'
import { WhatsAppChooserModal } from '@/components/ui/WhatsAppChooserModal'

interface WhatsAppModalContextValue {
  openWhatsAppChooser: (customMessage?: string) => void
  closeWhatsAppChooser: () => void
}

const WhatsAppModalContext = createContext<WhatsAppModalContextValue | null>(null)

export function WhatsAppModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState<string | undefined>()

  const openWhatsAppChooser = (customMessage?: string) => {
    setMessage(customMessage)
    setIsOpen(true)
  }

  const closeWhatsAppChooser = () => {
    setIsOpen(false)
  }

  return (
    <WhatsAppModalContext.Provider value={{ openWhatsAppChooser, closeWhatsAppChooser }}>
      {children}
      <WhatsAppChooserModal isOpen={isOpen} onClose={closeWhatsAppChooser} customMessage={message} />
    </WhatsAppModalContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWhatsAppModal(): WhatsAppModalContextValue {
  const ctx = useContext(WhatsAppModalContext)
  if (!ctx) {
    throw new Error('useWhatsAppModal must be used within WhatsAppModalProvider')
  }
  return ctx
}
