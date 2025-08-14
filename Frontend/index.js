const form= document.querySelector(".login_info");
form.addEventListener("submit",async(event)=>{
    event.preventDefault();
    const email=document.querySelector("#email").value;
    const password=document.querySelector("#password").value;
    const btn = document.querySelector(".btn");
    const originalBtnContent = btn.innerHTML;

    //sound of click
    const toggleSound = document.getElementById('toggleSound');
    toggleSound.play();
    //show loader
    btn.disabled= true;
    btn.innerHTML = `<span class="button-spinner"></span>`;

    try{
        const res= await fetch("http://localhost:3000/user/signin",{
            method: "POST",
            headers: {
                "content-Type":"application/json"
            },
            body: JSON.stringify({email,password})
        });

        const data= await res.json();
        if(res.ok){
            document.querySelector("#responseMsg").innerText = "Login Successfully";
            localStorage.setItem("token",data.token);

            window.location.href = "dashboard/dashboard.html";
        }else{
            document.querySelector("#responseMsg").innerText = data.message;
        }
        //restore btn
        btn.innerHTML = originalBtnContent;
        btn.disabled = false;
    }catch(err){
        document.querySelector("#responseMsg").innerText = "Network Error";
        
        //restore btn
        btn.innerHTML = originalBtnContent;
        btn.disabled = false;
    }
})

const forgot = document.querySelector(".wrap2 a")
forgot.addEventListener("click",()=>{
    window.location.href = "forgetpassword/forget.html";
})
