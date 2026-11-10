# PuntoMedio V1.0 — Desarrollo de aplicación móvil y smartwatch

Actúa como un **ingeniero de software senior y arquitecto de software**, especializado en React Native, TypeScript, Kotlin, Wear OS, Supabase, sistemas de geolocalización, marketplaces y aplicaciones móviles comerciales.

Vamos a comenzar el desarrollo de **PuntoMedio V1.0**, una plataforma que conecta personas para coordinar encuentros y contratar servicios de recogida y entrega de productos.

El proyecto cuenta con dos referencias principales:

1. **Documento Técnico PuntoMedio V1.0:** contiene los requisitos, arquitectura, tecnologías, funcionalidades, reglas de negocio y alcance.
2. **Diseño exportado de Google Stitch:** contiene las interfaces, componentes, estilos y referencias visuales de la aplicación.

Ambos recursos deben analizarse antes de comenzar.

## 1. Objetivo principal

Desarrollar progresivamente PuntoMedio como un producto comercial real, compuesto por:

- Aplicación móvil en React Native y TypeScript.
- Aplicación para smartwatch con Kotlin y Wear OS.
- Backend con Supabase.
- Base de datos PostgreSQL.
- Autenticación y perfiles públicos.
- Geolocalización y puntos de encuentro.
- Sistema de encargos y postulaciones.
- Chat en tiempo real.
- Pagos, comisiones y propinas.
- Sincronización entre móvil, reloj y backend.

El objetivo de esta fase es implementar el código fuente y la estructura del sistema, no comprobar todavía su funcionamiento.

## 2. Referencias y prioridades

Respeta este orden:

**Primero: Documento técnico**

Es la fuente principal para definir funcionalidades, requisitos, seguridad, arquitectura y reglas de negocio.

**Segundo: Diseño de Google Stitch**

Es la referencia principal para implementar la interfaz visual y la experiencia de usuario.

**Tercero: Buenas prácticas de ingeniería**

Aplica principios de arquitectura modular, seguridad, tipado estricto, reutilización de componentes y separación de responsabilidades.

Si el diseño y el documento técnico presentan diferencias, identifica el conflicto y prioriza los requisitos funcionales y de seguridad del documento.

No inventes funcionalidades ni modifiques decisiones importantes sin justificarlo.

## 3. Integración del diseño de Google Stitch

El diseño exportado fue creado específicamente para PuntoMedio utilizando la identidad visual **Midnight Violet**.

Debes inspeccionar los archivos incluidos en el ZIP y determinar:

- Qué pantallas están disponibles.
- Qué componentes pueden reutilizarse.
- Qué recursos gráficos existen.
- Qué tipografías se utilizan.
- Qué colores y estilos están definidos.
- Cómo está organizada la navegación.
- Qué estados visuales se encuentran representados.
- Qué pantallas o estados faltan.

**No asumas que el ZIP contiene todas las pantallas ni que el código exportado es directamente compatible con React Native.**

Adapta el diseño a componentes nativos, respetando su apariencia y comportamiento.

### Identidad visual obligatoria

Utiliza estos tokens:

- Primary / Midnight Violet: `#252238`
- Accent / Soft Lavender: `#9787D9`
- Background / Cloud White: `#F7F6FA`
- Surface / Pure White: `#FFFFFF`
- Primary Text: `#252238`
- Secondary Text: `#858196`
- Borders: `#E7E4EF`
- Success: `#278568`
- Warning: `#B77927`
- Error: `#C44755`

Para Wear OS:

- Background: `#15131F`
- Surface: `#252238`
- Primary Text: `#FFFFFF`
- Accent: `#9787D9`
- Secondary Text: `#B5B0C4`

### Reglas visuales

- Interfaz minimalista, moderna y profesional.
- Modo claro como apariencia principal en móvil.
- Diseño oscuro adaptado para smartwatch.
- Tipografía Inter o equivalente compatible.
- Componentes reutilizables.
- Bordes moderadamente redondeados.
- Espaciado consistente.
- Iconografía lineal.
- Sin degradados innecesarios.
- Sin glassmorphism.
- Sin sombras exageradas.
- Sin ilustraciones decorativas.
- Sin elementos visuales genéricos que no aporten funcionalidad.

