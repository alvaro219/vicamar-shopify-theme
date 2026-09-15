import { test, expect } from '@playwright/test';

test.describe('Idioma', () => {
  test('el selector ofrece exactamente castellano e inglés', async ({ page }) => {
    await page.goto('/');
    const valores = await page
      .locator('select[name="language_code"]')
      .first()
      .locator('option')
      .evaluateAll(opciones => opciones.map(o => (o as HTMLOptionElement).value));
    expect(valores.sort()).toEqual(['en', 'es']);
  });

  test('la versión inglesa se sirve bajo /en con los textos del tema en inglés', async ({ page }) => {
    await page.goto('/en/products/juego-sabanas-percal-200-hilos');
    await expect(page.locator('html')).toHaveAttribute('lang', /^en/);
    await expect(page.locator('[data-testid="standalone-add-to-cart"]')).toContainText('Add to cart');
  });

  test('el castellano usa "Añadir al carrito", no el "Agregar" latinoamericano', async ({ page }) => {
    await page.goto('/products/juego-sabanas-percal-200-hilos');
    await expect(page.locator('[data-testid="standalone-add-to-cart"]')).toContainText('Añadir al carrito');
  });
});
