export type CardType = "national" | "student";
export type CardSide = "front" | "back";

export interface CardImage {
  url: string;
  file: File | null;
}

export interface CardImagesList {
  national: {
    front: CardImage | null;
    back: CardImage | null;
  };
  student: {
    front: CardImage | null;
    back: CardImage | null;
  };
}
