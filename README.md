# Vicamar — tema Shopify

Tema Liquid para la tienda de textil de hogar Vicamar, construido sobre
**Horizon** (tema oficial gratuito de Shopify, sucesor de Dawn) en Online
Store 2.0.

El repositorio contiene **solo el código del tema**. Los datos de la tienda
(productos, pedidos, clientes) viven en Shopify y no se sincronizan por aquí:
cada tienda mantiene los suyos de forma independiente.

## Idioma

El escaparate es **castellano por defecto**, con inglés como idioma
secundario seleccionable. En `locales/`, el sufijo `.default` marca el idioma
de referencia del tema, y lo lleva el español (`es.default.json`).

Cualquier texto nuevo que se añada al tema debe traducirse en **ambos**
idiomas, redactando primero el castellano.

El tema conserva solo los locales que la tienda va a publicar: `es.default`,
`en` y sus `.schema`. Los otros 53 idiomas que trae Horizon se borraron,
porque obligaban a replicar cada clave nueva en 57 ficheros para que
`theme check` no fallara con `MatchingTranslations`. Si más adelante hiciera
falta otro idioma, sus ficheros siguen en el commit baseline de Horizon.

## Entornos

| Entorno | Tienda | Tema | Rol |
| --- | --- | --- | --- |
| staging | `vicamar-dev-0x2ai1pz.myshopify.com` | `Vicamar - Staging` (#199701234047) | `unpublished` |
| production | pendiente de transferir al cliente | pendiente | — |

En la dev store existe además el tema **Horizon (#199700316543)**, que está
publicado y se deja intacto como referencia limpia del tema base. No se
despliega nada contra él.

Los entornos se definen en [`shopify.theme.toml`](shopify.theme.toml), que es
la única fuente de verdad: ni los workflows ni los comandos del día a día
repiten identificadores de tienda o de tema.

## Desarrollo local

Requiere Node.js 20 o superior y el Shopify CLI:

```bash
npm install --global @shopify/cli
```

Trabajo diario:

```bash
# Vista previa con recarga en caliente. Crea un development theme propio y
# efimero: no escribe ni en el tema de staging ni en el publicado.
shopify theme dev --store vicamar-dev-0x2ai1pz.myshopify.com

# Linter de Liquid. Es lo mismo que ejecuta el CI en cada Pull Request.
shopify theme check

# Subida manual al tema de staging (normalmente lo hace el CI).
shopify theme push --environment staging
```

La dev store está protegida por contraseña, así que `theme dev` la pedirá la
primera vez.

## Ramas, Pull Requests y despliegue

- `staging` → despliega automáticamente al tema de staging de la dev store.
- `main` → desplegará a la tienda de producción del cliente (aún inactivo).
- **No se sube nada directamente a `staging` ni a `main`**: todo entra por
  Pull Request, y cada PR ejecuta `theme check` antes de poder fusionarse.

Flujo de trabajo:

```bash
git checkout staging && git pull
git checkout -b feature/descripcion-corta   # o fix/…, docs/…
# … cambios, commits …
git push -u origin feature/descripcion-corta
```

1. Abrir un PR de la rama hacia **`staging`**. GitHub rellena la descripción
   con la plantilla de `.github/pull_request_template.md`.
2. Esperar a que pase *Analisis estatico del tema* (`theme check`).
3. Fusionar con **«Create a merge commit»**. Al entrar en `staging`, el tema se
   despliega solo a la dev store.
4. Cuando `staging` esté validado, PR de **`staging` → `main`**. Mientras la
   tienda no se transfiera, fusionar en `main` no despliega nada.

> Se usa *merge commit* y no *squash* porque a veces hay varias ramas
> encadenadas, cada una creada a partir de la anterior. Con merge commit se
> fusionan en orden sin conflictos; con squash, la segunda rama volvería a
> traer los commits de la primera con otro hash y chocaría.

### Protección de ramas

Se configura una vez en GitHub, en *Settings → Rules → Rulesets → New branch
ruleset*, aplicado a `main` y `staging`:

- **Restrict deletions** y **Block force pushes**.
- **Require a pull request before merging** (sin aprobaciones obligatorias
  mientras haya un solo desarrollador).
- **Require status checks to pass** → añadir `Analisis estatico del tema` (escrito así, sin tildes: es el nombre exacto del job).

Y en *Settings → General → Pull Requests*: dejar activo **Allow merge
commits**.

### Secretos necesarios

Se configuran en *Settings → Secrets and variables → Actions*:

| Secreto | Uso |
| --- | --- |
| `SHOPIFY_CLI_THEME_TOKEN_STAGING` | Token de la app **Theme Access** de la dev store. |
| `SHOPIFY_CLI_THEME_TOKEN_PRODUCTION` | Token de **Theme Access** que conceda el cliente tras la transferencia. |

La app oficial *Theme Access* genera tokens con permisos limitados a temas:
no dan acceso a pedidos, pagos ni clientes. Los dos tokens son distintos y no
deben reutilizarse entre entornos.

El despliegue a producción está **desactivado por seguridad** hasta que se
transfiera la tienda: el workflow se detiene solo, con un aviso y sin marcar
el push en rojo, mientras falte el secreto o el bloque
`[environments.production]` del `shopify.theme.toml`.

## Catálogo de prueba

La carpeta [`dev/`](dev/) contiene datos de desarrollo, **no** código del tema
(está excluida en `.shopifyignore`, así que nunca se sube a Shopify).

`dev/generar-catalogo-prueba.js` genera `dev/catalogo-prueba.csv`: 8 productos
y 100 variantes de textil de hogar con tamaños de cama españoles
(90/105/135/150/180) y opciones de color y medida.

El **tipo de producto** de cada uno está elegido para que encaje con las
condiciones de las colecciones automáticas de
[`docs/navegacion-y-colecciones.md`](docs/navegacion-y-colecciones.md): juegos
de cama, sábanas bajeras, fundas de almohada, protectores de colchón, colchas y
toallas. `Edredones` y la etiqueta `invierno` se quedan **a propósito sin
producto**, porque el cliente todavía no tiene género de esas dos categorías.

```bash
node dev/generar-catalogo-prueba.js
```

Se importa en *Productos → Importar*. Sirve para construir y probar la ficha
de producto y el listado de colección con variantes reales.

> **No es el catálogo de Vicamar.** Los productos, descripciones y precios son
> inventados y orientativos. Antes del lanzamiento hay que borrarlos y cargar
> el catálogo real del cliente.

## Ficha de producto

Sobre los bloques de Horizon, `templates/product.json` monta dos bloques
propios de este proyecto.

**Guía de medidas** (`blocks/guia-medidas.liquid`) va justo debajo del selector
de variantes y abre un diálogo con la tabla de medidas de la familia de
producto, para que el cliente sepa qué corresponde a cada tamaño de cama antes
de elegir talla. La tabla sale de dos sitios, por este orden:

1. El metafield de producto `custom.guia_medidas` (rich text), si existe. Es la
   vía para el catálogo real, donde cada referencia lleva las medidas de su
   proveedor. Requiere crear la definición en *Configuración → Metafields →
   Productos*.
2. Las tablas estándar de `snippets/guia-medidas-tabla.liquid`, elegidas con el
   ajuste *Tabla de medidas* o deducidas del tipo de producto cuando está en
   «Automática»: juegos de cama, sábanas bajeras, fundas nórdicas, edredones,
   rellenos, colchas, fundas de almohada, protectores de colchón y toallas.

> El mapeo automático se apoya en el **tipo de producto**. Si se cambia la
> taxonomía del catálogo hay que actualizar el `case` de
> `blocks/guia-medidas.liquid`, o la guía dejará de aparecer en las fichas sin
> avisar de nada.

> Las medidas del snippet son las habituales del sector en España y **no están
> contrastadas con el proveedor de Vicamar**. Hay que revisarlas antes del
> lanzamiento.

**Confianza y envíos** (`blocks/confianza-envios.liquid`) son cuatro líneas con
icono bajo el botón de compra: plazo de entrega, umbral de envío gratuito,
plazo de devolución y medios de pago. Cada línea sin título no se pinta, así
que el bloque admite menos de cuatro.

> Los plazos e importes por defecto (24-48 h, envío gratis desde 49 €) son
> **provisionales**. Hay que sustituirlos en cuanto el cliente confirme
> transportista, tarifas y umbral de envío gratuito.

## Portada y barra de anuncios

Diseñadas **primero para móvil**, que es de donde llegará la mayoría del
tráfico. `templates/index.json`, de arriba abajo:

1. **Portada** (`hero`) con imagen propia para móvil activada: una panorámica
   de escritorio recortada en vertical pierde el motivo. Tamaños recomendados:
   2880 × 1280 px en escritorio y 1080 × 1350 px en móvil.
2. **Compra por categoría**: las seis colecciones del menú. En móvil es un
   carrusel deslizable; en escritorio, rejilla de tres.
3. **Más vendidos** y 4. **Novedades**: listas de productos de esas
   colecciones, en carrusel en móvil, con las mismas tarjetas que el listado
   (4:5, «Desde», tamaños disponibles).
5. **Franja de confianza**: el mismo bloque `confianza-envios` de la ficha de
   producto, para que plazos e importes sean idénticos en toda la tienda.

La **barra de anuncios** (`sections/header-group.json`) rota tres mensajes de
menos de 25 caracteres, para que quepan en una línea de móvil: envío gratis,
devoluciones en 14 días y pago con tarjeta o Bizum.

> Textos, imágenes e importes de portada y barra son **provisionales**. El
> umbral de envío gratis (49 €) aparece en tres sitios —barra de anuncios,
> bloque de confianza y política de envíos— y hay que cambiarlo en los tres
> cuando el cliente lo confirme. Todo el contenido de portada y barra es
> castellano: la versión inglesa se traduce con *Translate & Adapt*.

## Navegación y colecciones

El menú de la tienda y las colecciones que lo alimentan son **datos de Shopify,
no código del tema**: no se despliegan con `theme push` ni viajan entre la dev
store y producción, así que hay que rehacerlos en la tienda del cliente tras la
transferencia.

[`docs/navegacion-y-colecciones.md`](docs/navegacion-y-colecciones.md) recoge la
estructura completa del menú, las once colecciones automáticas con sus
condiciones y órdenes, y el orden de trabajo para montarlo todo.

## Pie de página y textos legales

El pie (`sections/footer-group.json`) tiene tres columnas: newsletter,
**Información** (menú `footer`: Sobre nosotros, Contacto) y **Legal** (menú
`legal` más el botón «Configurar cookies»). Los textos legales se pegan en las
políticas nativas de Shopify y en dos páginas; los menús y los textos son datos
del Admin, no código.

El botón «Configurar cookies» (`blocks/preferencias-cookies.liquid`) reabre el
banner de consentimiento nativo de Shopify, como exige el RGPD, y solo aparece
en la tienda cuando ese banner está activado.

[`docs/legal/`](docs/legal/) contiene los **borradores** de aviso legal,
condiciones de venta, devoluciones y desistimiento, privacidad, cookies y
envíos, más la guía de montaje. Ninguno está listo para publicar: faltan los
datos del cliente y la revisión del gestor.

## Notas de mantenimiento

**`config/settings_data.json`** guarda toda la configuración que se hace desde
el editor visual de Shopify. Si se toca el editor en la tienda, esos cambios
viven solo en remoto: hay que traerlos con `shopify theme pull` antes de
seguir trabajando en local, o se perderán en el siguiente push. Es la causa
más común de conflictos en proyectos Shopify.

**Renombrar ficheros de `locales/`** requiere dos pushes seguidos. El CLI sube
los ficheros nuevos antes de borrar los viejos, así que durante un instante
hay dos idiomas marcados como `.default` y Shopify rechaza la subida. El
segundo push, ya con los antiguos borrados, entra limpio.

**`shopify theme push` puede terminar con código de salida 0 aunque Shopify
rechace ficheros sueltos**; el detalle solo aparece en el JSON de salida. Por
eso los workflows de despliegue verifican ese JSON con
[`.github/scripts/verificar-push.js`](.github/scripts/verificar-push.js) en
lugar de fiarse del código de salida.

## Fuera de alcance

Sin Hydrogen ni headless, sin app custom con Admin API, y sin personalización
profunda del checkout (requeriría Shopify Plus).
