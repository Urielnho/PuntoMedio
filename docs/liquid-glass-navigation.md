# Navegación flotante translúcida

La barra inferior es un componente personalizado de 62 px. Utiliza `expo-glass-effect` cuando la API nativa está disponible y `expo-blur` como respaldo, con una superficie flotante semitransparente, borde claro sutil y sombra Midnight Violet de baja opacidad.

- iOS 26 o posterior: `GlassView` nativo con estilo `clear`.
- iOS anterior y web: desenfoque de material ultrafino.
- Android 12 o posterior: desenfoque nativo mediante `dimezisBlurViewSdk31Plus`.
- Android anterior: superficie semitransparente como degradación segura, evitando el coste de RenderScript.
- Las etiquetas permanecen visibles para accesibilidad.
- No se añaden círculos o cápsulas individuales a cada pestaña.
- El contenido de pantallas con pestañas reserva espacio inferior para que la barra flotante no lo cubra.
- La barra no utiliza el cálculo automático de altura de React Navigation, evitando que el área segura se sume dos veces.

La escala tipográfica se obtiene directamente desde `@puntomedio/design-tokens`; captions, campos y encabezados ya no mantienen tamaños duplicados localmente.

Las cinco secciones principales usan encabezados coherentes de 18 px, alineados a la izquierda y sobre el mismo fondo. Perfil no muestra una flecha de regreso cuando se abre como pestaña y su acción Guardar utiliza el tamaño compacto de encabezado.
