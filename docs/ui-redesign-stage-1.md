# Rediseño UI/UX — Etapa 1

## Alcance

Esta etapa modifica únicamente presentación de inicio, encabezado y navegación principal. No cambia rutas, autenticación, servicios, contratos, base de datos ni lógica de negocio.

## Decisiones

- El inicio pasa de una composición de tarjetas informativas a un centro de acciones.
- Se elimina el saludo personal, la explicación introductoria, badges, CTA duplicados, bloque de seguridad y botón redundante de perfil.
- `Voy yo` y `Van por mí` conservan sus destinos y se expresan como acciones compactas con una sola descripción.
- La actividad vacía se representa mediante una línea discreta, sin ilustración ni contenedor.
- El encabezado utiliza la identidad gráfica de PuntoMedio, notificaciones y avatar. El avatar no duplica la navegación hacia Perfil.
- La barra inferior conserva cinco secciones, con iconografía lineal, escala fija y estado activo basado en color y peso de trazo.
- `Screen` admite un encabezado plano para que el inicio no añada una franja blanca ni un separador innecesario.

## Pendiente para etapas posteriores

Autenticación, perfiles, encuentros, encargos, chat, pagos y Wear OS permanecen fuera de esta etapa.
