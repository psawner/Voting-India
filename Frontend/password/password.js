//email verification
const btn = document.querySelector(".btn");
btn.addEventListener("click",async()=>{
    const token = localStorage.getItem("token");
    const email = document.querySelector("#email").value;
    const originalBtnContent = btn.innerHTML;

    btn.disabled= true;
    btn.innerHTML = `<span class="button-spinner"></span>`;

    try{
        const res = await fetch("http://localhost:3000/user/profile/verify-email",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({email})
        });

        const data = await res.json();
        console.log("person found", data);
        if(data.success){
            gsap.to(".verify_content", { opacity: 0, duration: 0.3, onComplete: () => {
                document.querySelector(".verify_content").style.display = "none";
                document.querySelector(".wrap").style.display = "block";
                gsap.fromTo(".wrap", { opacity: 0 }, { opacity: 1, duration: 0.4 });
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

//password update
const updatebtn = document.querySelector(".updatebtn");
updatebtn.addEventListener("click",async()=>{
    const token = localStorage.getItem("token");
    const currentpassword = document.getElementById('password').value;
    const newpassword = document.getElementById('newpassword').value;

    const originalBtnContent = updatebtn.innerHTML;
    
    updatebtn.disabled= true;
    updatebtn.innerHTML = `<span class="button-spinner"></span>`;
    try{
        const res = await fetch("http://localhost:3000/user/profile/password",{
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({currentpassword,newpassword})
        });

        const data = await res.json();
        if(data.success){
            window.location.href = "../dashboard/dashboard.html";
        }
        //restore btn
        updatebtn.innerHTML = originalBtnContent;
        updatebtn.disabled = false;
    }catch(err){
        console.error("password update error",err);
        //restore btn
        updatebtn.innerHTML = originalBtnContent;
        updatebtn.disabled = false;
    }

})