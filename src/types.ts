
export interface Wish {
  id: string;
  text: string;
}

export interface Participant {
  id: string;
  name: string;
  wishes: Wish[];
}