package com.puntomedio.wear.contracts

const val WATCH_PROTOCOL_VERSION = 1

/**
 * Mirrors packages/contracts/src/watch.ts. Serialization and transport are deliberately
 * deferred; enum adapters must use wireValue, not Kotlin enum names.
 */
data class WatchSnapshot(
    val version: Int = WATCH_PROTOCOL_VERSION,
    val hasSession: Boolean = false,
    val profileCompletion: ProfileCompletion = ProfileCompletion.Incomplete,
    val services: List<ServiceSummary> = emptyList(),
    val unreadNotificationCount: Int = 0,
    val earningsSummary: EarningsSummary? = null,
)

data class WatchStateEnvelope(
    val kind: String = "state",
    val authorityDeviceId: String,
    val sequence: Long,
    val snapshot: WatchSnapshot,
)

enum class ProfileCompletion(val wireValue: String) {
    Incomplete("incomplete"), PendingVerification("pending_verification"), Complete("complete"),
}

data class EarningsSummary(
    val mode: PaymentMode = PaymentMode.Simulated,
    val total: Money,
)

/** Integer minor units; the future backend must enforce safe bounds and MXN currency. */
data class Money(
    val currency: Currency = Currency.Mxn,
    val amountMinor: Long,
)

enum class PaymentMode(val wireValue: String) { Simulated("simulated") }
enum class Currency(val wireValue: String) { Mxn("MXN") }

/** Intent only. A command is never evidence of a completed service transition. */
data class WatchCommand(
    val version: Int = WATCH_PROTOCOL_VERSION,
    val commandId: String,
    val serviceId: String,
    val action: CommandAction,
    val expectedRevision: Long,
    val createdAt: String,
)

enum class CommandAction(val wireValue: String) {
    MarkArrival("mark_arrival"),
    RequestPickupConfirmation("request_pickup_confirmation"),
    RequestDeliveryConfirmation("request_delivery_confirmation"),
    Refresh("refresh"),
}
