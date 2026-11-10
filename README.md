# PuntoMedio V1.0

> Estado actualizado — 7 de noviembre de 2026: el backend de PuntoMedio está
> enlazado y desplegado en su proyecto Supabase independiente. Las nueve
> migraciones remotas incluyen Auth, perfiles, RLS, Storage, `Voy yo`, `Van por
> mí`, reputación y endurecimiento de RPC. El lint de esquema y los asesores de
> nivel error no reportan problemas. Aún faltan las pruebas funcionales con dos
> cuentas reales y las integraciones señaladas en la documentación de etapas.

La Etapa 2 está preparada localmente con migraciones Supabase, RLS, Storage, Auth y adaptadores, sin despliegue ni ejecución. Consulta [docs/ETAPA-2.md](docs/ETAPA-2.md).

La Etapa 3 añade los flujos preparados de autenticación, verificación telefónica, fotografía y perfiles. Consulta [docs/ETAPA-3.md](docs/ETAPA-3.md).

La Etapa 4 prepara el flujo gratuito `Voy yo`, con invitación, puntos públicos, aceptación conjunta, llegada, cierre e historial. Consulta [docs/ETAPA-4.md](docs/ETAPA-4.md).

La Etapa 5 prepara `Van por mí`: publicación de encargos reales, ofertas, selección atómica de un repartidor y entrega con códigos privados. Consulta [docs/ETAPA-5.md](docs/ETAPA-5.md).

Base de una aplicación móvil y Wear OS para coordinar encuentros gratuitos y encargos de recogida y entrega. Esta entrega contiene exclusivamente la **Etapa 1: arquitectura, estructura, navegación y sistema visual Midnight Violet**.

Se escribió el código y se revisaron los archivos estáticamente. **No se instalaron dependencias, no se inició ninguna aplicación, no se compiló y no se ejecutaron pruebas.** La compatibilidad y el comportamiento en dispositivos siguen pendientes de comprobar cuando el usuario lo autorice.

## Contenido

| Ruta | Responsabilidad |
| --- | --- |
| `apps/mobile` | Expo, React Native y TypeScript estricto; navegación y adaptación nativa de los siete diseños móviles |
| `apps/wear` | Proyecto Kotlin y Compose for Wear OS; estructura inicial circular, oscura y sin conexión |
| `packages/design-tokens` | Colores, espaciados, radios, tipografía y movimiento Midnight Violet |
| `packages/contracts` | Tipos públicos, separación de datos privados y protocolo preliminar móvil–reloj |
| `references` | Documento técnico y exportación original de Stitch; manifiesto SHA-256 |
| `docs` | Arquitectura, requisitos, pantallas, decisiones y trabajo pendiente |

PuntoMedio tiene una carpeta independiente. No utiliza el backend, los datos ni las credenciales de MatchControl.

## Lo preparado

La navegación móvil conserva las pestañas **Inicio, Explorar, Actividad, Mensajes y Perfil**. Las pantallas de bienvenida, registro, verificación de teléfono, fotografía, inicio, perfil público y configuración adaptan la referencia de Stitch a componentes nativos reutilizables. Los estados vacíos y las estructuras ausentes se identifican en la documentación como adaptaciones pendientes de aprobación.

Los controles de acceso, cámara, guardado, pago y confirmación de servicios no realizan operaciones. La navegación de diseño no crea una sesión ni acredita un perfil completo. No se precargan personas, reputaciones, reseñas, códigos ni servicios de ejemplo como si fueran datos del usuario.

La estructura Wear usa el mismo identificador de aplicación previsto para el móvil, una interfaz circular y contratos que excluyen contraseñas, tokens y coordenadas privadas. La autenticación y el transporte todavía no están implementados.

## Reglas del producto

- **Voy yo:** encuentro gratuito y aceptación del lugar por ambos participantes.
- **Van por mí:** ofertas de repartidores y asignación única autorizadas por RPC; requiere aplicar las migraciones en un proyecto Supabase independiente.
- El pago del producto ocurre entre comprador y vendedor; es independiente del pago del servicio.
- Los pagos de la V1 serán simulados. El 10 % mencionado en el documento es ilustrativo, no una comisión comercial configurada.
- Un perfil operativo requiere nombre, fotografía, ciudad, correo autenticado, teléfono verificado y aceptación de términos y privacidad.
- Una fotografía no acredita identidad oficial ni biometría.

## Preparación e instalación futura

Las dependencias están declaradas manualmente. No se generó un archivo de bloqueo ni se descargaron paquetes. Las instrucciones que contienen los README de cada aplicación están destinadas a una fase posterior y **requieren autorización antes de ejecutarse**.

La futura configuración pública de Supabase se prepara mediante variables vacías en `apps/mobile/.env.example`. No hay proyecto remoto enlazado. Las claves administrativas, de pagos y de proveedores no deben aparecer en `EXPO_PUBLIC_*`, archivos públicos, el móvil ni el reloj.

La sincronización Wear mediante un módulo nativo necesitará un development build de Expo; no debe suponerse que Expo Go incorpora un puente Data Layer específico de PuntoMedio. Se revisará en la etapa de integración.

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md).
- [Análisis de Stitch](docs/STITCH.md).
- [Requisitos y alcance](docs/REQUISITOS.md).
- [Entidades y privacidad](docs/MODELO-DATOS.md).
- [Integraciones y decisiones pendientes](docs/INTEGRACIONES.md).
- [Dependencias declaradas](docs/DEPENDENCIAS.md).
- [Estado de la Etapa 1](docs/ETAPA-1.md).
- [Lista de archivos](docs/ARCHIVOS-ETAPA-1.md).

La Etapa 2, base de datos y Supabase, queda pendiente de autorización.
