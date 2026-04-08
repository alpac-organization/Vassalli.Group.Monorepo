export type DrawerProps = {
   isOpen: boolean;
   onClose: () => void;
   title?: string;
   children: React.ReactNode;
   description?: string;
   position?: 'right' | 'left';
};