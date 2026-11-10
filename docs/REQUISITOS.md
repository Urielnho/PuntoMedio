# Requisitos de PuntoMedio V1

Estado actual: las Etapas 1 a 4 están preparadas en código local. RF-01 a RF-04 tienen estructura e implementación fuente; continúan sin despliegue, instalación ni validación en ejecución.

La fuente funcional principal es el [Documento técnico de desarrollo V1.0](../references/technical/PuntoMedio_Documento_Tecnico_V1.docx), de noviembre de 2026. Se trata de una propuesta técnica inicial: las decisiones comerciales, legales y de proveedores siguen sujetas a validación. El [manifiesto de referencias](../references/manifest.json) identifica la copia utilizada y su huella SHA-256.

Esta revisión implementa exclusivamente la Etapa 1 solicitada por el usuario: estructura, arquitectura, navegación, componentes visuales Midnight Violet y base de Wear OS. Una pantalla o un contrato preparado no acredita que su servicio esté integrado o funcionando.

## Prioridad de las fuentes

1. La instrucción actual del usuario fija el alcance de esta intervención y sus restricciones de ejecución.
2. El documento técnico determina requisitos, seguridad y reglas de negocio.
3. Stitch determina la apariencia de las pantallas que sí fueron exportadas.
4. Las buenas prácticas completan los detalles técnicos sin sustituir decisiones pendientes del producto.

La sección 12 del documento técnico agrupa migraciones, Auth y perfiles en su primera fase de fundamentos. La instrucción actual divide ese trabajo en etapas más pequeñas y reserva la base de datos para la Etapa 2. Por tanto, esta entrega no crea migraciones SQL, autenticación funcional ni servicios remotos, aunque formen parte del alcance posterior de V1.

## Requisitos funcionales y trazabilidad

| ID | Requisito del documento técnico | Alcance V1 | Tratamiento en la Etapa 1 |
| --- | --- | --- | --- |
| RF-01 | Registro, inicio de sesión y recuperación; bloqueo de acciones hasta completar perfil | Sí | Estructura de navegación y formularios; integración de Auth y verificación pendiente |
| RF-02 | Perfil público y reputación, edición de datos propios, reportar y bloquear | Sí | Separación de vistas públicas y privadas; estructura visual, sin reputación ni verificaciones inventadas |
| RF-03 | Crear encuentro, compartir código o invitación y elegir lugar público | Sí | Destinos y contratos reservados; creación e invitaciones pendientes |
| RF-04 | Sugerir tres puntos según distancias o tiempos aproximados | Sí | Límite funcional documentado; sin cálculo de rutas ni proveedor conectado |
| RF-05 | Publicar encargo con descripción, categoría, lugares y pago del producto | Sí | Separación del módulo de encargos; formulario y persistencia funcional pendientes |
| RF-06 | Recibir postulaciones con tarifa y seleccionar un solo repartidor | Sí | Contratos de módulos; asignación atómica en backend pendiente |
| RF-07 | Chat en tiempo real para participantes autorizados y fotografías limitadas | Sí | Destino Mensajes y separación de servicios; Realtime y Storage pendientes |
| RF-08 | Pago del producto: pagado declarado, pendiente de confirmación y no gestionado | Sí | Vocabulario y separación respecto al pago del servicio; no acredita pagos bancarios |
| RF-09 | Total de tarifa, comisión y propina opcional; pago de prueba | Sí | Integración futura delimitada; no se procesan pagos ni se fija una comisión comercial |
| RF-10 | Confirmar recogida y entrega mediante código temporal e historial | Sí | Contratos de confirmación previstos; generación y validación en backend pendientes |
| RF-11 | Notificaciones, estado y confirmaciones desde smartwatch | Sí | Estructura Kotlin/Wear OS y navegación inicial; enlace y operaciones pendientes |
| RF-12 | Calificaciones, reportes y moderación básica | Sí | Límites de acceso documentados; funciones y pantallas completas pendientes |
| RF-13 | Pagos reales y liquidaciones a repartidores | Fase posterior | Fuera de esta etapa y de los cobros de prueba de la V1 académica |

