document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton"); 
    const popupOverlay = document.getElementById("popupOverlay"); 
    const popupBackground = document.getElementById("popupBackground");
    const closeButton = document.getElementById("closeButton");
    const steps = document.querySelectorAll(".form-step"); 
    const nextButtons = document.querySelectorAll(".next-step");
    const backButtons = document.querySelectorAll(".previous-step"); 
    const form = document.getElementById("myForm");
    const errorModal = document.getElementById("errorModal");
    const errorList = document.getElementById("errorList"); 
    const closeModal = document.getElementById("closeModal");

    let currentStep = 0;


    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.remove("hidden"); 
            } else {
                step.classList.add("hidden"); 
            }
        });
    }


    function validateCurrentStep(stepIndex) {
        const step = steps[stepIndex];
        const inputs = step.querySelectorAll("input, select"); 
        let errors = [];

        inputs.forEach((input) => {
            if (input.required && !input.value.trim()) {
                errors.push(`Field "${input.name || input.id}" is required.`);
            }
            if (input.type === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
                errors.push(`Field "${input.name || input.id}" must be a valid email.`);
            }
        });

        if (errors.length > 0) {
            errorList.innerHTML = "";
            errors.forEach((error) => {
                const li = document.createElement("li");
                li.textContent = error;
                errorList.appendChild(li);
            });
            errorModal.classList.remove("hidden");
            return false;
        }

        return true;
    }

    startButton.addEventListener("click", () => {
        popupOverlay.classList.remove("hidden");
        popupBackground.classList.remove("hidden");
        showStep(currentStep); 
    });

    closeButton.addEventListener("click", () => {
        popupOverlay.classList.add("hidden");
        popupBackground.classList.add("hidden");
        currentStep = 0;
        showStep(currentStep); 
        form.reset();
    });

    closeModal.addEventListener("click", () => {
        errorModal.classList.add("hidden"); 
    });

    nextButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (validateCurrentStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++; 
                    showStep(currentStep);
                }
            }
        });
    });

    backButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--; 
                showStep(currentStep);
            }
        });
    });


    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        let errors = [];

        if (!data.firstName) {
            errors.push("First Name is required.");
        }

        if (!data.lastName) {
            errors.push("Last Name is required.");
        }

        if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
            errors.push("A valid Email is required.");
        }

        if (errors.length > 0) {
            errorList.innerHTML = ""; 
            errors.forEach((error) => {
                const li = document.createElement("li");
                li.textContent = error;
                errorList.appendChild(li);
            });
            errorModal.classList.remove("hidden");
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open("GET", "submit.json", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                document.body.innerHTML = `<h2>${response.message}</h2>`;
                form.reset();
            } else {
                alert("There was an error submitting the form. Please try again.");
            }
        };
        xhr.send(JSON.stringify(formData));
        console.log(formData);
    });
});
