export interface DeleteProductModalMetric {
   label:      string;
   value:      string;
   highlight?: boolean;
}

export interface DeleteProductModalData {
   productId:      string;
   code:           string;
   name:           string;
   description:    string | null;
   categoryName:   string;
   costCenterName: string;
   metrics:        DeleteProductModalMetric[];
   warning?:       { title: string; message: string };
}

export interface DeleteProductModalProps {
   isOpen:               boolean;
   onClose:              () => void;
   data:                 DeleteProductModalData | null;
   handleRequestSuccess: (message: string) => void;
   handleRequestError:   (message: string) => void;
}