package com.puntomedio.wear.design

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material3.ColorScheme
import androidx.wear.compose.material3.MaterialTheme
import androidx.wear.compose.material3.Typography

object PuntoMedioColors {
    val Background = Color(0xFF15131F)
    val Surface = Color(0xFF252238)
    val Accent = Color(0xFF9787D9)
    val Text = Color(0xFFFFFFFF)
    val Secondary = Color(0xFFB5B0C4)
    val Border = Color(0xFF312D4A)
    val Error = Color(0xFFC44755)
}

object PuntoMedioDimensions {
    val Small = 8.dp
    val Medium = 12.dp
    val Large = 16.dp
    val TouchTarget = 52.dp
    val CardRadius = 12.dp
}

object PuntoMedioType {
    // Native sans-serif is the permitted compatible fallback until Inter is packaged for Wear.
    val Title = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 18.sp,
        lineHeight = 24.sp, fontWeight = FontWeight.SemiBold)
    val Body = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 14.sp,
        lineHeight = 20.sp)
    val Label = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 13.sp,
        lineHeight = 18.sp, fontWeight = FontWeight.Medium)
    val Caption = TextStyle(fontFamily = FontFamily.SansSerif, fontSize = 11.sp,
        lineHeight = 15.sp)
}

private val MidnightViolet = ColorScheme(
    primary = PuntoMedioColors.Accent,
    primaryDim = PuntoMedioColors.Accent,
    primaryContainer = PuntoMedioColors.Surface,
    onPrimary = PuntoMedioColors.Background,
    onPrimaryContainer = PuntoMedioColors.Text,
    secondary = PuntoMedioColors.Text,
    secondaryContainer = PuntoMedioColors.Surface,
    onSecondaryContainer = PuntoMedioColors.Text,
    surfaceContainerLow = PuntoMedioColors.Surface,
    surfaceContainer = PuntoMedioColors.Surface,
    surfaceContainerHigh = PuntoMedioColors.Surface,
    onSurface = PuntoMedioColors.Text,
    onSurfaceVariant = PuntoMedioColors.Secondary,
    background = PuntoMedioColors.Background,
    onBackground = PuntoMedioColors.Text,
    error = PuntoMedioColors.Error,
)

@Composable
fun PuntoMedioTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = MidnightViolet,
        typography = Typography(
            titleMedium = PuntoMedioType.Title,
            bodyMedium = PuntoMedioType.Body,
            labelMedium = PuntoMedioType.Label,
        ),
        content = content,
    )
}
