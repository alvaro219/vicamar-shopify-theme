import { test, expect } from '@playwright/test';
import { sinErroresLiquid } from './utilidades';

test.describe('Portada', () => {
  test('carga en castellano, con un único h1 y sus secciones', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', /^es/);
    // La cabecera ya pinta el nombre de la tienda como h1 en la portada: un
    // segundo h1 perjudicaría el SEO y la navegación con lector de pantalla.
    await expect(page.locator('h1')).toHaveCount(1);

    await expect(page.getByRole('heading', { name: 'Compra por categoría' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Más Vendidos/i })).toBeAttached();
    await expect(page.getByRole('heading', { name: /Novedades/i })).toBeAttached();

    await sinErroresLiquid(page);
  });

  test('la barra de anuncios lleva los tres mensajes', async ({ page }) => {
    await page.goto('/');
    // Los anuncios rotan, así que no todos están visibles a la vez.
    const cabecera = page.locator('header, .header-section, [id*="header"]').first();
    for (const mensaje of ['Envío gratis desde', 'Devoluciones en 14 días', 'Paga con tarjeta o Bizum']) {
      await expect(page.locator('body')).toContainText(mensaje);
    }
    await expect(cabecera).toBeAttached();
  });

  test('el pie muestra las columnas Información y Legal', async ({ page }) => {
    await page.goto('/');
    const pie = page.locator('footer').last();
    await expect(pie).toContainText('Información');
    await expect(pie).toContainText('Legal');
  });
});
