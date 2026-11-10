# PuntoMedio móvil

Base de presentación para la Etapa 1. No se han instalado dependencias, abierto aplicaciones, compilado, ejecutado verificadores de tipos ni realizado pruebas. La compatibilidad real de las declaraciones y los flujos queda pendiente de comprobación autorizada.

## Qué contiene

- Expo y React Native con TypeScript estricto y dependencias declaradas manualmente.
- Componentes nativos reutilizables con los tokens Midnight Violet compartidos.
- Inter declarada mediante assets del paquete de fuentes, con una alternativa del sistema si falla su carga.
- Navegación tipada de acceso y las cinco pestañas de Stitch: Inicio, Explorar, Actividad, Mensajes y Perfil.
- Siete estructuras de pantalla adaptadas de Stitch: bienvenida/acceso, registro, SMS, foto, inicio, perfil público y edición/ajustes.
- Estructuras vacías coherentes para explorar, actividad, mensajes, avisos, recuperación, verificación de correo y explicación de los dos servicios. Sus diseños son adaptaciones pendientes de aprobación.

Las pantallas muestran un aviso de vista de diseño. Las acciones que crearían una cuenta, verificarían un código, cargarían una fotografía, guardarían datos o crearían servicios permanecen deshabilitadas. Los enlaces Ver diseño permiten recorrer la estructura sin simular una sesión autenticada.

## Organización

    App.tsx                     Composición de fuentes, límites de error y proveedores
    src/components              Controles visuales y disposición nativa
    src/config                  Alcance fijo de la etapa sin integraciones
    src/features                Pantallas y componentes por funcionalidad
    src/hooks                   Acceso tipado al borrador en memoria
    src/navigation              Rutas, stack y pestañas tipadas
    src/state                   Borrador local de perfil sin credenciales
    src/theme                   Selección de fuentes y alternativa del sistema
    src/integrations            Límites futuros, sin conexión real
    src/services                Reserva de adaptadores futuros
    src/validation              Reglas por implementar en etapas posteriores

El estado del borrador solo contiene los campos públicos/privados del formulario, en memoria. No contiene contraseña, token de sesión, roles privilegiados ni banderas de verificación. Cada contraseña y los dígitos de muestra escritos por el usuario son estado local de la pantalla, sin persistencia ni envío.

## Adaptación del diseño

El HTML de Stitch se usa como referencia estática. No se importan Tailwind, scripts CDN ni fuentes web en la aplicación. Los iconos lineales se adaptan a Lucide mediante SVG nativo. Se utilizan SafeArea, scroll, disposición adaptable y controles de teclado en lugar de alturas web fijas.

No se copian correos, nombres, reputaciones, reseñas, códigos ni servicios activos del ejemplo. No se presentan verificaciones biométricas u oficiales, custodia, puntos monitoreados ni una conexión de reloj inexistente.

La navegación de perfil público presenta solo nombre y ciudad del borrador, sin teléfono ni correo. No permite iniciar chat directo: las conversaciones futuras necesitan un servicio autorizado.

## Instalación y ejecución posteriores

El monorepositorio utiliza las workspaces del directorio raíz. La instalación, generación del lockfile, revisión de compatibilidad, verificación de tipos y ejecución de Expo deben realizarse únicamente cuando el usuario lo autorice expresamente. Los scripts preparados en package.json no se han ejecutado.

No hay cliente Supabase ni proyecto remoto enlazado. Una conexión futura solo admitirá URL HTTPS y clave publicable; no debe reutilizar el backend ni las credenciales de MatchControl.

## Pendiente de comprobar

Resolución del monorepositorio y de las versiones declaradas, tipado de navegación, carga de Inter, teclado, tamaños de pantalla, escalado de texto, lectores de pantalla, áreas seguras, estado vacío y tratamiento del límite de error. No se afirma que estas pantallas funcionen hasta esa fase.
