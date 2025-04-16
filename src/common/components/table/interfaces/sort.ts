export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc'
}

export interface Sort {
    column: string
    direction: SortDirection
}
