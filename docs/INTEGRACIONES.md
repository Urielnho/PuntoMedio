# Integraciones y decisiones pendientes

## Supabase

Se prevén PostgreSQL, Auth, Realtime, Storage y Edge Functions. La Etapa 1 prepara límites y nombres de configuración, sin inicializar un cliente ni vincular un proyecto. No se utiliza el proyecto de MatchControl.

En la Etapa 2 se diseñarán RLS por usuario y participación, acceso a perfiles públicos y protección de mensajes, fotos, verificaciones y ubicaciones. Las claves publicables del cliente no sustituyen las políticas de autorización. Las claves secretas o administrativas solo pertenecerán a servicios del servidor.

El proveedor SMS, costos del OTP, confirmación del correo, recuperación y almacenamiento seguro de sesiones siguen pendientes. El OTP telefónico de seis casillas del diseño y los códigos temporales de recogida/entrega son conceptos diferentes.

## Mapas y ubicación

OpenStreetMap se propone como fuente cartográfica, no como API de rutas. Antes de incorporar un SDK se elegirán ciudad piloto, proveedor de geocodificación/rutas, cobertura, atribución, cuotas y tratamiento de coordenadas.

La V1 solicitará permiso explícito cuando se implemente la función. No contempla rastreo permanente en segundo plano. Si falla el cálculo de rutas, el respaldo será distancia geográfica identificada como aproximación, sin inventar minutos de viaje.

## Fotografías y mensajes

Se prevén captura o selección explícitas, archivos limitados, buckets privados y acceso autorizado. La foto de perfil será obligatoria para operar, pero no demostrará identidad oficial. No se añade cámara, galería ni subida de archivos en esta fase.

El chat pertenecerá a un encuentro o encargo. El botón de mensaje del perfil público no debe convertirse en un canal abierto a terceros sin relación con el servicio.

## Wear OS y notificaciones

Se prepara una aplicación Wear OS, no watchOS. La implementación de transporte, recuperación, comandos ordenados y autorización corresponde a su etapa. Un puente nativo específico del móvil requiere un development build de Expo.

Expo Push/FCM y las notificaciones Wear se evaluarán posteriormente. La entrega no se considerará garantizada ni sustituirá la lectura autorizada del estado. La interfaz inicial no afirma estar conectada a un reloj.

## Pagos

Los pagos de V1 serán simulados. La aplicación no incluye un SDK de cobros, tarjetas ni credenciales financieras. Un futuro proveedor marketplace en México requiere validación comercial y técnica antes de configurar producción. El documento menciona Stripe Connect como candidato, no como decisión aprobada.

No se establece custodia, retención ni liberación condicionada de fondos. La propina será voluntaria y podrá ser cero. Los costos y la comisión deberán aparecer en el desglose antes de confirmar.

## Decisiones que necesitan definición

- Ciudad piloto y selección de 10–20 lugares públicos.
- Proveedor de mapas, rutas, geocodificación y SMS.
- Límites de valor y categorías, edad mínima, términos y protocolo de incidentes.
- Acciones del vendedor mediante cuenta o invitación limitada.
- Reglas comerciales de ofertas, comisión y cancelación.
- Firma y puente nativo móvil–Wear, y aprobación de las pantallas circulares adaptadas.
- Proveedor de pagos y obligaciones operativas para una fase posterior.

Estas decisiones no impiden preparar navegación y estilos. Sí impiden presentar las integraciones y flujos comerciales como implementados.
