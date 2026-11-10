package com.puntomedio.wear.presentation.screens

import androidx.compose.ui.res.stringResource
import androidx.wear.compose.foundation.lazy.TransformingLazyColumnScope
import com.puntomedio.wear.R
import com.puntomedio.wear.navigation.WearDestination
import com.puntomedio.wear.presentation.components.InfoCard
import com.puntomedio.wear.presentation.components.NavigationButton
import com.puntomedio.wear.presentation.components.SecondaryText

fun TransformingLazyColumnScope.homeContent(navigate: (WearDestination) -> Unit) {
    item { InfoCard(stringResource(R.string.services_empty_title), stringResource(R.string.services_empty_description)) }
    item { NavigationButton(stringResource(R.string.active_services), { navigate(WearDestination.Services) }, primary = true) }
    item { NavigationButton(stringResource(R.string.notifications), { navigate(WearDestination.Notifications) }) }
    item { NavigationButton(stringResource(R.string.earnings), { navigate(WearDestination.Earnings) }) }
    item { NavigationButton(stringResource(R.string.account_and_link), { navigate(WearDestination.Account) }) }
}

fun TransformingLazyColumnScope.servicesContent(navigate: (WearDestination) -> Unit) {
    item {
        InfoCard(stringResource(R.string.services_empty_title), stringResource(R.string.services_empty_description))
    }
    item { NavigationButton(stringResource(R.string.service_information), { navigate(WearDestination.ServiceDetails) }, primary = true) }
}

fun TransformingLazyColumnScope.notificationsContent() {
    item {
        InfoCard(stringResource(R.string.notifications_empty_title),
            stringResource(R.string.notifications_empty_description))
    }
}

fun TransformingLazyColumnScope.earningsContent() {
    item {
        InfoCard(stringResource(R.string.earnings_empty_title), stringResource(R.string.earnings_empty_description))
    }
}

fun TransformingLazyColumnScope.accountContent() {
    item { InfoCard(stringResource(R.string.link_title), stringResource(R.string.account_description)) }
    item { SecondaryText(stringResource(R.string.link_pending)) }
}

fun TransformingLazyColumnScope.serviceDetailsContent() {
    item {
        InfoCard(stringResource(R.string.service_missing_title), stringResource(R.string.service_missing_description))
    }
    item { SecondaryText(stringResource(R.string.actions_unavailable)) }
    item { NavigationButton(stringResource(R.string.next_action), {}, enabled = false, primary = true) }
}
