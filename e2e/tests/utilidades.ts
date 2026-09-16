import { expect, type Page } from '@playwright/test';

/** Estado del carrito leído de la Ajax API de Shopify, sin depender del marcado. */
export async function leerCarrito(pagina: Page) {
  return pagina.evaluate(async () => {
    const respuesta = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
    return (await respuesta.json()) as {
      item_count: number;
      items: { variant_id: number; variant_title: string; quantity: number }[];
    };
  });
}

/**
 * Comprueba que la página no muestra errores de Liquid. Shopify los pinta como
 * texto dentro de la propia página en lugar de fallar, así que un error en una
 * sección pasaría desapercibido si no se busca expresamente.
 */
export async function sinErroresLiquid(pagina: Page) {
  await expect(pagina.locator('body')).not.toContainText('Liquid error');
}
