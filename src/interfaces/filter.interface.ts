export enum FilterType {
    'WHERE', 'ORDERBY'
}

export enum FilterCompare {
    "EQUAL", "DIFFERENT", "IS", "ISNOT", "LIKE"
}

export interface OtherFilters {
    name: string,
    value: string,
    type: FilterType
    compare: FilterCompare
}

export interface Filter {
    id?: string,
    other?: OtherFilters[]
}