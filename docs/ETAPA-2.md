# Entrega preparada de la Etapa 2

## Actualización de despliegue — 7 de noviembre de 2026

Esta etapa ya fue aplicada al proyecto Supabase exclusivo de PuntoMedio. El
estado remoto coincide con las nueve migraciones locales. Se verificaron 16
tablas públicas con RLS, 5 tablas privadas con RLS, 2 buckets y 25 RPC
privilegiados. Ninguno de esos RPC puede ejecutarse con el rol anónimo.

`supabase db lint` no encontró errores de esquema; los asesores de seguridad en
nivel error y de rendimiento en nivel warning no encontraron incidencias. Las
advertencias por ejecución de RPC desde `authenticated` son intencionales: cada
función valida identidad, pertenencia, revisión y transición en el servidor.

Las listas históricas de “no ejecutado” que siguen en este archivo describen el
estado original de la entrega y quedan sustituidas por esta actualización.

Fecha: 7 de noviembre de 2026. Alcance: preparación local de persistencia, seguridad y fronteras de integración. Esta entrega **no acredita que el backend funcione** porque no se levantó Supabase, no se aplicaron migraciones y no se ejecutaron pruebas.

## Incluido

- Cinco migraciones SQL locales creadas con la CLI instalada, sin enlace remoto.
- Perfiles públicos y contactos privados separados; una identidad de Auth por persona.
- Proyección controlada de correo/teléfono verificados desde `auth.users`.
- Encuentros, lugares públicos, encargos, ofertas y una sola asignación por encargo.
- Conversaciones y adjuntos vinculados a participantes autorizados.
- Pago del servicio exclusivamente simulado y separado del pago del producto.
- Confirmaciones con hash, caducidad, uso único y límite de intentos.
- RLS en todas las tablas expuestas, grants explícitos y esquema privado sin acceso directo.
- Buckets privados para avatares y evidencias.
- RPC para perfil, repartidor, asignación atómica, pago idempotente y confirmaciones.
- Cliente React Native, persistencia de sesión, Auth y repositorio de perfiles preparados.

## Decisiones de seguridad

El cliente no puede editar verificaciones, reputación, asignaciones, transacciones o estados críticos directamente. Las funciones privilegiadas fijan `search_path`, validan `auth.uid()`, revocan ejecución pública y conceden solo a `authenticated`. Ninguna política depende de `user_metadata`.

Los perfiles ajenos salen mediante una función que devuelve solo nombre, ciudad, avatar y reputación, respetando bloqueos. El OTP telefónico se plantea como cambio verificado dentro de la sesión de correo existente, no como otra cuenta.

## No ejecutado

- instalación de dependencias o generación de lockfile;
- inicio local de Supabase o contenedores;
- aplicación de migraciones o conexión a un proyecto alojado;
- typecheck, lint, compilación, pruebas o emuladores;
- generación automática de tipos desde una base real;
- asesores de seguridad/rendimiento, correo o SMS;
- pagos reales o simulados ejecutados.

## Pendiente antes de activar

1. Elegir un proyecto Supabase exclusivo de PuntoMedio, sin reutilizar MatchControl.
2. Decidir SMS, ciudad piloto, mapas/rutas, comisión, límites e incidentes.
3. Autorizar instalación y ejecución local para validar sintaxis, tipos y migraciones.
4. Probar RLS por rol, condiciones de carrera, idempotencia y códigos vencidos.
5. Revisar Storage, URLs firmadas, retención, eliminación y moderación.
6. Conectar la UI solo después de que el backend pase esas comprobaciones.

La siguiente etapa no debe comenzar ni deben aplicarse estos archivos hasta recibir una nueva instrucción del usuario.
