# Referencia visual de PuntoMedio

La exportación de Google Stitch define la apariencia de las pantallas móviles disponibles. El documento técnico determina sus permisos, datos y comportamiento. La Etapa 1 adapta la composición a componentes nativos y deja documentadas las pantallas que aún no tienen diseño.

Se inspeccionó estáticamente la carpeta proporcionada por el usuario, sin abrir los HTML en un navegador ni ejecutar sus scripts. La exportación contiene siete archivos HTML y un documento de sistema de diseño. No incluye capturas PNG, archivos SVG, fotografías, fuentes locales ni recursos binarios de iconografía.

Las copias de referencia están en [references/stitch](../references/stitch/). El [manifiesto de referencias](../references/manifest.json) registra las rutas y las huellas SHA-256. Los archivos exportados son material de consulta; no forman parte de la aplicación ejecutable.

## Pantallas disponibles

| Pantalla | Archivo de referencia | Composición identificada |
| --- | --- | --- |
| Bienvenida e inicio de sesión | [code.html](../references/stitch/puntomedio_bienvenida_e_inicio_de_sesi_n/code.html) | Marca PM, presentación, tarjetas Voy yo y Van por mí, correo, contraseña, recuperación y enlace al registro |
| Registro | [code.html](../references/stitch/puntomedio_registro/code.html) | Paso 1 de 3; nombre y apellidos, correo, teléfono con prefijo +52, contraseña y continuación |
| Verificación de teléfono | [code.html](../references/stitch/puntomedio_verificaci_n_otp/code.html) | Paso 2 de 3; seis casillas para SMS, cambio de número, cuenta atrás y reenvío |
| Fotografía de perfil | [code.html](../references/stitch/puntomedio_foto_de_perfil/code.html) | Paso 3 de 3; marco circular, cámara, galería, criterios de fotografía y finalización |
| Inicio | [code.html](../references/stitch/puntomedio_inicio/code.html) | Cabecera con ciudad y notificaciones, saludo, dos servicios principales, actividad en curso, resumen de seguridad y navegación inferior |
| Perfil público | [code.html](../references/stitch/puntomedio_perfil_p_blico/code.html) | Avatar, nombre, ciudad, rol, reputación, servicios, puntualidad, validaciones, reseñas y acción de mensaje |
| Editar perfil y configuración | [code.html](../references/stitch/puntomedio_editar_perfil_y_configuraci_n/code.html) | Datos propios, fotografía, zona habitual, modo repartidor, preferencias, vínculo con Wear OS y cierre de sesión |

El sistema visual se describe en [puntomedio_sistema_de_dise_o.md](../references/stitch/puntomedio_sistema_de_dise_o.md).

## Navegación

La barra inferior de Inicio y de Ajustes contiene exactamente estas cinco secciones, en este orden:

1. Inicio.
2. Explorar.
3. Actividad.
4. Mensajes.
5. Perfil.

El recorrido de alta ilustrado es Bienvenida → Registro → Verificación telefónica → Fotografía. El diseño no representa la verificación de correo, la recuperación completa de contraseña ni todos los datos necesarios para completar el perfil. La navegación nativa debe reservar esos destinos y distinguirlos de las operaciones reales de autenticación.

Los enlaces del HTML usan `href="#"` y los botones no tienen lógica de negocio ni navegación implementada. No constituyen contratos de API ni estados persistidos.

## Colores

Los colores principales de la exportación coinciden con los tokens obligatorios del encargo.

| Uso móvil | Valor |
| --- | --- |
| Primario y texto principal | `#252238` |
| Acento | `#9787D9` |
| Fondo | `#F7F6FA` |
| Superficie | `#FFFFFF` |
| Texto secundario | `#858196` |
| Bordes | `#E7E4EF` |
| Éxito | `#278568` |
| Advertencia | `#B77927` |
| Error | `#C44755` |

| Uso Wear OS | Valor |
| --- | --- |
| Fondo | `#15131F` |
| Superficie | `#252238` |
| Texto principal | `#FFFFFF` |
| Acento | `#9787D9` |
| Texto secundario | `#B5B0C4` |

La exportación añade contorno fuerte `#CEC9DB`, superficie clara atenuada `#EEEBF5`, superficie oscura atenuada `#312D4A` y color web de interacción `#34304E`. Estos complementan la paleta; no sustituyen sus colores obligatorios.

## Tipografía y medidas

Inter es la familia de referencia y se solicita externamente con los pesos 400, 500, 600 y 700. Material Symbols Outlined aporta los glifos lineales. Ambos recursos se enlazan desde Google Fonts; no hay archivos de fuente dentro de la exportación. Tailwind se obtiene desde un CDN y solo corresponde al prototipo web.

