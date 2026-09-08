/*
 * Genera un CSV de productos de PRUEBA para importar en la tienda de desarrollo.
 *
 * ATENCION: esto NO es el catalogo real de Vicamar. Son datos inventados para
 * poder construir y probar la ficha de producto y el listado de coleccion con
 * variantes reales (tamaños de cama, colores, materiales). Los precios son
 * orientativos de mercado, no los del cliente. Antes del lanzamiento hay que
 * borrar estos productos y cargar el catalogo real.
 *
 * Uso:  node dev/generar-catalogo-prueba.js
 * Salida: dev/catalogo-prueba.csv
 *
 * Importar en: Shopify Admin -> Productos -> Importar -> subir el CSV.
 */
const fs = require('fs');
const path = require('path');

// Tamaños de cama habituales en España, en centimetros de ancho de colchon.
const CAMAS = ['90 cm', '105 cm', '135 cm', '150 cm', '180 cm'];
const ALMOHADAS = ['70 cm', '90 cm', '135 cm'];

// Sobreprecio por tamaño respecto al de 90 cm.
const INCREMENTO = { '90 cm': 0, '105 cm': 4, '135 cm': 10, '150 cm': 14, '180 cm': 20 };
const INCREMENTO_ALMOHADA = { '70 cm': 0, '90 cm': 4, '135 cm': 9 };

const PRODUCTOS = [
  {
    handle: 'juego-sabanas-percal-200-hilos',
    titulo: 'Juego de sábanas percal 200 hilos',
    tipo: 'Sábanas',
    etiquetas: 'sábanas, percal, algodón, todo el año',
    descripcion:
      '<p>Juego de sábanas de percal de algodón 100 % con densidad de 200 hilos. Incluye sábana bajera ajustable, sábana encimera y funda o fundas de almohada.</p>' +
      '<p>Tacto fresco y transpirable, ideal para todo el año. Apto para lavadora a 60 °C.</p>',
    opciones: [
      ['Tamaño', CAMAS],
      ['Color', ['Blanco', 'Gris perla', 'Azul empolvado']],
    ],
    precioBase: 39.95,
    gramosBase: 1200,
  },
  {
    handle: 'juego-sabanas-algodon-egipcio-300-hilos',
    titulo: 'Juego de sábanas algodón egipcio 300 hilos',
    tipo: 'Sábanas',
    etiquetas: 'sábanas, algodón egipcio, premium',
    descripcion:
      '<p>Juego de sábanas de algodón egipcio de fibra larga con densidad de 300 hilos y acabado satinado.</p>' +
      '<p>Suavidad y caída superiores, con mayor durabilidad lavado tras lavado. Incluye bajera ajustable, encimera y fundas de almohada.</p>',
    opciones: [
      ['Tamaño', CAMAS],
      ['Color', ['Blanco', 'Arena', 'Verde salvia']],
    ],
    precioBase: 69.95,
    gramosBase: 1400,
  },
  {
    handle: 'funda-nordica-algodon-lisa',
    titulo: 'Funda nórdica lisa de algodón',
    tipo: 'Fundas nórdicas',
    etiquetas: 'funda nórdica, algodón, liso',
    descripcion:
      '<p>Funda nórdica de algodón 100 % con cierre de botones ocultos y cintas interiores para sujetar el relleno.</p>' +
      '<p>Se vende sin relleno nórdico. Consulta la guía de tamaños para elegir la medida correcta según tu cama.</p>',
    opciones: [
      ['Tamaño', CAMAS],
      ['Color', ['Blanco', 'Gris perla', 'Arena', 'Azul empolvado']],
    ],
    precioBase: 44.95,
    gramosBase: 1100,
  },
  {
    handle: 'funda-nordica-estampada-hojas',
    titulo: 'Funda nórdica estampada Hojas',
    tipo: 'Fundas nórdicas',
    etiquetas: 'funda nórdica, estampado, algodón',
    descripcion:
      '<p>Funda nórdica de algodón con estampado botánico reversible: cara estampada y cara lisa a juego.</p>' +
      '<p>Incluye funda o fundas de cojín a juego. Se vende sin relleno nórdico.</p>',
    opciones: [
      ['Tamaño', CAMAS],
      ['Color', ['Verde salvia', 'Terracota']],
    ],
    precioBase: 54.95,
    gramosBase: 1150,
  },
  {
    handle: 'relleno-nordico-fibra',
    titulo: 'Relleno nórdico de fibra hueca',
    tipo: 'Rellenos',
    etiquetas: 'relleno nórdico, fibra, invierno',
    descripcion:
      '<p>Relleno nórdico de fibra hueca siliconada con acabado antialérgico. Ligero, cálido y fácil de lavar.</p>' +
      '<p>Elige el gramaje según la temperatura de tu dormitorio: 250 g para entretiempo y 400 g para invierno.</p>',
    opciones: [
      ['Tamaño', CAMAS],
      ['Gramaje', ['250 g/m²', '400 g/m²']],
    ],
    precioBase: 49.95,
    gramosBase: 1800,
  },
  {
    handle: 'almohada-viscoelastica',
    titulo: 'Almohada viscoelástica',
    tipo: 'Almohadas',
    etiquetas: 'almohada, viscoelástica, cervical',
    descripcion:
      '<p>Almohada de viscoelástica de alta densidad que se adapta a la forma del cuello y reparte la presión.</p>' +
      '<p>Funda exterior desenfundable y lavable a máquina.</p>',
    opciones: [
      ['Tamaño', ALMOHADAS],
      ['Firmeza', ['Media', 'Firme']],
    ],
    precioBase: 34.95,
    gramosBase: 900,
    almohada: true,
  },
  {
    handle: 'almohada-fibra-transpirable',
    titulo: 'Almohada de fibra transpirable',
    tipo: 'Almohadas',
    etiquetas: 'almohada, fibra, transpirable',
    descripcion:
      '<p>Almohada de fibra hueca con canales de ventilación, de firmeza media-baja.</p>' +
      '<p>Lavable a máquina a 30 °C. Recuperación rápida de la forma.</p>',
    opciones: [['Tamaño', ALMOHADAS]],
    precioBase: 19.95,
    gramosBase: 700,
    almohada: true,
  },
  {
    handle: 'protector-colchon-impermeable',
    titulo: 'Protector de colchón impermeable',
    tipo: 'Protectores',
    etiquetas: 'protector, impermeable, transpirable',
    descripcion:
      '<p>Protector de colchón de rizo de algodón con lámina de poliuretano impermeable y transpirable.</p>' +
      '<p>Ajustable con falda elástica hasta 30 cm de alto. No modifica el tacto del colchón.</p>',
    opciones: [['Tamaño', CAMAS]],
    precioBase: 24.95,
    gramosBase: 800,
  },
];

