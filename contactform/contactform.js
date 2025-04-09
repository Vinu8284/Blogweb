document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Contact Form Submission
  const contactForm = document.querySelector("form.contactForm");
  if (contactForm) {
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

      // Serialize Form Data
      const formData = new FormData(this);
      const action = this.getAttribute("action") || "contactform/contactform.php";

      // Submit Form via AJAX
      fetch(action, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((msg) => {
          const sendMessage = document.getElementById("sendmessage");
          const errorMessage = document.getElementById("errormessage");

          if (msg === "OK") {
            sendMessage.classList.add("show");
            errorMessage.classList.remove("show");
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