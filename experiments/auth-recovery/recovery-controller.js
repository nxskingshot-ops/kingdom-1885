// PYLON/PHALANX isolated password-recovery controller. No credentials, routing or network configuration.
export function createRecoveryController({ auth, view }) {
  if (!auth || !view) throw new TypeError("auth and view are required");
  let verified = false, busy = false, completed = false, disposed = false;
  const render = (state, message = "") => { if (!disposed) view.render({ state, message }); };
  const { data: listener } = auth.onAuthStateChange((event) => {
    if (disposed || completed) return;
    if (event === "PASSWORD_RECOVERY") { verified = true; render("ready"); }
  });
  async function initialize({ hasRecoveryLink = false } = {}) {
    if (!hasRecoveryLink) { render("invalid", "Bitte fordere einen neuen Wiederherstellungslink an."); return; }
    if (!verified) render("verifying", "Wiederherstellungslink wird geprüft.");
    try {
      if (typeof auth.initialize === "function") await auth.initialize();
      if (!verified) render("verifying", "Wiederherstellungslink wird geprüft.");
    } catch { render("invalid", "Wiederherstellung fehlgeschlagen. Bitte einen neuen Link anfordern."); }
  }
  async function submit(password, confirmation) {
    if (disposed || completed || busy || !verified) return false;
    if (typeof password !== "string" || password.length < 12) { render("ready", "Mindestens 12 Zeichen verwenden."); return false; }
    if (password !== confirmation) { render("ready", "Die Passwörter stimmen nicht überein."); return false; }
    busy = true; render("saving");
    try {
      const { error } = await auth.updateUser({ password });
      if (error) throw error;
      completed = true; verified = false;
      render("complete", "Passwort geändert. Bitte erneut anmelden.");
      return true;
    } catch { render("ready", "Änderung fehlgeschlagen. Bitte erneut versuchen."); return false; }
    finally { busy = false; }
  }
  async function signOut() {
    if (!completed) return false;
    const { error } = await auth.signOut();
    if (error) { render("complete", "Abmelden fehlgeschlagen."); return false; }
    render("signed-out", "Abgemeldet. Du kannst dich erneut anmelden.");
    return true;
  }
  return { initialize, submit, signOut, dispose() { disposed = true; listener?.subscription?.unsubscribe?.(); } };
}
