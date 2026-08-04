const AUTH_STORAGE_KEY = 'cargosphere.auth';

const SUPPORTED_ROLES = new Set([
  'ROLE_ADMIN',
  'ROLE_CLIENT',
]);

function createAuthSession(loginResponse) {
  const expiresInSeconds = Number(loginResponse.expiresIn) || 0;

  return {
    token: loginResponse.accessToken,
    tokenType: loginResponse.tokenType || 'Bearer',
    expiresAt:
      expiresInSeconds > 0
        ? Date.now() + expiresInSeconds * 1000
        : null,
    user: {
      id: loginResponse.id,
      fullName: loginResponse.fullName,
      email: loginResponse.email,
      role: loginResponse.role,
      status: loginResponse.status,
    },
  };
}

function isValidAuthSession(session) {
  return Boolean(
    session &&
      session.token &&
      session.user &&
      SUPPORTED_ROLES.has(session.user.role),
  );
}

function saveAuthSession(loginResponse) {
  const session = createAuthSession(loginResponse);

  if (!isValidAuthSession(session)) {
    throw new Error('The login response does not contain valid authentication data.');
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(session),
  );

  return session;
}

function getAuthSession() {
  const storedValue = window.localStorage.getItem(
    AUTH_STORAGE_KEY,
  );

  if (!storedValue) {
    return null;
  }

  try {
    const session = JSON.parse(storedValue);

    if (!isValidAuthSession(session)) {
      clearAuthSession();
      return null;
    }

    if (
      session.expiresAt &&
      Date.now() >= session.expiresAt
    ) {
      clearAuthSession();
      return null;
    }

    return session;
  } catch {
    clearAuthSession();
    return null;
  }
}

function clearAuthSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function getAuthorizationHeader() {
  const session = getAuthSession();

  if (!session) {
    return null;
  }

  return `${session.tokenType} ${session.token}`;
}

export {
  AUTH_STORAGE_KEY,
  SUPPORTED_ROLES,
  clearAuthSession,
  getAuthSession,
  getAuthorizationHeader,
  saveAuthSession,
};
