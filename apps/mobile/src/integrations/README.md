# Integraciones sin activar

- Supabase: cliente, Auth y repositorio de perfiles preparados en código. Las dependencias están declaradas, pero no instaladas; no hay proyecto conectado ni solicitudes ejecutadas.
- Cámara y galería: botones de presentación deshabilitados, sin permisos ni selección de archivos.
- Mapas y ubicación: sin SDK de mapas, peticiones, coordenadas de muestra ni permisos. El proveedor de rutas aún debe elegirse.
- Wear OS: sin enlace nativo ni envío de comandos. La pantalla muestra Sin vincular.
- Pagos: sin SDK, tarjetas, métodos guardados ni transacciones. La V1 utilizará pagos simulados cuando se implemente su etapa.

La sincronización mediante Wearable Data Layer requerirá un módulo nativo y un development build de Expo cuando se implemente; no se presupone compatibilidad de ese módulo con Expo Go.
