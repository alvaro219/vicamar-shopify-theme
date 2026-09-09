/*
 * Genera un CSV de productos de PRUEBA para importar en la tienda de desarrollo.
 *
 * ATENCION: esto NO es el catalogo real de Vicamar. Son datos inventados para
 * poder construir y probar la navegacion, el listado de coleccion y la ficha de
 * producto con variantes reales. Los precios son orientativos de mercado, no los
 * del cliente. Antes del lanzamiento hay que borrar estos productos y cargar el
 * catalogo real.
 *
 * El "Type" de cada producto y sus etiquetas estan elegidos para que coincidan
 * con las condiciones de las colecciones automaticas descritas en
 * docs/navegacion-y-colecciones.md. Si cambias la taxonomia alli, cambiala aqui.
 *
 * Dos categorias del menu se quedan A PROPOSITO sin productos, porque el cliente
 * todavia no tiene genero de ellas: "Juegos de Cama > Invierno" (etiqueta
 * "invierno") y "Edredones" (tipo "Edredones").
 *
 * Uso:  node dev/generar-catalogo-prueba.js
 * Salida: dev/catalogo-prueba.csv
 * Importar en: Shopify Admin -> Productos -> Importar.
 */
const fs = require('fs');
const path = require('path');

// Tamaños de cama habituales en España, por ancho de colchon.
const CAMAS = ['90 cm', '105 cm', '135 cm', '150 cm', '180 cm'];
const FUNDAS_ALMOHADA = ['70 cm', '90 cm', '135 cm'];
const TOALLAS = ['Tocador', 'Lavabo', 'Ducha', 'Baño'];

// Sobreprecio de cada medida respecto a la mas pequeña.
const INC_CAMA = { '90 cm': 0, '105 cm': 4, '135 cm': 10, '150 cm': 14, '180 cm': 20 };
const INC_ALMOHADA = { '70 cm': 0, '90 cm': 3, '135 cm': 7 };
const INC_TOALLA = { Tocador: 0, Lavabo: 3, Ducha: 8, 'Baño': 14 };

// Segundas opciones que justifican un pequeño sobreprecio.
const RECARGO = /300 hilos|Firme|egipcio|impermeable/i;

const PRODUCTOS = [
  {
    handle: 'juego-sabanas-percal-200-hilos',
    titulo: 'Juego de sábanas percal 200 hilos',
    tipo: 'Juegos de cama',
    etiquetas: 'primavera-verano, percal, algodón',
    descripcion:
      '<p>Juego de sábanas de percal de algodón 100 % con densidad de 200 hilos. Incluye sábana bajera ajustable, sábana encimera y funda o fundas de almohada.</p>' +
      '<p>Tacto fresco y transpirable, pensado para primavera y verano. Apto para lavadora a 60 °C.</p>',
    opciones: [['Tamaño', CAMAS], ['Color', ['Blanco', 'Gris perla', 'Azul empolvado']]],
    incrementos: INC_CAMA,
    precioBase: 39.95,
    gramosBase: 1200,
  },
  {
    handle: 'juego-sabanas-algodon-egipcio-300-hilos',
    titulo: 'Juego de sábanas algodón egipcio 300 hilos',
    tipo: 'Juegos de cama',
    etiquetas: 'primavera-verano, algodón egipcio, premium',
    descripcion:
      '<p>Juego de sábanas de algodón egipcio de fibra larga con densidad de 300 hilos y acabado satinado.</p>' +
      '<p>Suavidad y caída superiores, con mayor durabilidad lavado tras lavado. Incluye bajera ajustable, encimera y fundas de almohada.</p>',
    opciones: [['Tamaño', CAMAS], ['Color', ['Blanco', 'Arena', 'Verde salvia']]],
    incrementos: INC_CAMA,
    precioBase: 69.95,
    gramosBase: 1400,
  },
  {
    handle: 'sabana-bajera-ajustable-algodon',
    titulo: 'Sábana bajera ajustable de algodón',
    tipo: 'Sábanas bajeras',
    etiquetas: 'bajera, algodón, ajustable',
    descripcion:
      '<p>Sábana bajera de algodón 100 % con goma perimetral. Se adapta a colchones de hasta 30 cm de alto.</p>' +
      '<p>Se vende suelta, para reponer o combinar con cualquier juego de cama.</p>',
    opciones: [['Tamaño', CAMAS], ['Color', ['Blanco', 'Gris perla', 'Arena', 'Azul empolvado']]],
    incrementos: INC_CAMA,
    precioBase: 17.95,
    gramosBase: 600,
  },
  {
    handle: 'funda-almohada-percal-pack-2',
    titulo: 'Fundas de almohada percal (pack de 2)',
    tipo: 'Fundas de almohada',
    etiquetas: 'funda de almohada, percal, pack',
    descripcion:
      '<p>Pack de dos fundas de almohada de percal de algodón con cierre de solapa interior.</p>' +
      '<p>La medida corresponde al largo de la almohada. Comprueba la de la tuya antes de elegir.</p>',
    opciones: [['Tamaño', FUNDAS_ALMOHADA], ['Color', ['Blanco', 'Gris perla', 'Arena']]],
    incrementos: INC_ALMOHADA,
    precioBase: 12.95,
    gramosBase: 300,
  },
  {
    handle: 'protector-colchon-impermeable',
    titulo: 'Protector de colchón impermeable',
    tipo: 'Protectores de colchón',
    etiquetas: 'protector, impermeable, transpirable',
    descripcion:
      '<p>Protector de colchón de rizo de algodón con lámina de poliuretano impermeable y transpirable.</p>' +
      '<p>Ajustable con falda elástica hasta 30 cm de alto. No modifica el tacto del colchón.</p>',
    opciones: [['Tamaño', CAMAS]],
    incrementos: INC_CAMA,
    precioBase: 24.95,
    gramosBase: 800,
  },
  {
    handle: 'funda-colchon-elastica',
    titulo: 'Funda de colchón elástica',
    tipo: 'Protectores de colchón',
    etiquetas: 'funda de colchón, elástica',
    descripcion:
      '<p>Funda de colchón de tejido elástico que envuelve el colchón por completo y se cierra con cremallera.</p>' +
      '<p>Protege de polvo y ácaros sin restar transpirabilidad.</p>',
    opciones: [['Tamaño', CAMAS]],
    incrementos: INC_CAMA,
    precioBase: 29.95,
    gramosBase: 900,
  },
  {
    handle: 'colcha-bouti-reversible',
    titulo: 'Colcha bouti reversible',
    tipo: 'Colchas',
    etiquetas: 'colcha, bouti, reversible',
    descripcion:
      '<p>Colcha bouti acolchada y reversible, con dos caras lisas a juego y relleno ligero de fibra.</p>' +
      '<p>Sirve como colcha de entretiempo o como capa extra sobre el nórdico en invierno.</p>',
    opciones: [['Tamaño', CAMAS], ['Color', ['Gris perla', 'Arena', 'Verde salvia']]],
    incrementos: INC_CAMA,
    precioBase: 54.95,
    gramosBase: 2000,
  },
  {
    handle: 'toalla-algodon-peinado-500',
    titulo: 'Toalla de algodón peinado 500 g',
    tipo: 'Toallas',
    etiquetas: 'toalla, algodón peinado, baño',
    descripcion:
      '<p>Toalla de algodón peinado de 500 g/m², de rizo denso y alta absorción.</p>' +
      '<p>Mantiene el color y la esponjosidad lavado tras lavado. Disponible en cuatro medidas.</p>',
    opciones: [['Medida', TOALLAS], ['Color', ['Blanco', 'Gris perla', 'Arena', 'Verde salvia']]],
    incrementos: INC_TOALLA,
    precioBase: 6.95,
    gramosBase: 200,
  },
];

