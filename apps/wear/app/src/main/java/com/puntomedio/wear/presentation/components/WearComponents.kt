package com.puntomedio.wear.presentation.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.wear.compose.material3.Button
import androidx.wear.compose.material3.ButtonDefaults
import androidx.wear.compose.material3.Text
import com.puntomedio.wear.design.PuntoMedioColors
import com.puntomedio.wear.design.PuntoMedioDimensions
import com.puntomedio.wear.design.PuntoMedioType

@Composable
fun InfoCard(title: String, description: String) {
    Column(
        modifier = Modifier.fillMaxWidth().padding(
            horizontal = PuntoMedioDimensions.Small,
            vertical = PuntoMedioDimensions.Medium,
        ),
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Text(title, style = PuntoMedioType.Label, color = PuntoMedioColors.Text)
        Text(description, style = PuntoMedioType.Body, color = PuntoMedioColors.Secondary)
    }
}

@Composable
fun NavigationButton(label: String, onClick: () -> Unit, enabled: Boolean = true, primary: Boolean = false) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = Modifier.fillMaxWidth().heightIn(min = PuntoMedioDimensions.TouchTarget),
        colors = ButtonDefaults.buttonColors(
            containerColor = if (primary) PuntoMedioColors.Accent else PuntoMedioColors.Surface,
            contentColor = if (primary) PuntoMedioColors.Background else PuntoMedioColors.Text,
        ),
    ) {
        Text(label, style = PuntoMedioType.Label, textAlign = TextAlign.Center)
    }
}

@Composable
fun SecondaryText(text: String) {
    Text(
        text = text,
        color = PuntoMedioColors.Secondary,
        style = PuntoMedioType.Caption,
        textAlign = TextAlign.Center,
        modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp),
    )
}