No rediseñes arbitrariamente las pantallas creadas en Stitch.

Si una pantalla todavía no está diseñada, implementa una estructura visual consistente con el sistema de diseño existente y documenta que se trata de una adaptación pendiente de aprobación.

## 4. Arquitectura y organización

Define una arquitectura modular que permita mantener separados:

- Pantallas.
- Componentes visuales.
- Navegación.
- Modelos y tipos.
- Servicios.
- Hooks.
- Validaciones.
- Gestión de estados.
- Integraciones externas.
- Lógica de negocio.
- Configuración de Supabase.
- Aplicación Wear OS.

Utiliza TypeScript estricto.

No concentres toda la lógica en componentes visuales ni crees archivos excesivamente grandes.

Mantén las reglas de negocio sensibles en el backend, no exclusivamente en la aplicación móvil.

## 5. Etapas de desarrollo

### Etapa 1 — Análisis y estructura inicial

- Leer el documento técnico completo.
- Inspeccionar todos los archivos exportados de Stitch.
- Revisar la estructura actual del repositorio.
- Identificar pantallas disponibles y faltantes.
- Definir arquitectura y estructura de carpetas.
- Preparar configuración inicial de React Native.
- Crear tokens visuales Midnight Violet.
- Preparar componentes reutilizables.
- Configurar navegación principal.
- Crear una estructura inicial para Wear OS.

No ejecutes todavía ninguna aplicación.

### Etapa 2 — Base de datos y Supabase

- Diseñar tablas y relaciones.
- Crear migraciones SQL.
- Definir restricciones.
- Preparar políticas RLS.
- Configurar autenticación.
- Preparar almacenamiento de fotografías.
- Definir servicios de acceso a datos.
- Diseñar permisos según roles.

No ejecutes migraciones sobre bases de datos remotas sin autorización.

### Etapa 3 — Autenticación y perfiles

- Registro e inicio de sesión.
- Verificación telefónica.
- Fotografía obligatoria.
- Datos personales requeridos.
- Edición de perfil.
- Perfil público.
- Calificaciones y reputación.
- Protección de datos privados.

El acceso a funciones de encuentros y encargos debe requerir un perfil completo.

### Etapa 4 — Encuentros gratuitos

Implementa el flujo **Voy yo**:

- Crear encuentro.
- Invitar participante.
- Seleccionar ubicaciones.
- Calcular puntos convenientes.
- Mostrar lugares públicos sugeridos.
- Confirmar lugar.
- Registrar llegada.
- Finalizar encuentro.
- Guardar historial.

No se cobrará ninguna tarifa por este servicio.

### Etapa 5 — Encargos y repartidores

Implementa el flujo **Van por mí**:

- Crear solicitud.
- Información del producto.
- Ubicaciones.
- Estado de pago del producto.
- Publicación de encargos.
- Postulaciones.
- Tarifas propuestas.
- Comparación de repartidores.
- Selección de repartidor.
- Estados de recogida y entrega.
- Confirmaciones mediante códigos.

### Etapa 6 — Chat en tiempo real

- Conversaciones relacionadas con servicios.
- Mensajes en tiempo real.
- Fotografías.
- Estados de mensajes.
- Control de acceso.
- Historial.
- Notificaciones.

Utiliza Supabase Realtime y Storage cuando corresponda.

### Etapa 7 — Pagos, comisiones y propinas

Prepara:

- Cálculo de tarifas.
- Comisión de PuntoMedio.
- Propinas voluntarias.
- Desglose del total.
- Estados de pago.
- Historial de operaciones.
- Resumen de ganancias.
- Interfaces para métodos de pago.

**IMPORTANTE:** durante esta fase los pagos serán simulados.

No realices transacciones financieras reales ni configures cobros de producción.

Diseña una arquitectura que permita integrar posteriormente un proveedor de pagos para marketplaces, con validación del lado del servidor.

Distingue claramente el pago del producto adquirido y el pago del servicio de recogida.

