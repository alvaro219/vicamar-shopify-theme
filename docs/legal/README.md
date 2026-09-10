# Textos legales y cookies

Borradores de los textos legales de la tienda y guía para montarlos en Shopify.

> **Ningún texto de esta carpeta está listo para publicar.** Son borradores
> redactados como punto de partida, pendientes de:
>
> 1. los datos del cliente marcados entre `[CORCHETES]`, y
> 2. la revisión de un gestor o abogado, especialmente las condiciones de venta
>    y la política de devoluciones, como ya indicaba la ficha técnica.

Los textos, como el menú y las colecciones, son **datos de la tienda**: no se
despliegan con el tema. Se pegan a mano en el Admin y hay que repetirlo en la
tienda del cliente tras la transferencia.

## Qué va dónde

Se usan las **políticas nativas** de Shopify siempre que existen, porque Shopify
las enlaza también en el checkout, que es donde legalmente más importan. Las
dos que Shopify no tiene se crean como páginas.

| Texto | Borrador | Dónde se pega | Etiqueta en el menú legal |
| --- | --- | --- | --- |
| Aviso legal (LSSI) | [aviso-legal.md](aviso-legal.md) | *Contenido → Páginas* → «Aviso legal» | Aviso legal |
| Condiciones de venta | [condiciones-venta.md](condiciones-venta.md) | *Configuración → Políticas → Términos del servicio* | Condiciones de venta |
| Devoluciones y desistimiento | [devoluciones-desistimiento.md](devoluciones-desistimiento.md) | *Configuración → Políticas → Política de reembolso* | Devoluciones y desistimiento |
| Envíos | [politica-envios.md](politica-envios.md) | *Configuración → Políticas → Política de envío* | Envíos |
| Privacidad (RGPD) | [politica-privacidad.md](politica-privacidad.md) | *Configuración → Políticas → Política de privacidad* | Privacidad |
| Cookies | [politica-cookies.md](politica-cookies.md) | *Contenido → Páginas* → «Política de cookies» | Cookies |

En *Configuración → Políticas* existe además **«Información de contacto»**.
Conviene rellenarla con los mismos datos identificativos del apartado 1 del
aviso legal: Shopify la muestra en el checkout a los compradores de la UE. No
hace falta añadirla al menú legal, porque el aviso legal ya los contiene.

Al pegar los borradores en el editor de Shopify, los enlaces internos
(`/policies/…` y `/pages/politica-de-cookies`) funcionan tal cual si la página
de cookies se crea con ese título; se comprueba en el apartado *SEO* de la
página.

## Menús del pie de página

El pie tiene tres columnas: newsletter, **Información** y **Legal**. Las dos
últimas son menús del Admin (*Contenido → Menús*), igual que el principal.

**Menú «Información»** — es el *Footer menu* que ya existe (handle `footer`).
Borrar lo que trae («Buscar») y dejar:

- Sobre nosotros → *Páginas → Sobre nosotros*
- Contacto → *Páginas → Contact*

**Menú «Legal»** — hay que crearlo con *Crear menú* y el título **Legal**.
Shopify genera el identificador a partir del título, y **tiene que quedar
exactamente `legal`**, que es el que busca el tema: si se titula de otra forma
(«Menú legal» daría `menu-legal`), la columna saldrá vacía. El identificador se
ve bajo el nombre al guardar. Elementos, en este orden:

- Aviso legal → *Páginas → Aviso legal*
- Condiciones de venta → *Políticas → Términos del servicio*
- Devoluciones y desistimiento → *Políticas → Política de reembolso*
- Envíos → *Políticas → Política de envío*
- Privacidad → *Políticas → Política de privacidad*
- Cookies → *Páginas → Política de cookies*

Bajo el menú legal, el tema añade solo el botón **«Configurar cookies»**
(bloque `preferencias-cookies`), que no es un elemento de menú: ver el apartado
siguiente.

> La página de contacto se llama **«Contact»**, en inglés, porque venía con la
> tienda. Hay que cambiar su título a «Contacto», que es lo que se ve como
> encabezado de la página. Si el cambio no se refleja en la tienda, es la misma
> capa de traducción que afectó a `Home` y `Catalog` en el menú principal: se
> corrige en *Translate & Adapt*.

## Banner de cookies

Se usa el **banner nativo de Shopify**, no uno propio ni una app:

- cumple los requisitos de consentimiento del RGPD y de la LSSI;
- bloquea automáticamente los píxeles de Meta y TikTok hasta que el visitante
  los acepta, siempre que se instalen con sus apps oficiales o como píxeles de
  cliente en *Configuración → Eventos de clientes*;
- no añade JavaScript de terceros, en línea con la norma de la ficha de no
  cargar apps innecesarias.

Configuración, en *Configuración → Privacidad del cliente → Banner de
cookies*:

1. Activarlo para **España** (o para el Espacio Económico Europeo completo).
2. Enlazar la **Política de cookies** como página de política del banner.
3. Revisar que los textos salgan en castellano y que el botón de rechazar sea
   tan visible como el de aceptar.

**Retirar el consentimiento debe ser tan fácil como darlo.** Por eso el pie
lleva el botón «Configurar cookies», que vuelve a abrir el banner en cualquier
momento. El botón **solo aparece cuando el banner está activo**: hasta que se
active el paso 1, no se verá en la tienda (en el editor de temas sí, para
poder colocarlo).

### Auditoría de cookies

La tabla de la política de cookies hay que rellenarla con las cookies reales,
**después de instalar los píxeles**:

1. Abrir la tienda en una ventana de incógnito y aceptar todas las cookies.
2. Navegar por portada, una colección, una ficha, el carrito y el inicio del
   checkout.
3. En las herramientas de desarrollo del navegador, *Aplicación → Cookies*,
   anotar nombre, dominio y caducidad de cada una.
4. Repetir rechazando todas y comprobar que **no aparece ninguna de marketing**
   (`_fbp`, `_ttp` o similares). Si aparecen, algún píxel se ha instalado
   saltándose el consentimiento.

## Plataforma ODR de la UE: ya no aplica

La ficha técnica pedía enlazar la plataforma europea de resolución de
litigios en línea (ODR). **No se ha añadido a propósito.** El Reglamento (UE)
2024/3228 derogó el Reglamento (UE) 524/2013 y la plataforma ODR dejó de
funcionar el 20 de julio de 2025; con ella desapareció la obligación de
enlazarla. Añadir hoy el enlace llevaría a los clientes a un servicio cerrado.

Lo que sigue vigente es informar sobre las entidades de resolución alternativa
de litigios a las que la empresa esté adherida (Ley 7/2017). Las condiciones
de venta dejan ese hueco marcado para que el gestor confirme qué procede.

## Datos que hay que pedir al cliente

- Razón social (o nombre y apellidos si es autónomo), NIF/CIF y domicilio.
- Datos del Registro Mercantil, si es sociedad.
- Correo electrónico y teléfono de atención al cliente, y horario.
- Dirección para devoluciones.
- Si paga el cliente final la devolución o es gratuita.
- Si algún producto se excluye del desistimiento por higiene (almohadas,
  rellenos precintados…).
- Entidad que da el servicio de Bizum.
- Transportista, plazos, tarifas y umbral de envío gratuito.
- Adhesión, si la hay, a arbitraje de consumo u otra entidad de resolución
  alternativa.