const COLUMNAS = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value', 'Option3 Name', 'Option3 Value',
  'Variant SKU', 'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Qty',
  'Variant Inventory Policy', 'Variant Fulfillment Service', 'Variant Price',
  'Variant Requires Shipping', 'Variant Taxable', 'Variant Weight Unit', 'Status',
];

// Escapa un campo segun RFC 4180: comillas dobles duplicadas y entrecomillado
// si contiene coma, comilla o salto de linea.
function campo(valor) {
  const s = String(valor == null ? '' : valor);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

// Producto cartesiano de las listas de valores de opcion.
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
let totalVariantes = 0;

for (const p of PRODUCTOS) {
  const nombresOpcion = p.opciones.map(o => o[0]);
  const combos = combinaciones(p.opciones.map(o => o[1]));
  const tabla = p.almohada ? INCREMENTO_ALMOHADA : INCREMENTO;

  combos.forEach((valores, i) => {
    const primera = i === 0;
    const tamaño = valores[0];
    const incremento = tabla[tamaño] || 0;
    // La segunda opcion (material, gramaje, firmeza) tambien encarece un poco.
    const extra = valores.length > 1 && /300 hilos|400 g|Firme|egipcio/.test(valores[1]) ? 5 : 0;
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
    totalVariantes++;
  });
}

const csv = filas.map(f => f.map(campo).join(',')).join('\r\n') + '\r\n';
const destino = path.join(__dirname, 'catalogo-prueba.csv');
fs.writeFileSync(destino, csv, 'utf8');

console.log('Generado ' + destino);
console.log(PRODUCTOS.length + ' productos, ' + totalVariantes + ' variantes, ' + filas.length + ' filas (con cabecera).');
for (const p of PRODUCTOS) {
  const n = combinaciones(p.opciones.map(o => o[1])).length;
  console.log('  ' + String(n).padStart(3) + ' variantes  ' + p.titulo + '  [' + p.opciones.map(o => o[0]).join(' x ') + ']');
}