### Etapa 8 — Smartwatch con Wear OS

Implementa la estructura y las pantallas para:

- Inicio.
- Encuentros activos.
- Solicitudes de encargos.
- Notificaciones.
- Detalles de servicio.
- Confirmación de llegada.
- Confirmación de recogida.
- Confirmación de entrega.
- Mensajes y actualizaciones.
- Resumen de ganancias.

Respeta el diseño Midnight Violet para relojes circulares.

No intentes replicar todas las funciones de la aplicación móvil.

Define claramente cómo se autentica y sincroniza el reloj, evitando almacenar secretos sensibles.

### Etapa 9 — Integración del código

- Unificar módulos.
- Revisar interfaces y contratos.
- Revisar referencias y dependencias.
- Organizar configuraciones.
- Documentar integraciones externas.
- Preparar instrucciones de instalación.
- Registrar funcionalidades pendientes de comprobar.

No ejecutes compilaciones ni pruebas.

## 6. Restricciones obligatorias

Durante esta fase tienes prohibido:

- Abrir Android Studio.
- Ejecutar emuladores.
- Iniciar la aplicación.
- Compilar proyectos.
- Ejecutar pruebas unitarias.
- Ejecutar pruebas de integración.
- Ejecutar pruebas E2E.
- Instalar aplicaciones en dispositivos.
- Desplegar servicios.
- Ejecutar migraciones remotas.
- Procesar pagos reales.
- Modificar servicios de producción.
- Declarar que el sistema funciona sin haberlo comprobado.

Puedes crear archivos, escribir código, preparar configuraciones, revisar documentación e inspeccionar estáticamente el proyecto.

No ejecutes comandos de instalación de dependencias sin autorización si modifican el entorno.

## 7. Método de trabajo

**No desarrolles toda la aplicación en una sola intervención.**

Trabaja por etapas y cambios pequeños.

Antes de implementar:

1. Analiza los recursos disponibles.
2. Identifica los requisitos.
3. Revisa los archivos del proyecto.
4. Presenta la arquitectura propuesta.
5. Explica el plan de implementación.
6. Identifica dependencias y posibles conflictos.

Después comienza la Etapa 1.

Al terminar cada etapa:

- Indica qué implementaste.
- Enumera los archivos creados o modificados.
- Explica las decisiones técnicas relevantes.
- Señala qué falta.
- Identifica riesgos que deberán comprobarse posteriormente.

Continúa con la siguiente etapa únicamente cuando yo confirme que podemos avanzar.

## 8. Documentación

Mantén documentación clara y actualizada:

- README del proyecto.
- Arquitectura.
- Estructura de carpetas.
- Configuración de variables de entorno.
- Modelo de datos.
- Integraciones externas.
- Funcionalidades implementadas.
- Funcionalidades pendientes.
- Limitaciones conocidas.

No incluyas credenciales privadas, contraseñas, tokens secretos ni datos sensibles en el código fuente.

## 9. Criterios de calidad

Quiero que el proyecto tenga una estructura profesional desde el principio.

Prioriza:

- Código limpio.
- Arquitectura mantenible.
- Seguridad.
- Validaciones.
- Manejo de errores.
- Componentes reutilizables.
- Buenas prácticas de React Native y Kotlin.
- Diseño consistente.
- Separación de responsabilidades.
- Tipado estricto.
- Escalabilidad razonable.

No agregues complejidad innecesaria.

## 10. Instrucción final

**Comienza analizando el Documento Técnico PuntoMedio V1.0 y los archivos exportados de Google Stitch.**

Presenta un resumen de la arquitectura, las pantallas identificadas, los requisitos y el plan de desarrollo.

Después implementa exclusivamente la **Etapa 1: arquitectura, estructura inicial, navegación y sistema visual Midnight Violet**.

Cuando termines, detente y explícame qué archivos creaste, qué decisiones tomaste y qué queda pendiente.

No avances a la Etapa 2 hasta que yo lo autorice.

**Recuerda: primero construiremos el código cuidadosamente. La compilación, ejecución y todas las pruebas se realizarán en una fase posterior, cuando yo lo indique expresamente.**