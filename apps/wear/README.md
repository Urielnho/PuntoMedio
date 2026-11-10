# PuntoMedio Wear OS

Estructura inicial de la Etapa 1 para un reloj circular. Las pantallas son una adaptación de los tokens Midnight Violet porque la exportación de Stitch no incluye diseños Wear OS. Su distribución y comportamiento visual quedan pendientes de aprobación y comprobación posterior.

## Estado de esta entrega

- Proyecto Android independiente, Kotlin y Compose for Wear OS Material 3.
- Navegación local con retorno por deslizamiento entre inicio, servicios activos, notificaciones, ganancias, cuenta y detalle sin servicio seleccionado.
- Contenedores con márgenes calculados según la forma de pantalla, lista transformable, reloj e indicador de desplazamiento administrados por los componentes Wear.
- Estados vacíos sin servicios, perfil, reputación, ganancias o conexión inventados.
- Confirmaciones de llegada, recogida y entrega deshabilitadas.
- Contratos de presentación equivalentes a los de TypeScript, sin conexión, serialización ni envío de comandos implementados.

No se han instalado dependencias, abierto Android Studio, iniciado aplicaciones ni emuladores, compilado el proyecto o ejecutado pruebas. La configuración y el código solo se han revisado estáticamente; no se declara que funcionen.

## Organización

    app/src/main/java/com/puntomedio/wear/
      MainActivity.kt
      contracts/
      design/
      navigation/
      presentation/
        components/
        screens/
    app/src/main/res/
      drawable/
      values/

MainActivity solo establece la interfaz. La navegación, los componentes, los tokens y los contratos están separados.

## Decisiones iniciales

Se fijaron AGP 8.13.0, Kotlin 2.2.10, Gradle 8.13, JDK 17, SDK de compilación y destino 36 y mínimo 30. Compose BOM 2025.08.00 y las bibliotecas Wear 1.5.0 quedan declaradas para una instalación y comprobación expresamente autorizadas en otra fase.

La paleta usa fondo 15131F, superficie 252238, texto FFFFFF, acento 9787D9 y texto secundario B5B0C4. El contorno 312D4A reutiliza la superficie oscura complementaria del sistema de diseño de Stitch. Se usa sans-serif del sistema como equivalente compatible mientras no se incorporen fuentes Inter locales al reloj. No se añaden fotografías ni recursos remotos.

El identificador de aplicación es com.puntomedio.app, compartido con el móvil, y el namespace es com.puntomedio.wear. Antes de utilizar Data Layer también deberá coincidir la firma de ambas aplicaciones.

El wrapper incluido es una copia sin modificaciones de los archivos genéricos Gradle ya disponibles en el equipo. La URL de distribución fija Gradle 8.13 y su SHA-256. Copiar estos archivos no instala ni ejecuta Gradle; la descarga futura de la distribución requiere autorización.

## Cuenta y sincronización futuras

El teléfono será la autoridad de sesión. El reloj recibirá un resumen autorizado y ordenado: identificador del dispositivo emisor, secuencia, versión, estado de perfil y servicios permitidos. No recibirá contraseñas, refresh tokens, claves de servicio de Supabase, secretos de pago ni códigos de entrega.

Los DTO no autorizan operaciones. Los comandos incluyen identificador idempotente, servicio, intención y revisión esperada. El backend deberá comprobar identidad, pertenencia al servicio, estado y códigos temporales antes de confirmar cualquier transición. No se implementan estas validaciones ni una máquina de estados en la Etapa 1.

La futura integración móvil Data Layer necesitará un módulo nativo y una compilación de desarrollo de Expo; no se presupone que Expo Go pueda cargar ese puente. La autenticación, el transporte, el almacenamiento de una réplica, la reconexión, el rechazo de mensajes atrasados y la deduplicación quedan para las etapas autorizadas. Un eventual acceso directo al backend necesitará un mecanismo de autorización limitado que todavía no está definido ni activo.

Los enums Kotlin declaran wireValue para mantener las cadenas lower_snake_case del contrato compartido. El adaptador de JSON se incorporará más adelante; no debe serializarse el nombre del enum por defecto. Las cantidades son unidades menores enteras y el resumen de ganancias solo contempla el modo simulated.

## Pendiente de comprobar

- Resolución de dependencias y compatibilidad de APIs.
- Lectura y contraste en relojes pequeños y con texto ampliado.
- Inicio y posición del contenido, áreas táctiles, reloj e indicador en pantallas circulares.
- Desplazamiento con corona y navegación de retorno.
- Correspondencia de contratos, formatos ISO y límites numéricos antes de conectar el transporte.
- Ausencia de datos privados en mensajes, notificaciones y registros.

No ejecutar comandos de instalación, compilación o pruebas hasta recibir autorización explícita.
