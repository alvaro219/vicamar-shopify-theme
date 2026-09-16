import { test, expect } from '@playwright/test';
import { ES_TIENDA_REMOTA } from '../playwright.config';
import { leerCarrito, sinErroresLiquid } from './utilidades';

const BOTON_ANADIR = '[data-testid="standalone-add-to-cart"]';

/*
 * Los tests que modifican el carrito o van al checkout solo se ejecutan en
 * local, contra `shopify theme dev`.
 *
 * Contra la tienda real, Shopify protege el carrito y el checkout con una
 * verificacion antibots de Cloudflare ("Verifique que es un ser humano"). Desde
 * los servidores de GitHub Actions el test la dispara y se queda bloqueado: se
 * comprobo en las capturas de la primera ejecucion en CI. No es un fallo del
 * tema, y no debe intentarse sortear.
 *
 * No hace falta vaciar el carrito antes de cada test: Playwright abre cada uno
 * con un contexto de navegador nuevo, y por tanto con el carrito vacio. Hacerlo
 * suponia una llamada extra al carrito que tambien disparaba la proteccion.
 */
const MOTIVO_REMOTO =
  'La tienda real bloquea con verificación antibots el uso automatizado del carrito; se prueba en local contra theme dev.';

test.describe('Ficha de producto y carrito', () => {
  test('elegir 150 cm y Gris perla añade esa variante exacta', async ({ page }) => {
    test.skip(ES_TIENDA_REMOTA, MOTIVO_REMOTO);

    await page.goto('/products/juego-sabanas-percal-200-hilos');
    await sinErroresLiquid(page);

    const idVariante = page.locator('form[action="/cart/add"] input[name="id"]').first();
    const idInicial = await idVariante.inputValue();

    await page.getByRole('radio', { name: '150 cm', exact: true }).check();
    await page.getByRole('radio', { name: 'Gris perla', exact: true }).check();
    // El formulario debe apuntar a otra variante, o se añadiría la de 90 cm.
    await expect(idVariante).not.toHaveValue(idInicial);

    await page.locator(BOTON_ANADIR).click();

    await expect.poll(async () => (await leerCarrito(page)).item_count).toBe(1);
    const { items } = await leerCarrito(page);
    expect(items[0].variant_title).toContain('150 cm');
    expect(items[0].variant_title).toContain('Gris perla');
  });

  test('en la ficha el precio es el de la variante, sin "Desde"', async ({ page }) => {
    await page.goto('/products/colcha-bouti-reversible');
    const precio = page.locator('main .price').first();
    await expect(precio).toBeVisible();
    await expect(precio).not.toContainText('Desde');
  });

  test('desde el carrito se llega al checkout', async ({ page }) => {
    test.skip(ES_TIENDA_REMOTA, MOTIVO_REMOTO);

    await page.goto('/products/sabana-bajera-ajustable-algodon');
    await page.locator(BOTON_ANADIR).click();
    await expect.poll(async () => (await leerCarrito(page)).item_count).toBeGreaterThan(0);

    await page.goto('/cart');
    // Solo se comprueba que el checkout de Shopify carga: completar el pago
    // requiere la pasarela de pruebas.
    await Promise.all([
      page.waitForURL(/\/checkouts?\//, { timeout: 60_000 }),
      page.locator('[name="checkout"]').filter({ visible: true }).first().click(),
    ]);
  });
});
