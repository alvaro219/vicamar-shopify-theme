# Navegación y colecciones

Guía para montar el menú de la tienda y las colecciones que lo alimentan.

**Todo esto es configuración de Shopify Admin, no código del tema.** Los menús
y las colecciones son datos de la tienda: viven en Shopify, no en este
repositorio, y por eso no se despliegan con `shopify theme push` ni viajan entre
la dev store y producción. Hay que rehacerlos en la tienda del cliente tras la
transferencia, siguiendo este mismo documento.

El tema ya soporta todo lo que se describe aquí sin cambios: Horizon renderiza
menús de hasta **tres niveles** tanto en escritorio (mega menú) como en el cajón
lateral de móvil, que es justo la profundidad que necesita `SHOP > Juegos de
Cama > Invierno`.

## 1. Colecciones

Todas son **colecciones automáticas** (*Productos → Colecciones → Crear
colección → Automatizada*). La condición se apoya en el **tipo de producto**,
que es el campo que rellena el catálogo de prueba de `dev/`.

| Colección | Handle (URL) | Condición | Orden |
| --- | --- | --- | --- |
| Novedades | `novedades` | ver apartado 2 | Más reciente primero |
| Juegos de Cama | `juegos-de-cama` | Tipo = `Juegos de cama` | Mejor vendido |
| Invierno | `juegos-de-cama-invierno` ⚠️ | Tipo = `Juegos de cama` **y** Etiqueta = `invierno` | Mejor vendido |
| Primavera/Verano | `juegos-de-cama-primavera-verano` ⚠️ | Tipo = `Juegos de cama` **y** Etiqueta = `primavera-verano` | Mejor vendido |
| Sábanas Bajeras | `sabanas-bajeras` | Tipo = `Sábanas bajeras` | Mejor vendido |
| Fundas de Almohadas | `fundas-de-almohadas` | Tipo = `Fundas de almohada` | Mejor vendido |
| Fundas y Protectores de Colchón | `fundas-y-protectores-de-colchon` | Tipo = `Protectores de colchón` | Mejor vendido |
| Colchas | `colchas` | Tipo = `Colchas` | Mejor vendido |
| Edredones | `edredones` | Tipo = `Edredones` | Mejor vendido |
| Toallas | `toallas` | Tipo = `Toallas` | Mejor vendido |
| Más Vendidos | `mas-vendidos` | Tipo = `Juegos de cama` | **Mejor vendido** |

Cuando la condición lleva dos filtros, hay que marcar **«Los productos deben
cumplir todas las condiciones»**.

Shopify genera el handle solo, a partir del título, y en todos los casos sale
ya el de la tabla. Las dos marcadas con ⚠️ son la excepción: por título
quedarían `invierno` y `primavera-verano`, que como URL pública no dicen de qué
son. Conviene corregirlas a mano en *Publicación en motores de búsqueda →
Editar → Identificador de URL*, al pie de la ficha de la colección.

Las condiciones **distinguen tildes y mayúsculas**: si el tipo del producto es
`Protectores de colchón` y la condición dice `Protectores de colchon`, la
colección se queda vacía sin dar ningún error.

`Invierno` y `Edredones` se crean ahora pero **nacerán vacías**: el catálogo de
prueba no genera producto de esas dos categorías a propósito, porque el cliente
todavía no tiene género. Se llenarán solas en cuanto se dé de alta un producto
con el tipo o la etiqueta correspondiente.

> **Más Vendidos** funciona sin configurar nada más: el orden «Mejor vendido» lo
> calcula Shopify con las ventas reales de los últimos 30 días. En una tienda
> recién montada, sin histórico de pedidos, se verá en un orden arbitrario. Es
> lo esperado y se corrige solo con las primeras ventas.

## 2. Novedades

Shopify **no permite condicionar una colección automática por fecha de
creación**. Las condiciones disponibles son título, tipo, proveedor, etiqueta,
precio, peso, inventario y variante; no hay «creado en los últimos N días». Así
que «que aparezcan automáticamente los productos nuevos del mes» tiene dos
caminos:

