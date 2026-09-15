import { chromium } from '@playwright/test';
import fs from 'node:fs';
import { BASE_URL, ES_TIENDA_REMOTA, ESTADO_SESION } from './playwright.config';

/*
 * Solo actua contra la tienda remota. Contra `shopify theme dev` no hace falta:
 * el servidor local ya esta autenticado y sirve el tema de trabajo.
 *
 * Contra la dev store hay que resolver dos cosas antes de cualquier test:
 *   1. La tienda esta protegida por contraseña.
 *   2. Hay que previsualizar el tema de staging, que no es el publicado.
 *      `pb=0` oculta la barra de previsualizacion de Shopify, que en movil
 *      tapa la parte inferior de la pantalla e intercepta los toques.
 * Ambas cosas se guardan en cookies, que se reutilizan en todos los tests.
 */
export default async function globalSetup() {
  if (!ES_TIENDA_REMOTA) return;

  const password = process.env.STORE_PASSWORD;
  const themeId = process.env.PREVIEW_THEME_ID;
  if (!password) {
    throw new Error('Falta STORE_PASSWORD: la dev store está protegida por contraseña.');
  }
  if (!themeId) {
    throw new Error('Falta PREVIEW_THEME_ID: sin él se probaría el tema publicado, no el de staging.');
  }

  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({ baseURL: BASE_URL });

  await pagina.goto('/password');
  await pagina.locator('#password').fill(password);
  await Promise.all([
    pagina.waitForURL(url => !url.pathname.startsWith('/password'), { timeout: 30_000 }),
    pagina.locator('form[action="/password"] [type="submit"]').click(),
  ]);

  await pagina.goto(`/?preview_theme_id=${themeId}&pb=0`);

  fs.mkdirSync('.auth', { recursive: true });
  await pagina.context().storageState({ path: ESTADO_SESION });
  await navegador.close();
}
