package com.puntomedio.wear.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.stringResource
import androidx.wear.compose.material3.AppScaffold
import androidx.wear.compose.material3.TimeText
import androidx.wear.compose.navigation.SwipeDismissableNavHost
import androidx.wear.compose.navigation.composable
import androidx.wear.compose.navigation.rememberSwipeDismissableNavController
import com.puntomedio.wear.R
import com.puntomedio.wear.design.PuntoMedioColors
import com.puntomedio.wear.design.PuntoMedioTheme
import com.puntomedio.wear.navigation.WearDestination
import com.puntomedio.wear.presentation.components.NavigationButton
import com.puntomedio.wear.presentation.components.WearScreen
import com.puntomedio.wear.presentation.screens.accountContent
import com.puntomedio.wear.presentation.screens.earningsContent
import com.puntomedio.wear.presentation.screens.homeContent
import com.puntomedio.wear.presentation.screens.notificationsContent
import com.puntomedio.wear.presentation.screens.serviceDetailsContent
import com.puntomedio.wear.presentation.screens.servicesContent

@Composable
fun PuntoMedioWearApp() {
    val navigation = rememberSwipeDismissableNavController()
    val configuration = LocalConfiguration.current
    PuntoMedioTheme {
        AppScaffold(
            modifier = Modifier.fillMaxSize()
                .clip(if (configuration.isScreenRound) CircleShape else RectangleShape)
                .background(PuntoMedioColors.Background),
            timeText = { TimeText() },
        ) {
            SwipeDismissableNavHost(
                navController = navigation,
                startDestination = WearDestination.Home.route,
            ) {
                WearDestination.entries.forEach { destination ->
                    composable(destination.route) {
                        val title = stringResource(when (destination) {
                            WearDestination.Home -> R.string.app_name
                            WearDestination.Services -> R.string.active_services
                            WearDestination.Notifications -> R.string.notifications
                            WearDestination.Earnings -> R.string.earnings
                            WearDestination.Account -> R.string.account_and_link
                            WearDestination.ServiceDetails -> R.string.service_details
                        })
                        val navigate: (WearDestination) -> Unit = {
                            navigation.navigate(it.route) { launchSingleTop = true }
                        }
                        WearScreen(title) {
                            when (destination) {
                                WearDestination.Home -> homeContent(navigate)
                                WearDestination.Services -> servicesContent(navigate)
                                WearDestination.Notifications -> notificationsContent()
                                WearDestination.Earnings -> earningsContent()
                                WearDestination.Account -> accountContent()
                                WearDestination.ServiceDetails -> serviceDetailsContent()
                            }
                            if (destination != WearDestination.Home) {
                                item {
                                    NavigationButton(stringResource(R.string.back), { navigation.popBackStack() })
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
