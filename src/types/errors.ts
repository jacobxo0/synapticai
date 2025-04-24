export interface ApiError {
  name: string;
  message: string;
  status?: number;
  code?: string;
}

export interface ValidationError extends ApiError {
  field: string;
  value: any;
}

export interface AuthError extends ApiError {
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'INVALID_TOKEN';
}

export interface ResourceError extends ApiError {
  resourceId: string;
  resourceType: string;
} 