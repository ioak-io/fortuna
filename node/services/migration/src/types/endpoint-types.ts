export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RealmParams {
  realm: string;
}
