package com.puntomedio.wear.contracts

/** Presentation only. Precise coordinates, phone numbers and handoff codes are excluded. */
sealed interface ServiceSummary {
    val kind: String
    val serviceId: String
    val title: String
    val publicPlaceName: String?
    val updatedAt: String
}

data class MeetingSummary(
    override val serviceId: String,
    override val title: String,
    val status: MeetingStatus,
    override val publicPlaceName: String?,
    override val updatedAt: String,
) : ServiceSummary {
    override val kind: String = "meeting"
}

data class JobSummary(
    override val serviceId: String,
    override val title: String,
    val status: JobStatus,
    override val publicPlaceName: String?,
    override val updatedAt: String,
) : ServiceSummary {
    override val kind: String = "job"
}

enum class MeetingStatus(val wireValue: String) {
    Created("created"), Invited("invited"), Accepted("accepted"), PointSelected("point_selected"),
    InProgress("in_progress"), Completed("completed"), Cancelled("cancelled"),
}

enum class JobStatus(val wireValue: String) {
    Published("published"), Bidding("bidding"), Assigned("assigned"),
    TestPaymentConfirmed("test_payment_confirmed"), PickupInProgress("pickup_in_progress"),
    PickedUp("picked_up"), DeliveryInProgress("delivery_in_progress"),
    Delivered("delivered"), Completed("completed"), Cancelled("cancelled"), Disputed("disputed"),
}
