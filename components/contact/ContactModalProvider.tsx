"use client";

/**
 * Global contact-modal state. Any trigger anywhere on the site can call
 * `useContactModal().open(category?)` to slide up the glassy contact popup.
 * The provider locks the page scroll while the modal is open (via the smooth-
 * scroll lock count) and renders the single <ContactModal /> instance.
 */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import ContactModal from "./ContactModal";

type ContactModalCtx = {
  isOpen: boolean;
  /** Active inquiry category preselected in the form. */
  category?: string;
  open: (category?: string) => void;
  close: () => void;
};

const Context = createContext<ContactModalCtx>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export const useContactModal = () => useContext(Context);

export default function ContactModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const open = useCallback((next?: string) => {
    setCategory(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <Context.Provider value={{ isOpen, category, open, close }}>
      {children}
      <ContactModal isOpen={isOpen} category={category} onClose={close} />
    </Context.Provider>
  );
}