## Cuenta, perfiles y privacidad

Una persona utiliza una sola cuenta y puede actuar como solicitante o repartidor. Habilitar el rol de repartidor no debe crear una identidad distinta; requiere aceptar sus reglas adicionales.

Antes de operar encuentros o encargos, el perfil debe tener nombre visible, fotografía, teléfono verificado por OTP, correo autenticado, ciudad y aceptación de términos y aviso de privacidad. El backend deberá hacer cumplir esta condición además de las indicaciones de la interfaz. La fotografía obligatoria no constituye una verificación oficial de identidad ni una validación biométrica.

El perfil público se limita a nombre, fotografía, ciudad, reputación y cantidad de servicios completados. Teléfono completo, correo, domicilio exacto, documentos y ubicaciones privadas no se exponen públicamente. Los indicadores de verificación solo podrán reflejar hechos acreditados por sus respectivos procesos.

El participante o vendedor tendrá únicamente los permisos de su cuenta o invitación limitada. El alcance definitivo de esa invitación debe decidirse antes de implementar las confirmaciones que permita.

## Voy yo

El encuentro presencial es siempre gratuito. Su tarifa y comisión de servicio son cero.

Dos participantes autenticados acuerdan zonas aproximadas de origen sin publicar domicilios. El sistema deberá filtrar lugares públicos activos y proponer tres candidatos con estimaciones claramente identificadas. Ambos participantes aceptan el lugar elegido antes de proceder a la llegada y al cierre.

El algoritmo descrito considera el mayor tiempo individual y la diferencia entre los tiempos estimados. Un proveedor de rutas debe elegirse explícitamente; OpenStreetMap por sí solo no proporciona el servicio de cálculo de rutas. Si ese proveedor falla, la distancia geográfica puede servir como aproximación y debe mostrarse como distancia, nunca como un tiempo real de viaje.

No se afirma que los lugares estén vigilados, monitoreados o garantizados como seguros si esas condiciones no se han acreditado.

## Van por mí

El solicitante publica descripción, categoría, valor declarado, zonas de recogida y entrega y condiciones del pago del producto. Los repartidores habilitados proponen una tarifa. La comparación incluye la información pública de sus perfiles y el precio ofertado.

Solo puede existir un repartidor asignado a cada encargo. La selección y la aceptación de la oferta deberán validarse de forma atómica en el servidor para evitar asignaciones concurrentes. No bastará con deshabilitar botones o cambiar un estado en el cliente.

El pago del producto y el pago del servicio de recogida son conceptos independientes. La declaración de que el producto está pagado no es prueba bancaria y PuntoMedio no procesa ese pago al vendedor en la V1. Si está pendiente, el repartidor espera la confirmación de las partes; nunca se le solicita adelantar dinero.

## Tarifas, comisiones y propinas

Las operaciones de pago de esta V1 serán simuladas. No se almacenan tarjetas, no se configuran cobros de producción y no se custodia dinero real.

El desglose del encargo debe separar tarifa propuesta, comisión de plataforma, propina y total antes de confirmar. El 10 % citado por el documento es ilustrativo, no una tarifa comercial aprobada. La regla definitiva y sus eventuales límites deben resolverse antes de implementar el cálculo funcional.

La propina es voluntaria, admite cero y no influye en la aceptación del encargo. El modelo comercial plantea destinarla al repartidor, sujeto a costos y reglas que todavía deben validarse para producción.

La arquitectura futura podrá incorporar un proveedor de pagos para marketplaces mediante validación del servidor. La elección del proveedor, KYC, impuestos, reembolsos, contracargos, webhooks y liquidaciones quedan fuera de esta etapa.

