# Entrega preparada de la Etapa 3

> Actualización — 7 de noviembre de 2026: el proyecto Supabase y su clave
> publicable ya están configurados localmente; las migraciones están aplicadas.
> Siguen pendientes la configuración y prueba del proveedor telefónico, las URLs
> de redirección/deep links y una prueba completa con cuentas reales.

Fecha: 7 de noviembre de 2026. Alcance: autenticación y perfiles. Es código preparado y revisado estáticamente; no se instaló, compiló ni ejecutó.

## Implementado en código

- Runtime seguro de Supabase que permanece inactivo con configuración ausente o inválida.
- Provider de sesión persistente, escucha de Auth, renovación automática y lectura de completitud.
- Registro por correo y contraseña, inicio de sesión, recuperación y cierre de sesión.
- Incorporación del teléfono como cambio verificado dentro de la misma cuenta; no crea una segunda identidad.
- Formulario validado para nombre, correo, teléfono internacional, ciudad, contraseña y consentimientos.
- Reanudación del onboarding después de confirmar el correo.
- Verificación del OTP telefónico de seis dígitos.
- Selección de imagen con cámara o galería, subida al bucket privado y URL firmada temporal.
- Hidratación de los datos propios desde el servidor y edición mediante RPC protegida.
- Perfil público limitado a nombre, ciudad, avatar, reputación agregada y servicios completados.
- Activación del modo repartidor únicamente cuando el perfil está completo.
- Bloqueo explícito de encuentros y encargos mientras falten requisitos.
- Mensajes de error sanitizados para no mostrar detalles internos.
- Navegación protegida: las pantallas privadas no existen en el árbol sin sesión y el onboarding reaparece mientras el perfil esté incompleto.
- Consumo preparado de deep links PKCE o token para confirmación y recuperación.
- Restablecimiento de contraseña dentro de una sesión de recuperación.
- Cambio de teléfono con solicitud y verificación de un OTP nuevo.
- Lectura de reseñas reales, bloqueo bidireccional de visibilidad y formulario de reporte.
- Migración adicional que solo permite reseñas entre participantes de un servicio completado y recalcula la reputación en servidor.
- Los bloqueos también restringen la lectura de reseñas y avatares del perfil afectado.

## Dependencia preparada

Se declaró `expo-image-picker` en la versión incluida por Expo SDK 58. No se ejecutó un instalador y no existe todavía un lockfile validado.

## Límites pendientes

- Falta configurar un proyecto Supabase exclusivo, proveedor SMS, URLs y plantillas de correo.
- Las migraciones de Etapa 2 siguen sin aplicarse.
- No se verificaron imports, tipos, permisos nativos, subida de archivos ni navegación en ejecución.
- La lista de reseñas, bloqueo, reportes y reverificación telefónica están preparados, pero todavía no se han comprobado contra RLS/Auth reales.
- Los deep links ya tienen consumidor nativo preparado; aún necesitan URLs autorizadas y validación en una instalación real.
- No se asegura fidelidad visual final hasta revisar la aplicación en dispositivos autorizados.

La Etapa 4 (`Voy yo`) queda pendiente de una nueva confirmación.
