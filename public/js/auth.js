/**
 * BioR Platform - Authentication Module
 * Validates credentials and returns user profile data.
 * This file is loaded by login.html as an external script.
 */

(function() {
  'use strict';

  // Demo user accounts
  var accounts = {
    admin: {
      password: 'BioR2026!',
      id: 'usr-001',
      username: 'admin',
      name: 'Dr. Ahmed Al-Rashidi',
      role: 'Admin',
      fullRole: 'National Epidemiologist',
      institution: 'BioR National Operations Center',
      tier: 4,
      avatar: 'AR',
      token: 'eyJhbGciOiJIUzI1NiJ9.bior-usr-001'
    },
    analyst: {
      password: 'Analyst2026!',
      id: 'usr-002',
      username: 'analyst',
      name: 'Dr. Fatima Hassan',
      role: 'Analyst',
      fullRole: 'Regional Epidemiologist',
      institution: 'Central Region Health Directorate',
      tier: 3,
      avatar: 'FH',
      token: 'eyJhbGciOiJIUzI1NiJ9.bior-usr-002'
    },
    viewer: {
      password: 'Viewer2026!',
      id: 'usr-003',
      username: 'viewer',
      name: 'Dr. Khalid Mansoor',
      role: 'Viewer',
      fullRole: 'Senior Bioinformatician',
      institution: 'National Reference Laboratory',
      tier: 2,
      avatar: 'KM',
      token: 'eyJhbGciOiJIUzI1NiJ9.bior-usr-003'
    }
  };

  /**
   * Validates username and password against known accounts.
   * @param {string} username - The username to validate.
   * @param {string} password - The password to validate.
   * @returns {Object|null} User profile object on success, or null on failure.
   */
  function validateCredentials(username, password) {
    if (!username || !password) return null;

    var account = accounts[username.toLowerCase()];
    if (!account) return null;
    if (account.password !== password) return null;

    // Return user profile (without password)
    return {
      id: account.id,
      username: account.username,
      name: account.name,
      role: account.role,
      fullRole: account.fullRole,
      institution: account.institution,
      tier: account.tier,
      avatar: account.avatar,
      token: account.token
    };
  }

  // Expose to global scope for login.html
  window.validateCredentials = validateCredentials;

})();