## Mensajes, fotografías y ubicaciones

Cada conversación pertenece a un encuentro o encargo. Solo sus participantes autorizados pueden leer o escribir mensajes y acceder a fotografías o ubicaciones privadas. El botón de mensaje de un perfil público no habilita conversaciones arbitrarias ajenas a un servicio autorizado.

Las fotografías y evidencias se almacenarán en recursos privados con límites de tamaño y acceso mediante autorización y URLs firmadas cuando corresponda. Las políticas RLS y de Storage se definirán en etapas posteriores; no se consideran implementadas por disponer de tipos o pantallas.

La geolocalización requiere permiso explícito y utiliza orígenes aproximados para las propuestas de encuentro. La V1 no contempla seguimiento GPS permanente en segundo plano.

## Confirmaciones y estados

El código de autenticación telefónica y los códigos de recogida o entrega pertenecen a procesos diferentes. Stitch representa seis dígitos para el teléfono y cuatro para la entrega; esa referencia visual no sustituye la decisión de seguridad sobre el código de cada etapa del servicio.

Las confirmaciones de servicio deberán vincularse al encargo, la etapa y los participantes autorizados. Los códigos se almacenan como hash, expiran, limitan intentos y se consumen una sola vez. No deben guardarse como un PIN global del usuario ni aparecer en registros de auditoría en texto plano.

Las transiciones se validan en el backend:

- Encuentro: creado → invitado → aceptado → punto elegido → en curso → completado, con cancelación como salida alternativa.
- Encargo: publicado → postulaciones → asignado → pago de prueba confirmado → en recogida → recogido → en entrega → entregado → completado; cancelación o disputa son estados alternativos.

La interfaz comunica el estado autorizado; no puede acreditarlo por sí misma. Entrega completada requiere una confirmación válida.

## Wear OS y sincronización

El reloj usa Kotlin y Compose for Wear OS en una interfaz circular Midnight Violet. Presenta tareas activas, avisos, lugar acordado, estados, mensajes breves y acciones de llegada, recogida o entrega. Los importes son informativos y no se capturan tarjetas.

Las acciones del reloj serán intenciones autorizadas que valide el servidor, no cambios directos en el estado de una base de datos. El reloj no contiene claves de servicio de Supabase ni secretos de pagos. El mecanismo de vinculación y la sesión limitada deberán documentarse antes de integrarlos.

La sincronización funcional deberá conservar acciones pendientes, ordenar actualizaciones y utilizar identificadores idempotentes para resistir reintentos y reconexiones. Esta etapa solo prepara su separación arquitectónica y contratos; no acredita entrega de mensajes ni sincronización efectiva.

## Decisiones pendientes

- Proveedor concreto de mapas, geocodificación y rutas, ciudad piloto, atribución y cuotas.
- Reglas definitivas de tarifa y comisión; el 10 % no está aprobado como política comercial.
- Límites de valor y categorías, edad mínima, consentimiento y protocolo de incidencias.
- Permisos concretos del vendedor o de una invitación limitada.
- Proveedor SMS y costos, longitud y política de los códigos de servicio.
- Procedimiento de verificación adicional antes de operar con bienes de valor real.
- Proveedor de pagos y condiciones legales antes de cobros o liquidaciones reales.
- Alcance de Apple Watch si se solicita; la base actual corresponde a Wear OS, no a watchOS.

## Restricciones de esta entrega

No se instalan dependencias, abren Android Studio o emuladores, inician aplicaciones, compilan proyectos, ejecutan pruebas ni despliegan servicios. Tampoco se aplican migraciones remotas ni se modifican servicios de producción. No se realizan pagos reales.

La revisión estática de archivos y referencias no equivale a una compilación o prueba. Las instrucciones para comprobar el sistema pertenecen a una fase posterior que deberá autorizar el usuario. La Etapa 2 requiere confirmación expresa antes de comenzar.
