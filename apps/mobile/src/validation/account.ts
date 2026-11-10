import type { ProfileDraft } from '@puntomedio/contracts';
import { validateCity, validateEmail, validatePassword, validatePersonName } from './text';

export function validateProfile(draft: ProfileDraft): string | null {
  return validatePersonName(draft.displayName)
    ?? validateEmail(draft.email)
    ?? validateCity(draft.city);
}

export function validateRegistration(draft: ProfileDraft, password: string, confirmPassword: string, requiresPassword = true): string | null {
  const profileError = validateProfile(draft);
  if (profileError) return profileError;
  if (requiresPassword) {
    const passwordError = validatePassword(password);
    if (passwordError) return passwordError;
  }
  if (requiresPassword && password !== confirmPassword) return 'Las contraseñas no coinciden.';
  if (!draft.termsAccepted || !draft.privacyAccepted) return 'Acepta los términos y el aviso de privacidad.';
  return null;
}

export function accountErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (/location_permission_denied/i.test(message)) return 'Para calcular la ruta, permite el acceso a tu ubicación mientras usas la app.';
  if (/address_not_found/i.test(message)) return 'No encontramos una de las direcciones. Agrega calle, número y ciudad.';
  if (/fetch failed|network request failed|unable to resolve host|unknownhost/i.test(message)) return 'Sin conexión a internet. Revisa tu red e inténtalo nuevamente.';
  if (message === 'integration_unavailable') return 'La conexión todavía no está configurada.';
  if (/invalid login/i.test(message)) return 'Correo o contraseña incorrectos.';
  if (/already registered/i.test(message)) return 'Este correo ya está registrado.';
  if (/rate limit/i.test(message)) return 'Espera un momento antes de volver a intentarlo.';
  if (/otp_expired|token has expired|invalid.*otp/i.test(message)) return 'El código venció o ya fue utilizado. Solicita uno nuevo.';
  if (/complete_profile_required/i.test(message)) return 'Completa y verifica tu perfil antes de continuar.';
  if (/invitation_unavailable|meeting_full/i.test(message)) return 'La invitación venció, ya fue utilizada o el encuentro está completo.';
  if (/revision_conflict|point_conflict/i.test(message)) return 'El encuentro cambió. Actualiza la pantalla antes de intentarlo nuevamente.';
  if (/two_origins_required/i.test(message)) return 'Ambas personas deben registrar su zona aproximada.';
  if (/both_arrivals_required/i.test(message)) return 'Ambas personas deben confirmar su llegada antes de finalizar.';
  if (/point_selection_already_started/i.test(message)) return 'La selección del lugar ya comenzó y no puede recalcularse.';
  if (/courier_not_enabled/i.test(message)) return 'Activa el modo repartidor y acepta sus reglas antes de ofertar.';
  if (/bid_already_exists/i.test(message)) return 'Ya enviaste una oferta para este encargo.';
  if (/interaction_unavailable/i.test(message)) return 'Esta interacción no está disponible.';
  if (/product_payment_not_confirmable/i.test(message)) return 'El pago del producto ya fue confirmado o el encargo cambió.';
  if (/pickup_not_startable/i.test(message)) return 'La recogida aún no puede comenzar. Revisa el pago del producto y actualiza.';
  if (/delivery_not_startable/i.test(message)) return 'La entrega aún no puede comenzar. Actualiza el encargo.';
  if (/invalid_handoff_code/i.test(message)) return 'El código no es válido. Comprueba los seis dígitos.';
  if (/code_unavailable|handoff_code_not_available/i.test(message)) return 'El código venció, agotó sus intentos o no corresponde al estado actual.';
  if (/job_not_|bid_not_|revision_conflict/i.test(message)) return 'El encargo cambió. Actualiza la pantalla antes de intentarlo nuevamente.';
  return 'No fue posible completar la solicitud. Inténtalo nuevamente.';
}
