const { validateCredentials } = require('@/lib/users');

describe('validateCredentials', () => {
  it('returns user data (without password) for valid credentials', () => {
    const user = validateCredentials('demo@travel.com', 'password123');
    expect(user).not.toBeNull();
    expect(user.email).toBe('demo@travel.com');
    expect(user.name).toBe('Alex Johnson');
    expect(user.password).toBeUndefined();
  });

  it('returns null for an unknown email', () => {
    expect(validateCredentials('unknown@example.com', 'password123')).toBeNull();
  });

  it('returns null for a wrong password', () => {
    expect(validateCredentials('demo@travel.com', 'wrongpassword')).toBeNull();
  });

  it('returns null when both email and password are wrong', () => {
    expect(validateCredentials('nobody@example.com', 'nope')).toBeNull();
  });

  it('returns the second demo user for valid credentials', () => {
    const user = validateCredentials('agent@wanderlust.com', 'wanderlust2024');
    expect(user).not.toBeNull();
    expect(user.name).toBe('Maria Garcia');
  });
});
