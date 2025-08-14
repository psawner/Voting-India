const verificationcode = document.querySelectorAll(".inputvalue input");
verificationcode.forEach((input,index)=>{
    input.addEventListener("input",(e)=>{
        if(e.target.value.length ===1 && index<verificationcode.length-1){
            verificationcode[index+1].focus();
        }
    })

    input.addEventListener("keydown",(e)=>{
        if(e.key === "Backspace" && index>0 && !e.target.value){
            verificationcode[index-1].focus();
        }
    })
})

//only email verify
const btn = document.querySelector(".btn");
btn.addEventListener("click",async(e)=>{
    const token = localStorage.getItem("token");
    const email = document.querySelector("#email").value;
    const originalBtnContent = btn.innerHTML;
    btn.disabled= true;
    btn.innerHTML = `<span class="button-spinner"></span>`;
    try{
        const res = await fetch("http://localhost:3000/user/profile/verify-otp",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({email})
        });

        const data = await res.json();
        console.log("verification code sent to your email", data);
        if(data.success){
                gsap.to(".btn", { opacity: 0, duration: 0.3, onComplete: () => {
                    document.querySelector(".btn").style.display = "none";
                    document.querySelector(".SecurityCode").style.display = "block";
                    document.querySelector(".updatebtn").style.display = "block";
                    gsap.fromTo(".SecurityCode", { opacity: 0 }, { opacity: 1, duration: 0.4 });
                    gsap.fromTo(".updatebtn", { opacity: 0 }, { opacity: 1, duration: 0.4 });
                }});
        }
        //restore btn
        btn.innerHTML = originalBtnContent;
        btn.disabled = false;
    }catch(err){
        console.error("verification error",err);
        //restore btn
        btn.innerHTML = originalBtnContent;
        btn.disabled = false;
    }
})

//email and otp verification
const updatebtn = document.querySelector(".updatebtn");
updatebtn.addEventListener("click",async(e)=>{
    const token = localStorage.getItem("token");
    const email = document.querySelector("#email").value;
    const otpinputs = document.querySelectorAll(".inputvalue input");
    let otp="";
    otpinputs.forEach(input=>{
        otp+=input.value.trim();
    })

    const originalBtnContent = updatebtn.innerHTML;
    updatebtn.disabled= true;
    updatebtn.innerHTML = `<span class="button-spinner"></span>`;
    try{
        const res = await fetch("http://localhost:3000/user/profile/confirm-otp",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({email,otp: otp.toString()})
        });
        const data = await res.json();
        console.log("verification code sent to your email", data);
        if(data.success){
            alert(data.message);
            gsap.to(".verify_content", { opacity: 0, duration: 0.3, onComplete: () => {
                document.querySelector(".verify_content").style.display = "none";
                document.querySelector(".password_change").style.display = "block";
                gsap.fromTo(".password_change", { opacity: 0 }, { opacity: 1, duration: 0.4 });
            }});  
        }else {
            alert(data.message || "OTP verification failed");
        }
        //restore btn
        updatebtn.innerHTML = originalBtnContent;
        updatebtn.disabled = false;
    }catch(err){
        console.error("otp confirmation error",err);
        //restore btn
        updatebtn.innerHTML = originalBtnContent;
        updatebtn.disabled = false;
    }
})

//creating new password
const changebtn = document.querySelector(".changebtn");
changebtn.addEventListener("click",async(e)=>{
    const token = localStorage.getItem("token");
    const password = document.querySelector("#password").value;

    const originalBtnContent = changebtn.innerHTML;
    changebtn.disabled= true;
    changebtn.innerHTML = `<span class="button-spinner"></span>`;
    try{
        const res = await fetch("http://localhost:3000/user/create/password",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({newpassword: password})
        });

        const data = await res.json();
        console.log("new password generated", data);
        if(data.success){
            window.location.href = "../dashboard/dashboard.html"
        }
        //restore btn
        changebtn.innerHTML = originalBtnContent;
        changebtn.disabled = false;
    }catch(err){
        console.error("verification error",err);
        //restore btn
        changebtn.innerHTML = originalBtnContent;
        changebtn.disabled = false;
    }
})