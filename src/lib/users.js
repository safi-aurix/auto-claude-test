// Demo users for the travel agency app
// In production, this would connect to a real database with hashed passwords
const DEMO_USERS = [
  {
    id: 1,
    email: 'demo@travel.com',
    password: 'password123',
    name: 'Alex Johnson',
    role: 'Travel Consultant',
  },
  {
    id: 2,
    email: 'agent@wanderlust.com',
    password: 'wanderlust2024',
    name: 'Maria Garcia',
    role: 'Senior Agent',
  },
];

/**
 * Validates user credentials and returns the user object (without password) if valid.
 * @param {string} email
 * @param {string} password
 * @returns {{ id: number, email: string, name: string, role: string } | null}
 */
function validateCredentials(email, password) {
  const user = DEMO_USERS.find(
    (u) => u.email === email && u.password === password,
  );
  if (!user) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}

module.exports = { validateCredentials };
