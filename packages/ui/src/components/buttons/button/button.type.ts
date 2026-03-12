export type ButtonSize = "Gian"  | "Medium" | "Small"
export type Company    = 'ALPAC' | 'AMINSA' | 'AVASA' | 'VIGEMSA' | 'TMN';

export interface ButtonClassicProps {
    readonly label : string;

    readonly size    ?:  ButtonSize;
    readonly company ?:  Company;
    readonly disabled?:  boolean;
    readonly isDynamic?: boolean;
    readonly onPress?:   () => void;
}