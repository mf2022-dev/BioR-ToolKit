// =============================================================================
// BioR Platform - Authentication Data Module (DEPRECATED)
// =============================================================================
// This module is DEPRECATED. Authentication is handled server-side via
// the D1 database with PBKDF2-SHA256 hashed passwords and JWT tokens.
//
// DO NOT store plaintext passwords in source code.
// All authentication flows through /api/auth/login → src/routes/api.ts
// =============================================================================

// This file is intentionally empty. Kept for import compatibility only.
// If any code imports from this module, migrate it to use the API-based auth.

export {};
