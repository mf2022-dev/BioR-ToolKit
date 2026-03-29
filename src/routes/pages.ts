// =============================================================================
// BioR Platform - Page Route Handlers
// =============================================================================
// Serves HTML pages: login and the SPA shell.
// Templates are imported from the templates module.
// =============================================================================

import { Hono } from 'hono';
import { getLoginHTML } from '../templates/login';
import { getSPAHTML } from '../templates/spa/shell';

const pages = new Hono();

// Standalone login page (served by Hono worker)
pages.get('/login', (c) => c.html(getLoginHTML()));
pages.get('/login.html', (c) => c.html(getLoginHTML()));

// SPA catch-all (all other routes)
pages.get('*', (c) => c.html(getSPAHTML()));

export default pages;