| Estilo | Tamaño / interlineado | Peso |
| --- | --- | --- |
| Display principal | 30 / 38 | 700 |
| Display móvil | 26 / 34 | 700 |
| Encabezado grande | 22 / 28 | 600 |
| Encabezado mediano | 18 / 24 | 600 |
| Título | 16 / 22 | 600 |
| Cuerpo grande | 16 / 24 | 400 |
| Cuerpo mediano | 14 / 20 | 400 |
| Cuerpo pequeño | 13 / 18 | 400 |
| Etiqueta grande | 14 / 18 | 600 |
| Etiqueta mediana | 12 / 16 | 600 |
| Etiqueta pequeña | 11 / 14 | 500 |

La escala de espacios es 4, 8, 12, 16, 20, 24 y 32. Los radios definidos son 6, 10, 12 y 16, además de círculo o píldora. La respuesta de pulsación se especifica en 120 ms y la apertura de paneles en 200 ms. La jerarquía se apoya en superficies y bordes, sin degradados ni sombras pesadas.

El HTML utiliza un contenedor de ancho completo con máximo de 430 px y altura mínima de 884 px. Estas cifras describen el lienzo web, no dimensiones rígidas para el dispositivo. La adaptación nativa necesita áreas seguras, desplazamiento, soporte de teclado, tamaños de texto accesibles y distribución circular específica en Wear OS. Algunas clases `text-title-md` del HTML no tienen un token definido; se deben resolver con la escala documentada.

## Componentes reutilizables

- Cabecera de marca o cabecera contextual con retorno y acción.
- Campo etiquetado, campo de contraseña, casillas de código y mensajes asociados.
- Botón principal, botón secundario, botón de icono y enlace de texto.
- Tarjeta de servicio, tarjeta de actividad, fila de ajuste y separador.
- Avatar circular, marco para fotografía, indicador de estado y distintivo de gratuidad.
- Estadística de reputación y tarjeta de reseña, siempre basadas en datos disponibles.
- Barra de cinco secciones y componentes de estado vacío, carga o error para las adaptaciones faltantes.

## Estados representados y faltantes

El material muestra un registro vacío, un inicio de sesión con valores de ejemplo, un código telefónico parcialmente introducido, una cuenta atrás de reenvío, ausencia de fotografía, perfil completo, modo repartidor activado y actividad en curso. También representa el reloj como conectado, pero no demuestra un enlace real.

No hay diseños completos para errores de campo o servidor, carga, permisos denegados, código incorrecto o caducado, sesión vencida, falta de conexión, perfil incompleto ni listas vacías. La apariencia de foco y de interacción web tampoco equivale a un comportamiento nativo ya comprobado.

## Diferencias que requieren adaptar el contenido

| Referencia visual | Regla que prevalece |
| --- | --- |
| Alta con nombre, correo, teléfono y contraseña | Añadir ciudad, aceptación explícita de términos y aviso de privacidad, y verificación de correo al contrato de perfil completo |
| SMS de seis dígitos y código de entrega de cuatro | Son contextos separados: autenticación telefónica y confirmación de un servicio. La longitud del código de servicio debe confirmarse con su diseño de seguridad |
| Distintivos de INE/pasaporte y fotografía biométrica verificados | La fotografía no acredita identidad. No afirmar verificación oficial o biométrica sin el procedimiento correspondiente |
| Custodia activa y puntos públicos monitoreados | La V1 utiliza pagos simulados y lugares públicos sugeridos. No afirmar custodia de fondos, vigilancia ni garantías no implementadas |
| Métodos de pago guardados | No almacenar tarjetas ni aparentar una integración de cobros de producción |
| Seguridad y PIN de entrega | No utilizar un PIN general reutilizable: las confirmaciones se vinculan a un encargo y a su etapa |
| Enviar mensaje directo desde el perfil público | El chat se restringe a participantes autorizados de un encuentro o encargo |
| Valores de reputación, usuarios, OTP, tarifas, plazos y estados precargados | Son ejemplos del diseño. La estructura inicial no debe presentarlos como actividad ni verificaciones reales del usuario |
| Estado Conectado del reloj | Dependerá del estado observado del enlace; la Etapa 1 no declara sincronización operativa |

El perfil público exportado indica correctamente que teléfono, correo y domicilio están ocultos. Los datos de contacto completos de la pantalla de edición pertenecen a la vista privada del propietario y no deben reutilizarse en el perfil público.

## Pantallas pendientes de diseño

No se exportaron las vistas de Explorar, Actividad y Mensajes, ni los flujos completos de encuentro, mapas, selección de puntos, invitaciones, encargos, postulaciones, chat, pago de prueba, propinas, notificaciones, historial o moderación. Tampoco se exportó ninguna pantalla Wear OS.

En la Etapa 1 solo se preparan las estructuras y destinos necesarios. Las adaptaciones sin referencia se identifican como pendientes de aprobación visual; no se atribuyen a Stitch. La implementación funcional y la comprobación de estas pantallas corresponden a etapas posteriores autorizadas por el usuario.
