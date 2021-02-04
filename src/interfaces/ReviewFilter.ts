export interface ReviewFilter {
    //filter: filter by either date or by score
    filter: string,
    //sort: sort in ascending or descending order (ASC or DESC)
    sort: string,
    //skip: skip to the corresponding page in the DB
    skip: number,
    //take: take only x entries from that page
    take: number
}