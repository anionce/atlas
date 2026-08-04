# Contenido SEO (borradores)

Versión en markdown "plano" de cada artículo, con metadatos anotados como texto (meta título, descripción, keywords), pensada para copiar/pegar en un CMS externo si algún día se usa uno. **La versión que realmente se publica en la web vive en [`apps/web/content/blog/`](../../apps/web/content/blog/)** con frontmatter estructurado — si editas un artículo, edita ahí también (o solo ahí) para que el cambio se refleje en el sitio.

- [`cuanto-puedo-pagar-por-una-vivienda.md`](./cuanto-puedo-pagar-por-una-vivienda.md) → enlaza a `/comprar-vivienda`
- [`hipoteca-fija-variable-mixta.md`](./hipoteca-fija-variable-mixta.md) → enlaza a `/comprar-vivienda`
- [`interes-compuesto-guia.md`](./interes-compuesto-guia.md) → enlaza a `/interes-compuesto`
- [`cuentas-remuneradas-vs-fondos-indexados.md`](./cuentas-remuneradas-vs-fondos-indexados.md) → enlaza a `/interes-compuesto`
- [`fire-independencia-financiera.md`](./fire-independencia-financiera.md) → enlaza a `/fire`
- [`como-calcular-tasa-de-ahorro.md`](./como-calcular-tasa-de-ahorro.md) → enlaza a `/fire`
- [`itp-por-comunidad-autonoma.md`](./itp-por-comunidad-autonoma.md) → enlaza a `/gastos-compra-vivienda`
- [`vivienda-nueva-vs-segunda-mano-gastos.md`](./vivienda-nueva-vs-segunda-mano-gastos.md) → enlaza a `/gastos-compra-vivienda`

## Antes de publicar

- Revisa que las cifras (ITP por región, tipos de interés de ejemplo) sigan siendo correctas — pueden cambiar con el tiempo.
- Sustituye los enlaces relativos por la URL final del dominio cuando esté decidido.
- Si añades FAQ schema (`generateFAQSchema` en `@atlas/seo`), la sección "Preguntas frecuentes" de cada artículo ya está en formato pregunta/respuesta lista para eso.
