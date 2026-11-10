# PuntoMedio

## Alcance autorizado

Las Etapas 1 a 4 fueron cerradas y el usuario autorizó preparar la Etapa 5 el 7 de noviembre de 2026. El alcance vigente comprende el flujo `Van por mí`; no incluye despliegue de Supabase ni ejecución de migraciones remotas.

- Las dependencias móviles fueron instaladas y la aplicación fue ejecutada por autorización expresa durante la Etapa 4. No ampliar esa autorización a despliegues o cambios remotos.
- No desplegar servicios ni ejecutar migraciones remotas. La autorización para preparar la Etapa 2 no implica permiso para modificar una base alojada.
- No modificar servicios de producción. PuntoMedio no está vinculado a ningún proyecto de Supabase.
- No reutilizar credenciales, backend, identificadores de aplicación ni código de negocio de MatchControl.
- Los pagos de esta V1 serán simulados cuando se implemente esa etapa. No procesar dinero real, almacenar tarjetas ni configurar cobros de producción.
- Distinguir la validación local del código de la validación integral: sin proyecto Supabase independiente no pueden probarse autenticación, RLS ni flujos entre cuentas.

## Referencias

El documento técnico de `references/technical/` define requisitos. El material de `references/stitch/` define presentación. La solicitud en `references/solicitud-etapas.md` controla el orden y los límites de trabajo. Los HTML son referencias estáticas: no ejecutarlos ni trasladar sus scripts CDN a la aplicación nativa.

## Organización

`apps/mobile` contiene Expo y React Native; `apps/wear`, Kotlin y Wear OS; `packages/design-tokens`, tokens; `packages/contracts`, contratos públicos mínimos. Documentar las decisiones y discrepancias en `docs`. Separar presentación, navegación, estado local y límites de integración.

Ninguna pantalla inicial debe simular una sesión autenticada, verificación, servicio activo, reputación, llegada, entrega ni conexión con el reloj. Las estructuras sin diseño deben marcarse como adaptaciones pendientes en la documentación.
