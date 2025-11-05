document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Contact Form Submission
  const contactForm = document.querySelector("form.contactForm");
  if (contactForm) {
    const googleScriptURL = "https://script.google.com/macros/s/AKfycbyR4Spg_vp_zcCKz__y9mtCuCtc-oMJQdYnZcSolMan_aCD_oHJokiz-7bJopxKCFO-/exec"; 

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      const formGroups = this.querySelectorAll(".form-group");
      let ferror = false;
      const emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

      // Validate Inputs
      formGroups.forEach((formGroup) => {
        const inputs = formGroup.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
          const rule = input.getAttribute("data-rule");
          if (rule) {
            let ierror = false;
            let pos = rule.indexOf(":");
            let exp = pos >= 0 ? rule.slice(pos + 1) : null;
            rule = pos >= 0 ? rule.slice(0, pos) : rule;

            switch (rule) {
              case "required":
                if (input.value.trim() === "") {
                  ferror = ierror = true;
                }
                break;

              case "minlen":
                if (input.value.length < parseInt(exp)) {
                  ferror = ierror = true;
                }
                break;

              case "email":
                if (!emailExp.test(input.value)) {
                  ferror = ierror = true;
                }
                break;

              case "checked":
                if (!input.checked) {
                  ferror = ierror = true;
                }
                break;

              case "regexp":
                const regex = new RegExp(exp);
                if (!regex.test(input.value)) {
                  ferror = ierror = true;
                }
                break;
            }

            // Display Validation Message
            const validation = input.nextElementSibling;
            if (validation && validation.classList.contains("validation")) {
              validation.textContent = ierror
                ? input.getAttribute("data-msg") || "Wrong Input"
                : "";
              validation.style.display = ierror ? "block" : "none";
            }
          }
        });
      });

      if (ferror) return false;

      // Prepare data for Google Script
      const formData = {
        name: this.querySelector('input[name="name"]').value,
        email: this.querySelector('input[name="email"]').value,
        message: this.querySelector('textarea[name="message"]').value,
      };

      fetch(googleScriptURL, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.text())
        .then((msg) => {
          const sendMessage = document.getElementById("sendmessage");
          const errorMessage = document.getElementById("errormessage");

          if (msg === "OK") {
            sendMessage.classList.add("show");
            errorMessage.classList.remove("show");
            sendMessage.textContent = "Message sent successfully! I will reach out to you soon."; // Custom success message
            this.reset(); // Clear form inputs
          } else {
            sendMessage.classList.remove("show");
            errorMessage.classList.add("show");
            errorMessage.textContent = msg;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      return false;
    });
  }
});