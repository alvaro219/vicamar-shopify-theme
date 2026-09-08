/*
 * Verifica el resultado de `shopify theme push --json`.
 *
 * El CLI puede terminar con codigo de salida 0 aunque Shopify haya rechazado
 * ficheros concretos del tema: el detalle solo aparece en el campo theme.errors
 * del JSON. Sin esta comprobacion, un despliegue incompleto pasaria como
 * correcto en GitHub Actions.
 *
 * Uso: node .github/scripts/verificar-push.js <fichero-de-log>
 */
const fs = require('fs');

const logPath = process.argv[2];
if (!logPath) {
  console.error('::error::Falta la ruta del log de push.');
  process.exit(1);
}

const contenido = fs.readFileSync(logPath, 'utf8');

// El CLI mezcla lineas de progreso con el JSON final; nos quedamos con el
// ultimo objeto JSON valido que aparezca en la salida.
const candidatos = contenido
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.startsWith('{') && l.endsWith('}'));

let resultado = null;
for (let i = candidatos.length - 1; i >= 0; i--) {
  try {
    resultado = JSON.parse(candidatos[i]);
    break;
  } catch {
    // Linea no parseable: seguimos buscando hacia atras.
  }
}

if (!resultado) {
  console.error('::error::No se encontro salida JSON del CLI. El push no se pudo verificar.');
  process.exit(1);
}

const tema = resultado.theme || {};
const errores = tema.errors;

if (errores && Object.keys(errores).length > 0) {
  console.error('::error::Shopify rechazo ' + Object.keys(errores).length + ' fichero(s) del tema.');
  for (const [fichero, mensajes] of Object.entries(errores)) {
    console.error('  ' + fichero + ': ' + [].concat(mensajes).join(' | '));
  }
  console.error('\nEl tema remoto ha quedado en un estado incompleto. Revisa los');
  console.error('mensajes de arriba, corrige y vuelve a desplegar.');
  process.exit(1);
}

if (tema.warning) {
  console.error('::error::' + tema.warning);
  process.exit(1);
}

console.log('Despliegue correcto.');
console.log('  Tienda: ' + (tema.shop || 'desconocida'));
console.log('  Tema:   ' + (tema.name || '?') + ' (#' + (tema.id || '?') + ', ' + (tema.role || '?') + ')');
