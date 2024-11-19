document.getElementById("myForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const form = document.getElementById("myForm");
    const formData = {
        firstName: document.getElementById("firstNameInput").value.trim(),
        lastName: document.getElementById("lastNameInput").value.trim(),
        email: document.getElementById("emailInput").value.trim(),
        birthDate: document.getElementById("DoBInput").value.trim(),
        password: document.getElementById("passwordInput").value.trim(),
        gender: document.querySelector("input[name='gender']:checked")?.value,
        state: document.getElementById("stateInput").value,
        comment: document.getElementById("commentInput").value.trim(),
        remember: document.getElementById("rememberMe").checked,
        age: document.getElementById("ageInput").value.trim(),
    };

    let errors = [];

    if (!formData.firstName) {
        errors.push("First Name is required.");
    }

    if (!formData.lastName) {
        errors.push("Last Name is required.");
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.push("A valid Email is required.");
    }

    if (formData.password.length < 6) {
        errors.push("Password must be at least 6 characters long.");
    }

    if (!formData.remember) {
        errors.push("You must check 'Remember Me' to proceed.");
    }

    if (!formData.age || isNaN(formData.age) || formData.age < 18) {
        errors.push("You must be 18 years or older to submit this form.");
    }

    if (errors.length > 0) {
        alert(errors.join("\n"));
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
