# Entidades previstas y privacidad

Este documento nació como propuesta en la Etapa 1. La Etapa 2 ya contiene DDL local en `supabase/migrations`; las tablas y políticas siguen **sin desplegar ni validar contra una base ejecutada**.

| Grupo | Entidades previstas | Restricciones que se deberán diseñar |
| --- | --- | --- |
| Cuenta | profiles, courier_profiles | Perfil público separado de contacto y verificación; rol administrativo no editable por el usuario |
| Encuentros | meeting_points, meetings, meeting_participants | Lugares públicos activos, pertenencia, aceptación de ambos y orígenes privados |
| Encargos | jobs, bids, job_assignments | Un repartidor por encargo; ofertas concurrentes y transición atómica |
| Comunicación | conversations, messages | Participantes autorizados, adjuntos privados y límites de contenido |
| Pago de prueba | transactions | Importe del servicio, comisión y propina separados del pago del producto |
| Confirmaciones | handoff_codes | Hash, etapa del servicio, expiración, uso único e intentos limitados |
| Confianza | reviews, reports | Autoría y servicio asociado; moderación sin exponer datos privados |
| Alertas | notifications | Propietario, lectura, entrega y recuperación |

Los contratos iniciales representan perfiles públicos, borradores, estados de servicios, estimaciones y resúmenes Wear. Los identificadores y fechas todavía son tipos de transporte; el servidor validará formatos, pertenencia y valores.

Los importes se expresarán en unidades menores enteras y moneda MXN. No se guardarán tarjetas. La comisión comercial no se fija con el 10 % ilustrativo del documento. Los encuentros gratuitos tendrán comisión cero cuando se implemente su lógica.

El pago del producto solo describe una declaración entre comprador y vendedor. No acredita una operación bancaria, no autoriza al repartidor a adelantar fondos y no pertenece al total de servicio de PuntoMedio.

La ubicación aproximada sirve para sugerencias; una ubicación precisa o un adjunto solo se compartirá con participantes autorizados. Las distancias geográficas de respaldo no tienen un campo de tiempo de viaje para evitar presentarlas como rutas reales.

Las migraciones preparan claves foráneas, unicidad, índices de acceso, RLS, buckets privados, asignación atómica, pagos simulados idempotentes y códigos de entrega con hash. Aún faltan su ejecución controlada, pruebas de RLS/concurrencia, asesores de seguridad y decisiones de retención/eliminación.
