import { defineConfig, devices } from '@playwright/test';

/*
 * Tests E2E del tema Vicamar.
 *
 * Dos formas de ejecutarlos:
 *
 *   - En local, contra `shopify theme dev` (por defecto, http://127.0.0.1:9292).
 *     El servidor de desarrollo ya se ha autenticado con la contraseña de la
 *     tienda, asi que no hace falta nada mas.
 *
 *   - En CI, contra el tema de staging publicado en la dev store:
 *       BASE_URL=https://vicamar-dev-0x2ai1pz.myshopify.com
 *       PREVIEW_THEME_ID=<id del tema de staging>
 *       STORE_PASSWORD=<contraseña de la tienda>
 *     global-setup.ts entra por la pagina de contraseña, fija el tema de
 *     previsualizacion y guarda la sesion para todos los tests.
 *
 * El proyecto movil va primero a proposito: la mayoria del trafico de la
 * tienda llegara desde movil.
 */

export const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:9292';
export const ES_TIENDA_REMOTA = !/127\.0\.0\.1|localhost/.test(BASE_URL);
export const ESTADO_SESION = '.auth/estado.json';

export default defineConfig({
  testDir: './tests',
  // El servidor de theme dev es lento y comparte proceso: en local, de uno en uno.
  workers: process.env.CI ? 2 : 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  globalSetup: './global-setup.ts',
  use: {
    baseURL: BASE_URL,
    locale: 'es-ES',
    storageState: ES_TIENDA_REMOTA ? ESTADO_SESION : undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'movil', use: { ...devices['Pixel 7'] } },
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
  ],
});
