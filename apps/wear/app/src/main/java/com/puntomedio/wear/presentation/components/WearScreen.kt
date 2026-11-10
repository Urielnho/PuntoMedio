package com.puntomedio.wear.presentation.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.wear.compose.foundation.lazy.TransformingLazyColumn
import androidx.wear.compose.foundation.lazy.TransformingLazyColumnScope
import androidx.wear.compose.foundation.lazy.rememberTransformingLazyColumnState
import androidx.wear.compose.material3.ScreenScaffold
import androidx.wear.compose.material3.Text
import com.puntomedio.wear.design.PuntoMedioColors
import com.puntomedio.wear.design.PuntoMedioDimensions
import com.puntomedio.wear.design.PuntoMedioType

@Composable
fun WearScreen(
    title: String,
    content: TransformingLazyColumnScope.() -> Unit,
) {
    val configuration = LocalConfiguration.current
    val density = LocalDensity.current
    val sidePadding = (configuration.screenWidthDp *
        if (configuration.isScreenRound) 0.12f else 0.08f).dp
    val initialOffset = with(density) { (configuration.screenHeightDp.dp / 2).roundToPx() }
    val scrollState = rememberTransformingLazyColumnState(
        initialAnchorItemScrollOffset = initialOffset,
    )
    ScreenScaffold(
        scrollState = scrollState,
        contentPadding = PaddingValues(
            start = sidePadding, end = sidePadding, top = 30.dp, bottom = 12.dp,
        ),
    ) { padding ->
        // The foundation list and its scroll state provide the rotary-scrolling integration.
        TransformingLazyColumn(
            modifier = Modifier.fillMaxSize(),
            state = scrollState,
            contentPadding = padding,
            verticalArrangement = Arrangement.spacedBy(PuntoMedioDimensions.Small),
        ) {
            item(key = "screen-title") {
                Text(title, style = PuntoMedioType.Title, color = PuntoMedioColors.Text,
                    modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Center)
            }
            content()
        }
    }
}
