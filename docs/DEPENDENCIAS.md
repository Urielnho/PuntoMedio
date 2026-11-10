# Dependencias declaradas

Las versiones se prepararon manualmente a partir de metadatos públicos consultados el 7 de noviembre de 2026. **No se instalaron ni resolvieron dependencias.** No hay lockfile generado y no se verificó compatibilidad mediante compilación, tipos o ejecución.

## Móvil

| Grupo | Versiones declaradas |
| --- | --- |
| Base oficial de Expo | Expo 58.0.23, React 19.3.0, React Native 0.88.1 |
| TypeScript | TypeScript 6.0.3 y tipos de React 19.3.0 |
| Navegación | native 7.5.1, native-stack 7.21.0, bottom-tabs 7.21.0 |
| Módulos compatibles indicados por Expo | screens 4.30.1, safe-area-context 5.11.1, font 58.0.11, status-bar 58.0.4, SVG 15.16.0 |
| Tipografía | Inter de expo-google-fonts 0.4.2 |
| Iconografía nativa | lucide-react-native 1.70.0 |

Las versiones base corresponden a los metadatos de `expo-template-blank-typescript` 58.0.32; no se ejecutó ese generador. Los módulos nativos se contrastaron con `expo@58.0.23/bundledNativeModules.json`. El proyecto declara los paquetes y su configuración, sin descargarlos.

El rango de Node declarado sigue los metadatos de React Native y Expo: 22.13 o superior dentro de 22.x, 24.3 o superior dentro de 24.x, o 26 en adelante. Su instalación tampoco se ha realizado como parte de esta etapa.

Se eligió SDK 58 para preparar futuros development builds y el puente nativo Wear. La documentación actual advierte de una transición entre SDK 57 y 58 en Expo Go; la compatibilidad de una instalación concreta debe revisarse antes de la fase de ejecución. No se considera Expo Go una implementación del puente de PuntoMedio.

Los tokens de Material Symbols del HTML se adaptan a iconografía lineal nativa. No se cargan Tailwind ni fuentes de iconos web desde los HTML. Inter se declara para recursos empaquetados mediante su dependencia; se incluye una fuente del sistema como respaldo.

## Wear OS

AGP 8.13.0, Kotlin 2.2.10, Gradle 8.13, JDK 17, compile/target SDK 36, min SDK 30, Compose BOM 2025.08.00 y Wear Compose Material 3/Foundation/Navigation 1.5.0.

El wrapper genérico se copió sin ejecutar ni descargar una distribución. Su distribución queda fijada con SHA-256. No se reutilizaron configuración privada ni código de negocio del proyecto anterior.

## Integraciones diferidas

No se añade en esta fase un cliente activo de Supabase, SDK de mapas, cámara, pagos, mensajería o notificaciones. Su configuración y selección corresponden a las etapas autorizadas. El registro de estas dependencias no equivale a declarar resueltos sus permisos, seguridad ni disponibilidad.

## Fuentes técnicas consultadas

- [Creación de proyectos Expo](https://docs.expo.dev/get-started/create-a-project/).
- [Plantilla TypeScript de Expo en el registro](https://registry.npmjs.org/expo-template-blank-typescript/58.0.32).
- [Módulos nativos de Expo 58.0.23](https://unpkg.com/expo@58.0.23/bundledNativeModules.json).
- [React Navigation](https://reactnavigation.org/docs/getting-started/).
- [Compose para Wear OS](https://developer.android.com/training/wearables/compose).
- [Expo development builds y módulos nativos](https://docs.expo.dev/develop/development-builds/introduction/).
- [Supabase con Expo React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native).
- [Changelog de Supabase](https://supabase.com/changelog.md).

La lectura del changelog identificó cambios recientes de CLI v3 y Flutter v3. No se utiliza ninguna CLI ni SDK Flutter en esta entrega y no se hicieron operaciones contra un proyecto alojado.
