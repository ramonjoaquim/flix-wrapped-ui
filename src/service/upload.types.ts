export interface FlixWrappedResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }
  
  export interface HistoryUploadResponse {
    id: string;
    userId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
  