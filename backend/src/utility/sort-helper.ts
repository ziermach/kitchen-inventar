import { SortOrder } from "mongoose";

export const getMogoseSortConfig =
    (orderBy: string[], direction: SortOrder): [string, SortOrder][] =>
        orderBy.map(key => ([key, direction]));