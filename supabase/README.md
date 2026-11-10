# Supabase local — Etapa 2

Los archivos de `migrations/` fueron generados con `supabase migration new` y completados sin enlazar un proyecto. No se ejecutaron `supabase start`, `db reset`, `migration up`, `db push`, consultas SQL ni asesores.

Orden preparado:

1. tipos, perfiles, contactos privados y proyección de verificaciones de Auth;
2. encuentros, puntos, encargos, ofertas y asignación;
3. conversaciones, mensajes, pagos simulados, confirmaciones, reseñas, reportes y avisos;
4. RLS, privilegios y buckets privados;
5. RPC transaccionales y con permisos explícitos;
6. reputación segura, visibilidad con bloqueos y agregados de calificación.

Antes de aplicar estas migraciones se requiere un proyecto exclusivo de PuntoMedio y autorización expresa para una ejecución local o remota. Después deberán ejecutarse asesores, pruebas de RLS por rol, concurrencia, idempotencia y reintentos.

No agregues `service_role` ni claves secretas al móvil. La app solo admite URL y clave publicable. Los buckets `avatars` y `service-media` son privados.