const COLUMNAS = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value', 'Option3 Name', 'Option3 Value',
  'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Qty',
  'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Price',
  'Variant Requires Shipping', 'Variant Taxable', 'Variant Weight Unit', 'Status',
];

// Escapa un campo segun RFC 4180.
function campo(valor) {
  const s = String(valor == null ? '' : valor);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function combinaciones(listas) {
  return listas.reduce((acc, lista) => acc.flatMap(previo => lista.map(v => [...previo, v])), [[]]);
}

function sku(handle, valores) {
  const base = handle.toUpperCase().split('-').map(p => p.slice(0, 3)).join('');
  const cola = valores
    .map(v => v.replace(/[^0-9A-Za-zÁÉÍÓÚÑáéíóúñ]/g, '').slice(0, 4).toUpperCase())
    .join('-');
  return base + '-' + cola;
}

const filas = [COLUMNAS];
const resumen = [];

for (const p of PRODUCTOS) {
  const nombresOpcion = p.opciones.map(o => o[0]);
  const combos = combinaciones(p.opciones.map(o => o[1]));

  combos.forEach((valores, i) => {
    const primera = i === 0;
    const incremento = p.incrementos[valores[0]] || 0;
    const extra = valores.length > 1 && RECARGO.test(valores[1]) ? 5 : 0;
    const precio = (p.precioBase + incremento + extra).toFixed(2);

    filas.push([
      p.handle,
      primera ? p.titulo : '',
      primera ? p.descripcion : '',
      primera ? 'Vicamar' : '',
      primera ? p.tipo : '',
      primera ? p.etiquetas : '',
      primera ? 'TRUE' : '',
      nombresOpcion[0] || '', valores[0] || '',
      nombresOpcion[1] || '', valores[1] || '',
      nombresOpcion[2] || '', valores[2] || '',
      sku(p.handle, valores),
      p.gramosBase + incremento * 20,
      'shopify',
      50,
      'deny',
      'manual',
      precio,
      'TRUE',
      'TRUE',
      'g',
      primera ? 'active' : '',
    ]);
  });

  resumen.push({ titulo: p.titulo, tipo: p.tipo, variantes: combos.length, opciones: nombresOpcion });
}

const csv = filas.map(f => f.map(campo).join(',')).join('\r\n') + '\r\n';
fs.writeFileSync(path.join(__dirname, 'catalogo-prueba.csv'), csv, 'utf8');

const totalVariantes = resumen.reduce((s, r) => s + r.variantes, 0);
console.log('Generado dev/catalogo-prueba.csv');
console.log(PRODUCTOS.length + ' productos, ' + totalVariantes + ' variantes, ' + filas.length + ' filas (con cabecera).\n');

const porTipo = {};
for (const r of resumen) porTipo[r.tipo] = (porTipo[r.tipo] || 0) + 1;
console.log('Por tipo de producto (condicion de las colecciones automaticas):');
for (const [tipo, n] of Object.entries(porTipo)) console.log('  ' + String(n).padStart(2) + '  ' + tipo);
console.log('   0  Edredones            <- a proposito sin genero');
console.log('   0  etiqueta "invierno"  <- a proposito sin genero');
