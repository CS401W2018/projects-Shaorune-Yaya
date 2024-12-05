document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton"); // 开始按钮
    const popupOverlay = document.getElementById("popupOverlay"); // 弹窗遮罩层
    const popupBackground = document.getElementById("popupBackground"); // 灰色背景
    const closeButton = document.getElementById("closeButton"); // 关闭按钮
    const steps = document.querySelectorAll(".form-step"); // 所有 fieldset 步骤
    const nextButtons = document.querySelectorAll(".next-step"); // "Next" 按钮
    const backButtons = document.querySelectorAll(".previous-step"); // "Back" 按钮
    const form = document.getElementById("myForm"); // 表单
    const errorModal = document.getElementById("errorModal"); // 错误模态框
    const errorList = document.getElementById("errorList"); // 错误列表
    const closeModal = document.getElementById("closeModal"); // 错误模态框关闭按钮

    let currentStep = 0; // 当前步骤索引

    // 显示指定步骤
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.remove("hidden"); // 显示当前步骤
            } else {
                step.classList.add("hidden"); // 隐藏其他步骤
            }
        });
    }

    // 验证当前步骤
    function validateCurrentStep(stepIndex) {
        const step = steps[stepIndex];
        const inputs = step.querySelectorAll("input, select"); // 获取当前步骤的所有输入字段
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
            // 显示错误模态框
            errorList.innerHTML = ""; // 清空之前的错误
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

    // 打开表单弹窗
    startButton.addEventListener("click", () => {
        popupOverlay.classList.remove("hidden");
        popupBackground.classList.remove("hidden");
        showStep(currentStep); // 初始化显示第一步
    });

    // 关闭表单弹窗
    closeButton.addEventListener("click", () => {
        popupOverlay.classList.add("hidden");
        popupBackground.classList.add("hidden");
        currentStep = 0; // 重置为第一步
        showStep(currentStep); // 确保关闭后重新显示第一步
        form.reset(); // 重置表单
    });

    // 关闭错误模态框
    closeModal.addEventListener("click", () => {
        errorModal.classList.add("hidden"); // 隐藏错误模态框
    });

    // 下一步按钮逻辑
    nextButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (validateCurrentStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++; // 前进到下一步
                    showStep(currentStep);
                }
            }
        });
    });

    // 返回按钮逻辑
    backButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--; // 返回到上一步
                showStep(currentStep);
            }
        });
    });

    // 提交表单并验证
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // 阻止默认提交行为

        // 手动提取字段值
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 验证所有字段
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
            // 显示错误模态框
            errorList.innerHTML = ""; // 清空之前的错误
            errors.forEach((error) => {
                const li = document.createElement("li");
                li.textContent = error;
                errorList.appendChild(li);
            });
            errorModal.classList.remove("hidden");
            return;
        }

        // 模拟提交表单
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "submit.json", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                alert(response.message);
                popupOverlay.classList.add("hidden");
                popupBackground.classList.add("hidden");
                form.reset();
                currentStep = 0;
                showStep(currentStep);
            } else {
                alert("There was an error submitting the form. Please try again.");
            }
        };
        xhr.send(JSON.stringify(data));
    });

    // 初始化，隐藏弹窗，默认显示第一步
    popupOverlay.classList.add("hidden");
    popupBackground.classList.add("hidden");
    showStep(currentStep);
});
