export interface CountryOption {
  value: string;
  label: string;
  flag?: string;
}

type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];
