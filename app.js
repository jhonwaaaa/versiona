/* Configuración de captación: el ejemplo AmigoSeguro usa FORM_ENDPOINT con envío POST JSON.
 * IMPORTANTE: sin un endpoint real no hay captación de datos. */
const FORM_ENDPOINT = ""; // Ejemplo: "https://formspree.io/f/ID_DE_TU_FORMULARIO"
const CONTACT_EMAIL = ""; // Correo real del responsable para el aviso informativo.

(() => {
  const form = document.querySelector("#passhouse-lead-form");
  if (!form) return;
  const status = document.querySelector("#form-status");
  const download = document.querySelector("#download-link");
  const submitButton = form.querySelector('button[type="submit"]');
  const source = form.dataset.version || "Sin especificar";
  const contact = document.querySelector("#contact-email");
  if (contact) contact.textContent = CONTACT_EMAIL || "Pendiente de configurar correo de contacto";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "status";
    download.classList.remove("visible");
    if (!form.reportValidity()) return;

    if (!FORM_ENDPOINT || !CONTACT_EMAIL) {
      status.textContent = "Formulario en demostración: falta configurar el receptor de registros y el correo responsable. Tus datos NO se enviaron.";
      status.classList.add("error");
      return;
    }

    const data = {
      nombre: form.elements.nombre.value.trim(),
      email: form.elements.email.value.trim(),
      consentimiento: form.elements.consentimiento.checked ? "Sí" : "No",
      pagina: source,
      recurso: "Checklist de reparaciones PassHouse",
      _subject: `Nuevo registro PassHouse - Landing ${source}`
    };
    if (!data.nombre || !data.email || data.consentimiento !== "Sí") return;
    submitButton.disabled = true;
    submitButton.textContent = "Enviando solicitud...";
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {"Content-Type":"application/json", "Accept":"application/json"},
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      status.textContent = "Solicitud enviada correctamente. Ya puedes abrir tu checklist gratuito.";
      status.classList.add("ok");
      download.classList.add("visible");
      form.reset();
    } catch (err) {
      status.textContent = "No se pudo registrar tu solicitud. Inténtalo nuevamente más tarde.";
      status.classList.add("error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Solicitar checklist gratuito";
    }
  });
})();
