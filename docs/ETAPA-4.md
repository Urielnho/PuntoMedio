# Entrega preparada de la Etapa 4 — Voy yo

> Actualización — 7 de noviembre de 2026: las funciones y políticas de este
> flujo ya están desplegadas. Falta cargar un catálogo real y revisado de puntos
> públicos y validar el recorrido completo con dos cuentas reales.

Fecha: 7 de noviembre de 2026. Alcance: encuentros gratuitos entre dos participantes. El código fuente fue revisado estáticamente y la aplicación móvil se ejecutó localmente en Expo Go, sin conectar ni modificar una base de datos remota.

## Flujo preparado

1. Una persona con perfil completo crea el encuentro e indica una zona aproximada.
2. El servidor genera una invitación aleatoria, almacenada solo como hash, válida por 24 horas y de un uso.
3. Una segunda cuenta completa acepta e indica su propia zona aproximada.
4. Los orígenes permanecen en el esquema privado y no se entregan al cliente.
5. Se calculan hasta tres lugares públicos activos de la misma ciudad.
6. Sin proveedor de rutas, el orden utiliza distancia geográfica y equilibrio entre ambas personas; nunca muestra minutos inventados.
7. Ambas personas deben aceptar exactamente el mismo lugar.
8. Cada participante confirma su llegada y después su finalización.
9. El encuentro solo pasa a completado cuando las dos personas finalizan.
10. El historial queda disponible en Actividad y aumenta el contador de servicios completados.

## Seguridad y concurrencia

- El cliente perdió permisos directos de escritura sobre encuentros, participantes y sugerencias.
- Las transiciones se realizan mediante RPC que validan `auth.uid()`, perfil completo, pertenencia, estado y revisión optimista.
- Hay un máximo de dos participantes y el creador no puede consumir su invitación.
- La invitación se consume atómicamente y no puede reutilizarse.
- Los orígenes se trasladaron de la tabla pública a `private.meeting_origins` con RLS.
- Las sugerencias se bloquean una vez que comenzó la aceptación del lugar.
- El servicio es gratuito: no crea transacciones, tarifas ni comisiones.

## Interfaz móvil

- Crear encuentro y generar invitación.
- Unirse con código privado.
- Captura temporal de coordenadas aproximadas.
- Detalle con estado, participantes, sugerencias y distancias.
- Aceptación del punto, llegada, finalización y cancelación.
- Actividad con encuentros autorizados e historial.
- Exploración del catálogo real de lugares públicos activos.

Las pantallas son adaptaciones Midnight Violet porque Stitch no incluye este flujo.

## Decisiones todavía pendientes

- Ciudad piloto y catálogo revisado de lugares; no se agregaron registros ficticios.
- Proveedor de mapa, geocodificación y rutas, atribución, costos y cuotas.
- Selector visual de zona; temporalmente se solicitan coordenadas aproximadas manuales.
- Canal de compartición de la invitación y formato de enlace universal.
- Política operativa de cancelación e incidentes.
- Notificaciones y chat, reservados para su propia etapa.

## Validación local realizada

- Dependencias fijadas instaladas y lockfile generado.
- `npm run mobile:typecheck`: aprobado.
- `npx expo-doctor`: 20/20 comprobaciones aprobadas.
- Bundle Android generado por Metro y cargado en Expo Go SDK 58.
- Pantalla de acceso de PuntoMedio renderizada en el emulador móvil.
- Registro de ejecución revisado sin excepciones de React Native ni Android.

La aplicación muestra `Conexión pendiente de configurar. No se enviarán datos.` porque no existe un `.env` con un proyecto Supabase independiente de PuntoMedio. No se levantó Supabase local, no se aplicaron migraciones, no se conectó una base remota y no se probaron flujos que requieren dos cuentas o datos persistidos. La Etapa 5 (`Van por mí`) requiere una nueva confirmación.
