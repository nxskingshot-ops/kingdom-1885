/**
 * PHALANX recovery page adapter — isolated integration candidate.
 * Expected HTML: <form id="reset"><input id="password" ...><button type="submit">...</button></form>
 * <p id="status" role="status"></p>.
 * Supply an existing Supabase client via mountPasswordRecovery(client).
 * Do not include this script alongside the legacy recovery JS.
 * Never log URL fragments or tokens.
 */
import { createRecoveryController } from "./recovery-controller.js";

export function mountPasswordRecovery(client, root = document) {
  const form = root.getElementById("reset");
  const status = root.getElementById("status");
  const password = root.getElementById("password");
  if (!form || !status || !password) throw new Error("Recovery HTML fields are missing");
  const submitButton = form.querySelector('button[type="submit"]') || form.querySelector("button");
  if (!submitButton) throw new Error("Submit button is missing");
  const createToggle = (field) => {
    const button = root.createElement("button");
    button.type = "button";
    button.textContent = "Anzeigen";
    button.setAttribute("aria-label", "Passwort anzeigen");
    button.addEventListener("click", () => {
      const shown = field.type === "text";
      field.type = shown ? "password" : "text";
      button.textContent = shown ? "Anzeigen" : "Verbergen";
      button.setAttribute("aria-label", shown ? "Passwort anzeigen" : "Passwort verbergen");
    });
    field.insertAdjacentElement("afterend", button);
  };
  password.minLength = 12;
  password.autocomplete = "new-password";
  createToggle(password);
  const label = root.createElement("label");
  label.textContent = "Neues Passwort wiederholen";
  label.htmlFor = "confirm-password";
  const confirmation = root.createElement("input");
  confirmation.id = "confirm-password";
  confirmation.type = "password";
  confirmation.required = true;
  confirmation.minLength = 12;
  confirmation.autocomplete = "new-password";
  submitButton.insertAdjacentElement("beforebegin", label);
  label.insertAdjacentElement("afterend", confirmation);
  createToggle(confirmation);
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  form.hidden = true;
  const url = new URL(location.href);
  const query = url.searchParams;
  const hash = new URLSearchParams(url.hash.slice(1));
  const hasRecoveryLink = query.get("type") === "recovery" ||
    hash.get("type") === "recovery" || query.has("code") || hash.has("access_token");
  const controller = createRecoveryController({
    auth: client.auth,
    view: { render({state, message}) {
      form.hidden = state !== "ready";
      submitButton.disabled = state === "saving";
      status.textContent = message || ({
        ready: "Wiederherstellungslink bestätigt. Bitte neues Passwort festlegen.",
        saving: "Passwort wird geändert…",
        complete: "Passwort geändert. Bitte erneut anmelden.",
        verifying: "Wiederherstellungslink wird geprüft."
      }[state] || "");
    }}
  });
  // Listener is registered by the controller before any explicit initialize().
  void controller.initialize({hasRecoveryLink});
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (await controller.submit(password.value, confirmation.value)) {
      password.value = "";
      confirmation.value = "";
      // Only scrub the recovery URL after success; do not navigate to Outpost.
      history.replaceState(null, "", location.pathname);
    }
  });
  return controller;
}