**Opción A — sin configurar nada (recomendada para arrancar).** Colección
automática con una condición comodín que se cumple siempre —*El título del
producto no contiene* `~~~`— y orden **«Fecha de creación (más reciente
primero)»**. La colección contiene todo el catálogo, pero lo recién dado de alta
aparece siempre arriba. Cero mantenimiento y nunca se queda vacía.

**Opción B — corte estricto a 30 días.** Colección automática con condición
*Etiqueta = `novedad`*, más un flujo en **Shopify Flow** (ya instalado en la
tienda) que añada la etiqueta al crear un producto y la retire 30 días después.
Es lo que de verdad significa «novedades del mes», a cambio de montar y mantener
el flujo.

Recomendación: empezar por la A y pasar a la B cuando el catálogo real esté
cargado y se vea si el volumen de altas lo justifica.

## 3. Menú principal

En *Contenido → Menús → Menú principal*. Estructura final:

```
Inicio                              /
Novedades                           /collections/novedades
SHOP                                /collections/all
├── Juegos de Cama                  /collections/juegos-de-cama
│   ├── Invierno                    /collections/juegos-de-cama-invierno   (aún no)
│   └── Primavera/Verano            /collections/juegos-de-cama-primavera-verano
├── Sábanas Bajeras                 /collections/sabanas-bajeras
├── Fundas de Almohadas             /collections/fundas-de-almohadas
├── Fundas y Protectores de Colchón /collections/fundas-y-protectores-de-colchon
├── Colchas                         /collections/colchas
├── Edredones                       /collections/edredones             (aún no)
└── Toallas                         /collections/toallas
Más Vendidos                        /collections/mas-vendidos
Sobre nosotros                      /pages/sobre-nosotros
```

`SHOP` sustituye al `Catálogo` que venía por defecto. Es solo el rótulo del
elemento de menú: se cambia escribiendo encima, sin tocar nada más.

### Las dos categorías que se quedan invisibles

**`Invierno` y `Edredones` se crean como colecciones pero NO se añaden todavía
al menú.** Existen, se pueden preparar y cargar de producto, pero no hay ningún
enlace hacia ellas en la tienda. Cuando llegue el género, se añaden al menú y
aparecen: es un minuto de trabajo y un solo clic para revertirlo.

Se valoró que el tema ocultase automáticamente los enlaces a colecciones vacías,
pero se descartó: obligaba a modificar once bucles repartidos por tres ficheros
del núcleo de Horizon, y uno de ellos —`snippets/mega-menu-list.liquid`— usa
`forloop.index` para repartir el mega menú en columnas, de modo que saltarse
elementos descuadraría la maquetación. No compensa para un estado temporal de
dos colecciones.

### Contacto

La estructura pedida no incluye `Contacto`, que sí venía en el menú por defecto.
Al aplicar este menú desaparece de la navegación superior. Conviene **mantenerlo
en el menú del pie de página** para no perder la vía de contacto, que además
ayuda a transmitir confianza en una tienda nueva.

## 4. Página «Sobre nosotros»

En *Contenido → Páginas → Agregar página*. El handle debe quedar
`sobre-nosotros` para que cuadre con el enlace del menú; se comprueba en el
apartado *SEO* del final de la página.

El contenido lo redacta el cliente. En textil de hogar funciona bien contar
años de oficio, de dónde vienen los tejidos y dónde se fabrica.

## 5. Orden de trabajo

1. Importar `dev/catalogo-prueba.csv` (*Productos → Importar*), si no está ya.
2. Crear las once colecciones del apartado 1.
3. Crear la página «Sobre nosotros».
4. Montar el menú del apartado 3, **sin** `Invierno` ni `Edredones`.
5. Comprobar en `shopify theme dev` que el mega menú abre bien en escritorio y
   que el cajón lateral de móvil navega los tres niveles.
