type ApiErrors = {
  NOT_FOUND: string;
  SERVER_ERROR: string;
};

type ApiEndpoints = {
  HEALTH_CHECK: string;
  USERS: string;
  MOVIES: string;
  GENRES: string;
};

export const apiErrors: ApiErrors = {
  NOT_FOUND: 'Not found',
  SERVER_ERROR: 'Internal Server Error',
};

export const apiEndpoints: ApiEndpoints = {
  HEALTH_CHECK: '/health-check',
  USERS: '/users',
  MOVIES: '/movies',
  GENRES: '/genres',
};
