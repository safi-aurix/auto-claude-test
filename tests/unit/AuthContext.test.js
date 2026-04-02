/**
 * Unit tests for auth credential validation logic (mirrors AuthContext)
 */

describe('AuthContext credential validation', () => {
  const VALID_EMAIL = 'agent@travelco.com';
  const VALID_PASSWORD = 'travel123';

  function validateCredentials({ email, password }) {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  }

  it('returns success with correct credentials', () => {
    const result = validateCredentials({ email: VALID_EMAIL, password: VALID_PASSWORD });
    expect(result.success).toBe(true);
  });

  it('returns failure with wrong password', () => {
    const result = validateCredentials({ email: VALID_EMAIL, password: 'wrong' });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password.');
  });

  it('returns failure with wrong email', () => {
    const result = validateCredentials({ email: 'other@example.com', password: VALID_PASSWORD });
    expect(result.success).toBe(false);
  });

  it('returns failure with empty credentials', () => {
    const result = validateCredentials({ email: '', password: '' });
    expect(result.success).toBe(false);
  });

  it('returns failure with only email provided', () => {
    const result = validateCredentials({ email: VALID_EMAIL, password: '' });
    expect(result.success).toBe(false);
  });
});

describe('statusBadgeClass logic', () => {
  function statusBadgeClass(status) {
    const map = {
      Confirmed: 'badgeConfirmed',
      Pending: 'badgePending',
      Cancelled: 'badgeCancelled',
    };
    return map[status] || '';
  }

  it('returns confirmed class for Confirmed', () => {
    expect(statusBadgeClass('Confirmed')).toBe('badgeConfirmed');
  });

  it('returns pending class for Pending', () => {
    expect(statusBadgeClass('Pending')).toBe('badgePending');
  });

  it('returns cancelled class for Cancelled', () => {
    expect(statusBadgeClass('Cancelled')).toBe('badgeCancelled');
  });

  it('returns empty string for unknown status', () => {
    expect(statusBadgeClass('Unknown')).toBe('');
  });
});
