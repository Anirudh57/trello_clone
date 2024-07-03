import { Card, List } from "@prisma/client";

 export type ListWithCards = List & { Cards: Card[] };

 export type CardWithList = Card & { list: List };




