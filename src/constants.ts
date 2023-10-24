type ApiErrors = {
  REQUIRED_NANE: string;
  REQUIRED_FIELDS: string;
  NOT_FOUND: string;
  INVALID_DATE: string;
  SERVER_ERROR: string;
};

type ApiEndpoints = {
  HEALTH_CHECK: string;
  MOVIES: string;
  GENRES: string;
};

export const apiErrors: ApiErrors = {
  REQUIRED_NANE: 'Name field is required',
  REQUIRED_FIELDS: 'All fields are required',
  INVALID_DATE: 'Invalid date format',
  NOT_FOUND: 'Not found',
  SERVER_ERROR: 'Internal Server Error',
};

export const apiEndpoints: ApiEndpoints = {
  HEALTH_CHECK: '/health-check',
  MOVIES: '/movies',
  GENRES: '/genres',
};
