# Arquitectura de PuntoMedio

## Organización propuesta

Se utiliza un repositorio independiente con dos aplicaciones y paquetes de TypeScript pequeños. Los paquetes compartidos contienen tipos y tokens, no clientes de red ni acceso a credenciales. Wear conserva su construcción Gradle independiente.

```text
PuntoMedio/
  apps/mobile/                 Expo y React Native
    src/components/            Presentación reutilizable
    src/features/              Pantallas agrupadas por función
    src/navigation/            Rutas y pestañas tipadas
    src/hooks/                 Estado de interfaz
    src/config/                Configuración y límites de esta fase
    src/integrations/          Fronteras de servicios externos
  apps/wear/                   Kotlin y Compose for Wear OS
  packages/design-tokens/      Midnight Violet
  packages/contracts/         DTO y protocolo preliminar
  references/                 Fuentes originales sin ejecutar
  docs/                       Decisiones y trazabilidad
```

Los nombres concretos de archivos se enumeran en [ARCHIVOS-ETAPA-1.md](ARCHIVOS-ETAPA-1.md). La primera implementación es una estructura de interfaz. Auth, base de datos, mapas, chat, pagos y sincronización real siguen sin conexión.

## Separación de responsabilidades

Las pantallas componen controles visuales y navegación. Los hooks conservan únicamente estado local de presentación. Las validaciones de formularios se añadirán en su etapa correspondiente; no acreditarán por sí mismas verificaciones de cuenta.

Los futuros adaptadores de Supabase, ubicación, mapas y notificaciones tendrán una interfaz explícita. Las reglas de asignación, permisos, códigos temporales, precios y transiciones pertenecerán a Edge Functions y PostgreSQL. Una acción del cliente representa una intención y nunca un resultado confirmado.

El perfil público utiliza un DTO separado que excluye correo, teléfono, domicilio y documentación. El borrador del formulario no incluye permisos administrativos ni indicadores de verificación editables. La condición de perfil completo deberá proceder de datos confiables del servidor.

## Navegación

La navegación raíz distingue acceso, preparación del perfil, pestañas principales y vistas auxiliares. Las cinco pestañas proceden de Stitch: Inicio, Explorar, Actividad, Mensajes y Perfil. Recuperación de acceso, correo pendiente, listas vacías y detalles sin datos son estructuras adaptadas, no flujos comerciales implementados.

El acceso de diseño al inicio no equivale a iniciar sesión. Las operaciones que crean o modifican servicios permanecen bloqueadas. Los ejemplos estáticos del HTML no se trasladan a registros locales ni a estados de éxito.

## Estado y gestión de errores

En esta fase basta con estado local de React y providers pequeños para borradores no persistentes. No se añade una biblioteca global de estado ni una caché remota antes de existir un servicio que integrar.

Los límites de integración deben distinguir configuración ausente, sesión no disponible, perfil incompleto, falta de autorización, conflicto y servicio temporalmente no disponible. No se inicia una petición de red al importar un módulo de configuración.

## Móvil y reloj

El identificador técnico provisional de ambos es `com.puntomedio.app`. Data Layer necesitará también una firma compatible. Los identificadores y la estrategia de firma deben revisarse antes de distribución; no se copian claves del proyecto anterior.

El móvil será autoridad de la sesión. En la etapa del reloj se implementará un puente nativo y una réplica mínima de servicios autorizados. El reloj recibirá solo datos de presentación y enviará intenciones con identificador, secuencia/revisión y fecha; el backend volverá a validar identidad, pertenencia y estado.

Los tipos iniciales de `packages/contracts/src/watch.ts` y su equivalente Kotlin no implementan serialización, mensajería, reintentos ni confirmaciones. Tampoco acreditan un enlace. Las confirmaciones de recogida y entrega requerirán un desafío vinculado al servicio, con expiración y validación del servidor; el mensaje de intención no sustituye el código.

Un development build de Expo será necesario si se añade un módulo nativo Data Layer. Expo Go no se considera prueba de integración móvil–reloj. La alternativa de acceso al backend desde el reloj requerirá autorización limitada, revocable y de corta duración; no se trasladará una clave de servicio ni una sesión de pago al dispositivo.

## Límites deliberados

No se implementa watchOS, rastreo continuo de ubicación, pago al vendedor, custodia de fondos, biometría ni verificación oficial. El proveedor de rutas, la ciudad piloto, límites de valor, edad mínima y reglas comerciales continúan pendientes. Ver [INTEGRACIONES.md](INTEGRACIONES.md).

El documento técnico agrupa más trabajo en sus fundamentos, pero la solicitud de esta intervención reserva base de datos y Supabase para la Etapa 2. Ese trabajo no forma parte de la entrega actual.
