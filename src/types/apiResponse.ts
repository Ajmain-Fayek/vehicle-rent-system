export interface TApiResponse {
  success: boolean;
  message: string;
}

export interface TApiResponseWithPayload<T> extends TApiResponse {
  data: T;
}
