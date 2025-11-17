export class SuccesResDTO {
  statusCode: number;
  data: any;
  constructor(partial: Partial<SuccesResDTO>) {
    Object.assign(this, partial);
  }
}
