import type { PuntoMedioSupabaseClient } from './client';

export class AuthGateway {
  constructor(private readonly client: PuntoMedioSupabaseClient) {}

  signUpWithEmail(email: string, password: string) {
    return this.client.auth.signUp({ email: email.trim(), password });
  }

  signInWithEmail(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email: email.trim(), password });
  }

  requestPasswordRecovery(email: string, redirectTo: string) {
    return this.client.auth.resetPasswordForEmail(email.trim(), { redirectTo });
  }

  signOut() {
    return this.client.auth.signOut({ scope: 'local' });
  }
}
