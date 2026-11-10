# Datos de prueba integrales

La base enlazada de Supabase contiene un escenario coherente para recorrer todos los módulos de PuntoMedio. El script `supabase/seed_showcase.sql` es idempotente: puede ejecutarse varias veces sin duplicar registros.

## Acceso principal

- Correo: `sofia.alcantara@puntomedio.test`
- Contraseña: `Punto2026`

El dominio `.test` está reservado para pruebas y evita suplantar cuentas reales.

## Cobertura

- 6 perfiles y 6 puntos públicos de Phoenix.
- 4 encuentros en estados completado, en curso, punto acordado e invitación pendiente.
- 6 encargos en estados publicado, recibiendo ofertas, asignado, recogida en curso y completado.
- Ofertas, asignaciones, transacciones, reseñas y ubicaciones privadas relacionadas.
- 5 conversaciones, 9 mensajes y 6 notificaciones.

## Comportamiento esperado con Sofía

Las políticas RLS permiten consultar 1 encuentro, 1 encargo, 1 conversación, 2 mensajes, 2 notificaciones y 4 reseñas. Los datos de otras personas no deben aparecer fuera de los flujos públicos autorizados.

## Pendientes de producto

- Los encuentros todavía no tienen un campo explícito de fecha programada; el orden actual usa estado y fecha de actualización.
- Mensajes muestra conversaciones y avances, pero aún no incorpora un chat bidireccional completo.
- La sincronización teléfono–Wear OS requiere implementar Data Layer en una compilación nativa; Expo Go no expone esa integración.
- Los pagos permanecen simulados por diseño y no deben presentarse como cobros reales.
