export class PaginationDto {
  page: number = 1;
  limit: number = 10;
  offset?: number;

  constructor(page?: number, limit?: number) {
    this.page = page || 1;
    this.limit = limit || 10;
    this.offset = (this.page - 1) * this.limit;
  }
}
