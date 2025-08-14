const signup = document.querySelector(".signup");

signup.addEventListener("submit", async (event) => {
    event.preventDefault(); // Important!

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const age = document.querySelector("#age").value;
    const mobile = document.querySelector("#mobile").value;
    const address = document.querySelector("#address").value;
    const aadhar = document.querySelector("#aadhar").value;
    const password = document.querySelector("#password").value;
    const role = document.querySelector("#role").value;
//loader
    const btn = document.querySelector(".btn");
    const originalBtnContent = btn.innerHTML;

    //show loader
    btn.disabled= true;
    btn.innerHTML = `<span class="button-spinner"></span>`;

    try {
        const res = await fetch("http://localhost:3000/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Corrected
            },
            body: JSON.stringify({
                name,
                email,
                age,
                mobile,
                address,
                aadharCardNumber: aadhar, // Match with backend
                password,
                role
            })
        });

        const data = await res.json();

        const msgBox = document.querySelector("#responseMsg");
        if (res.ok) {
            msgBox.innerText = "Registration Successfully";
            msgBox.style.color = "green";
            localStorage.setItem("token", data.token);
            window.location.href = "../index.html";
        } else {
            msgBox.innerText = data.message;
            msgBox.style.color = "red";
        }
        //restore btn
        btn.innerHTML = originalBtnContent;
        btn.disabled = false;
    } catch (err) {
        document.querySelector("#responseMsg").innerText = "Network Error";

        //restore btn
        btn.innerHTML = originalBtnContent;
        btn.disabled = false;
    }
});
