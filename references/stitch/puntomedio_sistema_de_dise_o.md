---
name: "PuntoMedio — Midnight Violet"
description: "Identidad visual premium, minimalista y de alta confianza para PuntoMedio (móvil y Wear OS) basada en la paleta oficial Midnight Violet."
---

## Overview

PuntoMedio redefine la coordinación de encuentros personales seguros y el servicio colaborativo de recogidas de compras y paquetería urbana. Su identidad visual oficial es **Midnight Violet**: un diseño sobrio, tecnológico, refinado y rigurosamente estructurado.

Principios rectores:
- **Elegancia funcional:** Fondo claro Cloud White (`#F7F6FA`) con superficies en blanco puro (`#FFFFFF`) y textos/acciones primarias en Midnight Violet (`#252238`).
- **Acento disciplinado:** Soft Lavender (`#9787D9`) reservado exclusivamente para micro-indicadores, estados interactivos sutiles y acentos visuales sin saturar.
- **Claridad sin artificios:** Sin degradados, sin sombras pesadas, sin desenfoques de vidrio (glassmorphism) ni ilustraciones 3D o emojis ornamentales.
- **Métricas nativas:** Pensado para implementación en React Native, TypeScript y Kotlin (Wear OS).

## Colors

Paleta cromática oficial y estricta:
- **Primary / Midnight Violet:** `#252238` — Color rector para texto principal, botones primarios, icono de marca y navegación activa.
- **Accent / Soft Lavender:** `#9787D9` — Acento visual puntual, chips secundarios y marcadores sutiles.
- **Background / Cloud White:** `#F7F6FA` — Fondo principal de pantallas móviles.
- **Surface / Pure White:** `#FFFFFF` — Tarjetas elevadas, modales y barras de navegación.
- **Secondary Text / Muted Slate:** `#858196` — Texto secundario, subtítulos y metadatos.
- **Borders:** `#E7E4EF` — Líneas divisorias y contornos discretos.
- **Success:** `#278568` — Confirmaciones, códigos verificados y transacciones exitosas.
- **Warning:** `#B77927` — Avisos y tiempos límite.
- **Error:** `#C44755` — Cancelaciones, alertas críticas y fallos.

Adaptación para Wear OS (modo oscuro de alto contraste):
- Fondo principal: `#15131F`
- Superficies: `#252238`
- Texto principal: `#FFFFFF`
- Acento: `#9787D9`
- Texto secundario: `#B5B0C4`

```yaml
colors:
  primary: "#252238"
  on-primary: "#FFFFFF"
  accent: "#9787D9"
  on-accent: "#252238"
  outline: "#E7E4EF"
  outline-strong: "#CEC9DB"
  success: "#278568"
  on-success: "#FFFFFF"
  warning: "#B77927"
  on-warning: "#1F1F1F"
  error: "#C44755"
  on-error: "#FFFFFF"
  light:
    surface: "#FFFFFF"
    on-surface: "#252238"
    surface-secondary: "#F7F6FA"
    surface-muted: "#EEEBF5"
    on-surface-variant: "#858196"
  dark:
    surface: "#252238"
    on-surface: "#FFFFFF"
    surface-secondary: "#15131F"
    surface-muted: "#312D4A"
    on-surface-variant: "#B5B0C4"
```

## Typography

Utilizamos **Inter** de Google Fonts como fuente principal con una escala calibrada para pantallas móviles y smartwatches:
- Títulos principales: 26–30 px (peso 700 / 600)
- Títulos de secciones: 18–22 px (peso 600)
- Texto general: 14–16 px (peso 400)
- Etiquetas y metadatos: 12–13 px (peso 500 / 600)

```yaml
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 38px
    letterSpacing: -0.4px
  display-lg-mobile:
    fontFamily: "Inter"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 34px
    letterSpacing: -0.3px
  headline-lg:
    fontFamily: "Inter"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.2px
  headline-md:
    fontFamily: "Inter"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: -0.1px
  title-lg:
    fontFamily: "Inter"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Inter"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-md:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  body-sm:
    fontFamily: "Inter"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
  label-lg:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0.1px
  label-md:
    fontFamily: "Inter"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: "Inter"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 14px
    letterSpacing: 0.2px
```

## Layout & Spacing

Escala métrica de base 4px/8px con márgenes limpios y generosos para crear respiración natural sin saturación de tarjetas.

```yaml
spacing:
  spacing-2xs: 4px
  spacing-xs: 8px
  spacing-sm: 12px
  spacing-md: 16px
  spacing-lg: 20px
  spacing-xl: 24px
  spacing-2xl: 32px
```

## Elevation & Depth

No se utilizan sombras difusas ni pesadas. La jerarquía se establece mediante el contraste entre `#F7F6FA` (fondo) y `#FFFFFF` (superficies), delimitadas por bordes finos de 1px en `#E7E4EF`.

## Shapes

Radios de curvatura mesurados y estrictos:
- Tarjetas y contenedores: 12px
- Botones e inputs: 10px–12px
- Badges de estado / botones circulares: radio completo (pill / circle)

```yaml
rounded:
  sm: 6px
  md: 10px
  lg: 12px
  xl: 16px
  full: 9999px
```

## Motion & Micro-interaction

Micro-interacciones secas, precisas y ágiles (100–180ms) que comunican respuesta táctil sin lentitud.

```yaml
motion:
  press:
    duration: 120ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  sheet:
    duration: 200ms
    delay: 0ms
    timingFunction: cubic-bezier(0, 0, 0.2, 1)
```

## Voice & Content Strategy

- **Transparencia económica:** Los encuentros personales son siempre gratuitos ("Servicio gratuito • Sin costo").
- **Encargos con desglose:** Tarifas claras expresadas en `$MXN`.
- **Privacidad estricta:** Números telefónicos y domicilios personales nunca se exponen públicamente. Las entregas se validan mediante código OTP de 4 dígitos.
- **Iconografía:** Lineal, geométrica, sin rellenos innecesarios ni emojis.
