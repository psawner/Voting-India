lottie.loadAnimation({
  container: document.querySelector(".dashboard_animation"), 
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/Dashboard.json'
});


/* user profile fetch */
async function loadprofile(){
  const token = localStorage.getItem("token");
  if(!token){
    console.error("No token found");
    // Redirect to login if no token found
    window.location.href = "/login.html";
    return;
  }

  try{
    const res = await fetch("http://localhost:3000/user/profile/info",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if(!res.ok){
      throw new Error("Failed to fetch profile");
    }

    const data = await res.json();
    const person = data.person;
    console.log("Fetched profile data:", data);
    
    //document.querySelector("#profile_name").innerText = person.name;
    const name = person.name;
    const capitalizedName = name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    document.querySelector("#profile_name").innerText = capitalizedName;
    document.querySelector("#profile_email").innerText = person.email;


  }catch(err){
    console.error("Error loading profile:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadprofile);


// fetching user name only
  async function loadpicture(){
    const token = localStorage.getItem("token");
    if(!token){
      console.error("No token found");
      // Redirect to login if no token found
      window.location.href = "/login.html";
      return;
    }
  
    try{
      const res = await fetch("http://localhost:3000/user/profile/name",{
        method: "GET",
        headers: {
          "Authorization" : `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      if(!res.ok){
        throw new Error("Failed to fetch profile");
      }
  
      const data = await res.json();
      const person = data.person;
      console.log("Fetched profile data:", data);
      //fill the fetch info in html
      //document.querySelector("#voter_name").innerText = person.name;
      const name = person.name;
      const capitalizedName = name
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      document.querySelector("#voter_name").innerText = capitalizedName;
    
    }catch(err){
      console.error("Error loading profile:", err);
    }
}
document.addEventListener("DOMContentLoaded", loadpicture);


//fetching user personal info
async function loadpersonalinfo(){
    const token = localStorage.getItem("token");
    if(!token){
      console.error("No token found");
      // Redirect to login if no token found
      window.location.href = "/login.html";
      return;
    }
  
    try{
      const res = await fetch("http://localhost:3000/user/profile/personalinfo",{
        method: "GET",
        headers: {
          "Authorization" : `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      if(!res.ok){
        throw new Error("Failed to fetch profile");
      }
  
      const data = await res.json();
      const person = data.person;
      console.log("Fetched profile data:", data);
      //fill the fetch info in html
      //document.querySelector("#voter_name").innerText = person.name;
      const name = person.name;
      const capitalizedName = name
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      document.querySelector("#voter_id_name").innerText = capitalizedName;
      document.querySelector("#voter_id_email").innerText = person.email;
      document.querySelector("#voter_id_age").innerText = person.age;
      document.querySelector("#voter_id_mobile").innerText = person.mobile;
      //document.querySelector("#voter_id_address").innerText = person.address;
      const address = person.address;
      const capitaladdress = address
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      document.querySelector("#voter_id_address").innerText = capitaladdress;
      document.querySelector("#voter_id_aadhar").innerText = person.aadharCardNumber;
      //document.querySelector("#voter_id_role").innerText = person.role;
      const role = person.role;
      const capitalrole = role
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      document.querySelector("#voter_id_role").innerText = capitalrole;
    
      const adminpanel = document.querySelector(".admin");
      if(role === "admin"){
        adminpanel.style.display = "";
      }else{
        adminpanel.style.display = "none";
      }
    }catch(err){
      console.error("Error loading profile:", err);
    }
}
document.addEventListener("DOMContentLoaded", loadpersonalinfo);


//admin panel functionality
//candidate addition
const candiates_personal = document.querySelector(".candiates_personal");
candiates_personal.addEventListener("submit",async (event)=>{
  event.preventDefault();

  const name = document.querySelector("#name").value;
  const party = document.querySelector("#party").value;
  const age = document.querySelector("#age").value;

  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/candidate", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
          name,
          party,
          age
      })
    });

    const data = await res.json();
    const message = document.querySelector("#message");

    if(res.ok){
      message.innerText = "Added Successfully";
      message.style.color = "green";
    }else{
      message.innerText = data.message;
      message.style.color = "red";
    }

  }catch(err){
    document.querySelector("#message").innerText = "Network Error";
  }
})

document.addEventListener("DOMContentLoaded", async () => {
  await loadcandidates(); // Load all candidates first
  setupCandidateClick();  // Then attach the click listener
});


//candidates showing in admin dashboard
async function loadcandidates(){
  const token = localStorage.getItem("token");
  if(!token){
    console.error("No token found");
    // Redirect to login if no token found
    window.location.href = "/login.html";
    return;
  }

  try{
    const res = await fetch("http://localhost:3000/candidate/profile",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if(!res.ok){
      throw new Error("Failed to fetch profile");
    }

    const data = await res.json();
    const candidates = data.candidates;
    console.log("Fetched profile data:", data);
    
    const candidate_tablecontent = document.querySelector(".candidate_tablecontent");

    candidates.forEach(candidate =>{
      console.log("Candidate object:", candidate);
      const { id: candidateid, name, party, age} = candidate;
      //creating row div
      const row = document.createElement("div");
      row.className = "candidate_row";
      row.dataset.candidateId = candidateid;

      //creating table
      const table = document.createElement("table");
      table.className = "candidate";

      table.innerHTML = `
      <tbody>
          <tr>
            <th>Name</th>
            <td>${name}</td>
          </tr>
          <tr>
            <th>Party</th>
            <td>${party}</td>
          </tr>
          <tr>
            <th>Age</th>
            <td>${age}</td>
          </tr>
        </tbody>
      `;

      row.appendChild(table);
      candidate_tablecontent.appendChild(row);
    })
    

  }catch(err){
    console.error("Error loading profile:", err);
  }
}


// showing candidate model when click on a candidate 
function setupCandidateClick() {
  const candidate_tablecontent = document.querySelector(".candidate_tablecontent");

  candidate_tablecontent.addEventListener("click", async (event) => {
    const row = event.target.closest(".candidate_row");
    if (row) {
      selectedCandidateId = row.dataset.candidateId;
      const tds = row.querySelectorAll("td");

      const name = tds[0].textContent;
      const party = tds[1].textContent;
      const age = tds[2].textContent;

      showCandidateModal({ name, party, age });
    }
  });
}

let originaldata = {};
function showCandidateModal(candidate){
  document.querySelector(".candidate_model").style.display = "";
  document.querySelector(".wrapping_info").style.display = "none";
  const animationContainer = document.querySelector("#opening_animation");
  //animation
  animationContainer.style.display = "block";
  const animation = lottie.loadAnimation({
    container: animationContainer,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "assets/Open Folder.json",
  });
  animation.setSpeed(0.9);

  setTimeout(() => {
    animation.stop();
    animation.destroy();

    animationContainer.style.display = "none";
    document.querySelector(".wrapping_info").style.display = "";
    originaldata = {
      name: candidate.name,
      party: candidate.party,
      age: candidate.age
    };

    document.querySelector("#editName").value = candidate.name;
    document.querySelector("#editParty").value = candidate.party;
    document.querySelector("#editAge").value = candidate.age;
  }, 1200);


}

//update route is integrating
const editform = document.querySelector("#editform");
editform.addEventListener("submit", async(event)=>{
  event.preventDefault();
  const token = localStorage.getItem("token");

  const updated = {
    name: document.querySelector("#editName").value,
    party: document.querySelector("#editParty").value,
    age: document.querySelector("#editAge").value
  };

  // if changes not made, showing alert message 
  const isSame = 
  updated.name === originaldata.name &&
  updated.party === originaldata.party &&
  updated.age === originaldata.age;

  try{
    const res = await fetch(`http://localhost:3000/candidate/${selectedCandidateId}`,{
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updated)
    });

    if (res.ok) {
      if (isSame) {
        alert("No Changes Made 😒");
      } else {
        alert("Candidate Updated Successfully!");
        location.reload();
      }
    } else {
      alert(result.message || "Update failed.");
    }

  }catch(err){
    console.error("Update error", err);
  }
})

//delete route's integration
const deletebtn = document.querySelector("#deleteBtn");
deletebtn.addEventListener("click", async()=>{
  const token = localStorage.getItem("token");
  try{
    const res = await fetch(`http://localhost:3000/candidate/${selectedCandidateId}`,{
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });
    const result = await res.json();
    alert(result.message);
    location.reload();
  }catch{
    console.error("Delete error", err);
  }
})

//close candidate model preview
const closemodel = document.querySelector(".closemodel i");
closemodel.addEventListener("click",()=>{
  document.querySelector(".candidate_model").style.display = "";
  document.querySelector(".wrapping_info").style.display = "none";
  const animationContainer = document.querySelector("#closing_animation");

  animationContainer.style.display = "block";
  const animation = lottie.loadAnimation({
    container: animationContainer,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "assets/Close.json",
  });
  animation.setSpeed(0.9);
  setTimeout(() => {
    animation.stop();
    animation.destroy();

    animationContainer.style.display = "none";
    //document.querySelector(".wrapping_info").style.display = "";
    document.querySelector(".candidate_model").style.display = "none";
  }, 1200);

})

//candidates list animation
lottie.loadAnimation({
  container: document.querySelector(".candidate_animation"), 
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/Business resume.json'
});

lottie.loadAnimation({
  container: document.querySelector(".list_animation"), 
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/andidate.json'
});


//showing candidate list with name and party
async function loadcandidatelist(){
  const token = localStorage.getItem("token");

  try{
    const res = await fetch("http://localhost:3000/candidate/candidatelist",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    const candidates = data.candidates;

    const tbody = document.querySelector("#candidatetablebody");
    candidates.forEach((candidate,index)=>{
      const row = document.createElement("tr");
      const sno = document.createElement("td");
      sno.textContent = `${index+1}.`;

      const name = document.createElement("td");
      name.textContent = candidate.name;

      const party = document.createElement("td");
      party.textContent = candidate.party;

      row.appendChild(sno);
      row.appendChild(name);
      row.appendChild(party);

      tbody.appendChild(row);
    })
  }catch(err){
    console.error("Error fetching candidates:", err);
  }
}
document.addEventListener("DOMContentLoaded", loadcandidatelist);

// voting cast aniamtion
lottie.loadAnimation({
  container: document.querySelector(".casting_animation"), 
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/Loading Lottie animation.json'
});

const animation = lottie.loadAnimation({
  container: document.querySelector(".casting_animation3"), 
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/election.json'
});
animation.setSpeed(0.4);

//in cast voting panel name and party will render through this 
document.addEventListener("DOMContentLoaded", async()=>{
  //fetching name and party
  const token = localStorage.getItem("token");
  const wrappingCast = document.querySelector(".wrapping_cast");

  try{
    const res = await fetch("http://localhost:3000/candidate/candidatelist",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();
    const candidates = data.candidates;

    candidates.forEach((candidate)=>{

      // Create casting_box
      const castingBox = document.createElement("div");
      castingBox.className = "casting_box";

      // create percandidate 
      const candidatediv = document.createElement("div");
      candidatediv.className = "percandidate";

      const namep = document.createElement("p");
      namep.textContent = candidate.name;

      const partyp = document.createElement("p");
      partyp.textContent = candidate.party;
      
      candidatediv.appendChild(namep);
      candidatediv.appendChild(partyp);

      // Create wrap_btn div with button
      const wrapBtnDiv = document.createElement("div");
      wrapBtnDiv.className = "wrap_btn";

      const btn = document.createElement("button");
      btn.id = "castingbtn";
      btn.type = "submit"
      btn.textContent = "Cast";
      btn.setAttribute("data-candidateid", candidate.id);

      const aftercasting_animation = document.querySelector(".aftercasting_animation");
      aftercasting_animation.style.display = "none";

      //vote casting 
      btn.addEventListener("click", async()=>{
        try{
          const candidateid = btn.getAttribute("data-candidateid");

          //during cast animation will show for processing
          const castingvote_animation = document.querySelector(".castingvote_animation");
          aftercasting_animation.style.display = "";
         
          const animation = lottie.loadAnimation({
            container: castingvote_animation,
            renderer: "svg",
            loop: false,
            autoplay: true,
            path: "assets/Balloting.json" 
          });

          await new Promise((resolve) => {
            animation.addEventListener("complete", () => {
              resolve();
            });
          });
         
          animation.destroy();
          aftercasting_animation.style.display = "none";

          const voteres = await fetch(`http://localhost:3000/candidate/vote/${candidateid}`,{
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          const votedata = await voteres.json();

          if(voteres.ok){
            alert("✅ Vote cast successfully");
            location.reload();
          }else{
            alert(`❌ ${votedata.message || "Voting failed"}`);
          }
        }catch(err){
          console.error("Vote error:", err);
          alert("Server error while voting");
        }
      })
      wrapBtnDiv.appendChild(btn);

      castingBox.appendChild(candidatediv);
      castingBox.appendChild(wrapBtnDiv);

      wrappingCast.appendChild(castingBox);
    });


  }catch(err){
    console.error("Error fetching candidates:", err);
  }
})

//voting status animation
const votingstatus = lottie.loadAnimation({
  container: document.querySelector(".votingstatus_animation"), 
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/Playing Status Animation.json'
});
votingstatus.setSpeed(0.4);


//showing current vote count status
async function loadvotecount(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/candidate/vote/count",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    const candidates = data.candidates;

    const candidatevote = document.querySelector("#candidatevote");
    candidates.forEach((candidate,index)=>{
      const row = document.createElement("tr");
      const sno = document.createElement("td");
      sno.textContent = `${index+1}.`;

      const name = document.createElement("td");
      name.textContent = candidate.name;

      const party = document.createElement("td");
      party.textContent = candidate.party;

      const votecount = document.createElement("td");
      votecount.textContent = candidate.voteCount;

      row.appendChild(sno);
      row.appendChild(name);
      row.appendChild(party);
      row.appendChild(votecount);

      candidatevote.appendChild(row);

      //pie chart using vote count
    })
  }catch(err){
    console.error("Error fetching candidates:", err);
  }
}
document.addEventListener("DOMContentLoaded", loadvotecount);

//pie chart showing
async function loadpiechart(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/candidate/vote/count/piechart",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const resdata = await res.json();
    const candidates = resdata.candidates;

    //piechart
    const labels = [];
    const votecount = [];
    const backgroundColor = [];
    

    candidates.forEach((candidate)=>{
      labels.push(candidate.name);
      votecount.push(candidate.voteCount);
      backgroundColor.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
    });

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Vote Count',
          data: votecount
        }]
      },
      options: {
        plugins: {
          colorschemes: {
            scheme: 'brewer.Paired12'
          },
          legend: {
            position: 'bottom',
            align: 'center', // or 'start', 'end'
            labels: {
              boxWidth: 20,
              padding: 15
            }
          }
        }
      }
    });
    

 }catch(err){
  console.error("Error fetching candidates:", err);
 }
}
document.addEventListener("DOMContentLoaded", loadpiechart);

//graph showing
async function loadgraph(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/candidate/vote/count/graph",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const resdata = await res.json();
    const candidates = resdata.candidates;

    //piechart
    const labels = [];
    const votecount = [];
    const backgroundColor = [];
    

    candidates.forEach((candidate)=>{
      labels.push(candidate.name);
      votecount.push(candidate.voteCount);
      backgroundColor.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
    });

    const ctx = document.getElementById('mygraph').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Vote Count',
          data: votecount,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false // Optional: hide legend for bar
          },
          colorschemes: {
              scheme: 'brewer.Paired12'
          }
        }
      }
    });
  }catch(err){
  console.error("Error fetching candidates:", err);
 }
}
document.addEventListener("DOMContentLoaded", loadgraph);

//win prediction
async function loadwinprediction(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/candidate/vote/count/predict",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const resdata = await res.json();
    const candidates = resdata.candidates;

    if (!candidates.length) {
      document.querySelector(".win_prediction").innerText = "No candidates found.";
      return;
    }

    const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
    
    const labels = [];
    const probabilities = [];
    const backgroundColor = [];
    const pointColors = [];

    let maxVotes = -1;
    let winnerIndex = -1;
    candidates.forEach((c, i) => {
      labels.push(c.name);
      const probability = ((c.voteCount / totalVotes) * 100).toFixed(2);
      probabilities.push(probability);
    
      if (c.voteCount > maxVotes) {
        maxVotes = c.voteCount;
        winnerIndex = i;
      }
    
      backgroundColor.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
    });

    for (let i = 0; i < candidates.length; i++) {
      if (i === winnerIndex) {
        pointColors.push('green'); // Highlight winner
      } else {
        pointColors.push('red');
      }
    }

    const ctx = document.getElementById('winPredictionChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Win Probability (%)',
          data: probabilities,
          borderColor: 'grey',
          backgroundColor: backgroundColor,
          pointBackgroundColor: pointColors,
          tension: 0.4, // Curved line
          fill: false,
          pointRadius: (ctx) => ctx.dataIndex === winnerIndex ? 8 : 5,
          pointHoverRadius: 9,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Probability (%)'
            },
            grid: {
                display: false // removes horizontal grid lines
            }
          },
          x: {
            title: {
              display: true,
              text: 'Candidates'
            },
            grid: {
                display: false // removes horizontal grid lines
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed.y}%`;
              }
            }
          }
        }
      }
    });
  }catch(err){
    document.querySelector(".win_prediction").innerText = "Error loading prediction.";
  }
}
document.addEventListener("DOMContentLoaded", loadwinprediction);

//current vote status showing on dashboard
async function loadcurrentvotestatus(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/user/current/votestatus",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const resdata = await res.json();
    const person = resdata.person;

    console.log("user data", person);

    const votecount = person.isvoted;
    const messageofvote = document.querySelector("#messageofvote");
    if(votecount > 0){

      document.querySelector("#voting_done").style.display = "block";
      document.querySelector("#voting_pending_animation").style.display = "none";
      lottie.loadAnimation({
        container: document.getElementById('voting_done'), 
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/Done.json'
      });

      messageofvote.innerHTML = `<span style="color: green; font-weight: bold;">Thank you</span> for your valuable vote and time!`;
    }else{
      document.querySelector("#voting_done").style.display = "none";
      document.querySelector("#voting_pending_animation").style.display = "block ";
      lottie.loadAnimation({
        container: document.getElementById('voting_pending_animation'), 
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/Election concept Lottie JSON animation.json'
      });
      messageofvote.innerHTML = `<span style="color: red; font-weight: bold;">Please cast your vote</span>  and be a part of our nation`;
    }
  }catch(err){
    console.error("Error fetching current status:", err);
  }
}
document.addEventListener("DOMContentLoaded", loadcurrentvotestatus);

//showing dashboard election vote tally of top 5 candidates
async function loadtopcandidates(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/candidate/vote/topcandidates",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    const candidates = data.candidates;

    const prevVotes = JSON.parse(localStorage.getItem("prevVotes")) || {};

    const topfive = candidates.slice(0,3);
    const candidatevote = document.querySelector("#top_candidates");
    topfive.forEach((candidate,index)=>{
      const row = document.createElement("tr");
      const sno = document.createElement("td");
      sno.textContent = `${index+1}.`;

      const name = document.createElement("td");
      name.textContent = candidate.name;
      
      const votecount = document.createElement("td");
      votecount.textContent = candidate.voteCount;

      const prev = prevVotes[candidate._id]; // Use unique ID
      if (prev !== undefined && candidate.voteCount > prev) {
        const arrow = document.createElement("span");
        arrow.innerHTML = " &#x2191;"; // Up arrow
        arrow.style.color = "green";
        arrow.style.marginLeft = "";
        votecount.appendChild(arrow);
      }

      // Update prevVotes for next time
      prevVotes[candidate._id] = candidate.voteCount;

      row.appendChild(sno);
      row.appendChild(name);
      row.appendChild(votecount);

      candidatevote.appendChild(row);
    });
    localStorage.setItem("prevVotes", JSON.stringify(prevVotes));
  }catch(err){
    console.error("Error fetching candidates:", err);
  }
}
document.addEventListener("DOMContentLoaded",loadtopcandidates);


//showing graph on dashboard
async function loadgraphstats(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/candidate/vote/dashboard/graph",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const resdata = await res.json();
    const candidates = resdata.candidates;

    //piechart
    const labels = [];
    const votecount = [];
    const backgroundColor = [];
    
    const topfive = candidates.slice(0,5);
    topfive.forEach((candidate)=>{
      labels.push(candidate.name);
      votecount.push(candidate.voteCount);
      backgroundColor.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
    });

    const ctx = document.getElementById('voteChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Vote Count',
          data: votecount,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            display: false  // hides x-axis labels
          },
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false // Optional: hide legend for bar
          },
          colorschemes: {
              scheme: 'brewer.Paired12'
          }
        }
      }
    });
  }catch(err){
  console.error("Error fetching candidates:", err);
 }
}
document.addEventListener("DOMContentLoaded", loadgraphstats);

//election details header animation
lottie.loadAnimation({
  container: document.querySelector(".details_animation"), 
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/information, info.json'
});

//guidelines heading animation
lottie.loadAnimation({
  container: document.querySelector(".guidelines_animation"), 
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/Man with task list.json'
});

//election dates animation
lottie.loadAnimation({
  container: document.querySelector(".dates_animation"), 
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/Calendar Success Add.json'
});


// election dates announcement
const announcement = document.querySelector(".announcement");
announcement.addEventListener("submit",async(event)=>{
  event.preventDefault();
  const token = localStorage.getItem("token");

  const election_title = document.querySelector("#election_title").value;
  const nomination_start = document.querySelector("#nomination_start").value;
  const nomination_end = document.querySelector("#nomination_end").value;
  const final_candidate_list_date = document.querySelector("#final_candidate_list_date").value;
  const voting_start = document.querySelector("#voting_start").value;
  const voting_end = document.querySelector("#voting_end").value;
  const result_declaration_date = document.querySelector("#result_declaration_date").value;

  try{
    const res = await fetch("http://localhost:3000/election/dates", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title: election_title, 
        nomination_start, 
        nomination_end, 
        final_candidate_list: final_candidate_list_date,
        voting_start, 
        voting_end, 
        result_declaration: result_declaration_date
      })
    });

    const data = await res.json();
    const dateresponse = document.querySelector("#dateresponse");

    if(res.ok){
      dateresponse.innerText = "Election Dates are announced";
      dateresponse.style.color = "green";
      location.reload();
    }else{
      dateresponse.innerText = data.dateresponse;
      dateresponse.style.color = "red";
    }
  }catch(err){
    console.error("Frontend Error:", err);
    document.querySelector("#dateresponse").innerText = " Network error ";
  }
})


//helper function for making date 
function formdates(datestring){
  return new Date(datestring).toLocaleDateString('en-GB',{
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).replace(/am|pm/, match => match.toUpperCase());
}
//announcement dates display
async function announcementdatesofelection(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/election/announcement/election/dates",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    const elections = data.elections;
    console.log("Received nomination_start:", data);
    
    const nomination_time = document.querySelector("#nomination_time");
    nomination_time.innerHTML = `<strong>📝 Nomination Start:</strong> ${formdates(elections.nomination_start)}`;

    const nomination_end_time = document.querySelector("#nomination_end_time");
    nomination_end_time.innerHTML = `<strong>📝 Nomination End:</strong> ${new Date(elections.nomination_end).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/am|pm/, match => match.toUpperCase())
    }`;

    const final_candidate_list_date_time = document.querySelector("#final_candidate_list_date_time");
    final_candidate_list_date_time.innerHTML = `<strong>📃 Final List of Candidates:</strong> ${formdates(elections.final_candidate_list)}`;

    
    const voting_start_time = document.querySelector("#voting_start_time");
    voting_start_time.innerHTML = `<strong>🗳️ Voting Start:</strong> ${new Date(elections.voting_start).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/am|pm/, match => match.toUpperCase())
    }`;

    const voting_end_time = document.querySelector("#voting_end_time");
    voting_end_time.innerHTML = `<strong>🔒 Voting End:</strong> ${new Date(elections.voting_end).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/am|pm/, match => match.toUpperCase())
    }`;

    const result_time = document.querySelector("#result_time");
    result_time.innerHTML = `<strong> 📢 Result Declaration:</strong> ${new Date(elections.result_declaration).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/am|pm/, match => match.toUpperCase())
    }`;

  }catch(err){
    console.error("not fetching dates", err);
  }
}

document.addEventListener("DOMContentLoaded", announcementdatesofelection);

//announcement dates are also displaying on admin panel for updation and deletion
let electiondata = {};
async function loaddates(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/election/announcement/election/dates",{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    const elections = data.elections;
    electiondata = elections;
    startCountdown(elections.voting_start);
    renderCalendar(currentMonth, currentYear); 

    const title_name = document.querySelector("#title_name");
    title_name.innerHTML = `<strong>📝 Election Name:</strong> ${elections.title}`;


    const nomination_time = document.querySelector("#nomination_time1");
    nomination_time.innerHTML = `<strong>📝 Nomination Start:</strong> ${formdates(elections.nomination_start)}`;

    const nomination_end_time = document.querySelector("#nomination_end_time1");
    nomination_end_time.innerHTML = `<strong>📝 Nomination End:</strong> ${new Date(elections.nomination_end).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/am|pm/, match => match.toUpperCase())
    }`;

    const final_candidates_time = document.querySelector("#final_candidates_time");
    final_candidates_time.innerHTML = `<strong>📝 Final List of Candidates:</strong> ${formdates(elections.final_candidate_list)}`;


    const voting_start_time = document.querySelector("#voting_start_time1");
    voting_start_time.innerHTML = `<strong>🗳️ Voting Start:</strong> ${new Date(elections.voting_start).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/am|pm/, match => match.toUpperCase())
    }`;

    const voting_end_time = document.querySelector("#voting_end_time1");
    voting_end_time.innerHTML = `<strong>🔒 Voting End:</strong> ${new Date(elections.voting_end).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/am|pm/, match => match.toUpperCase())
    }`;

    const result_time = document.querySelector("#result_time1");
    result_time.innerHTML = `<strong> 📢 Result Declaration:</strong> ${new Date(elections.result_declaration).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).replace(/am|pm/, match => match.toUpperCase())
    }`;

  }catch(err){
    console.error("not fetching dates", err);
  }
}
document.addEventListener("DOMContentLoaded", loaddates);

//helper function for new format of date
function formatDateForInput(dateStr) {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


//update and delete functionality of dates in date model
const edit = document.querySelector(".edit");
edit.addEventListener("click",()=>{
  const date_model = document.querySelector(".date_model");
  date_model.style.display = "";
  document.querySelector("#edit_title").value = electiondata.title || "";
  document.querySelector("#edit_nomination_start").value = formatDateForInput(electiondata.nomination_start);
  document.querySelector("#edit_nomination_end").value = formatDateForInput(electiondata.nomination_end);
  document.querySelector("#edit_final_candidate_list_date").value = formatDateForInput(electiondata.final_candidate_list);
  document.querySelector("#edit_voting_start").value = formatDateForInput(electiondata.voting_start);
  document.querySelector("#edit_voting_end").value = formatDateForInput(electiondata.voting_end);
  document.querySelector("#edit_result_declaration_date").value = formatDateForInput(electiondata.result_declaration);
})

const cancel =document.querySelector(".cancel");
cancel.addEventListener("click",()=>{
  const date_model = document.querySelector(".date_model");
  date_model.style.display = "none";
})


//for comparing dates we normalize first to similar date format
function normalizeDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const iso = date.toISOString(); // returns in UTC
  return iso.slice(0, 16); // "yyyy-MM-ddTHH:mm"
}

//update 
const date_edit = document.querySelector(".date_edit");
date_edit.addEventListener("submit",async(event)=>{
  event.preventDefault();
  const dateid = electiondata.id;
  const token = localStorage.getItem("token");
  const changeddata = {
    title: document.getElementById("edit_title").value,
    nomination_start: document.getElementById("edit_nomination_start").value,
    nomination_end: document.getElementById("edit_nomination_end").value,
    final_candidate_list: document.getElementById("edit_final_candidate_list_date").value,
    voting_start: document.getElementById("edit_voting_start").value,
    voting_end: document.getElementById("edit_voting_end").value,
    result_declaration: document.getElementById("edit_result_declaration_date").value,
  }
  const issame = 
  changeddata.title === electiondata.title &&
  normalizeDate(changeddata.nomination_start) === normalizeDate(electiondata.nomination_start) &&
  normalizeDate(changeddata.nomination_end) === normalizeDate(electiondata.nomination_end) &&
  normalizeDate(changeddata.final_candidate_list) === normalizeDate(electiondata.final_candidate_list) &&
  normalizeDate(changeddata.voting_start) === normalizeDate(electiondata.voting_start) &&
  normalizeDate(changeddata.voting_end) === normalizeDate(electiondata.voting_end) &&
  normalizeDate(changeddata.result_declaration) === normalizeDate(electiondata.result_declaration);

  if(issame){
    alert("No changes made 😒");
    return;
  }

  try{
    const res = await fetch(`http://localhost:3000/election/${dateid}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(changeddata)
    });
    const data = await res.json();
    if(res.ok){
      alert("Successfully Updated 🎉");
      location.reload();
    }else{
      alert(result.message,"error");
    }

  }catch(err){
    console.error("Update error", err);
  }
})

//delete
const btndelete = document.querySelector(".deletebtn");
btndelete.addEventListener("click",async(event)=>{
  const token = localStorage.getItem("token");
  const dateid = electiondata.id;
  try{
    const res = await fetch(`http://localhost:3000/election/${dateid}`,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if(res.ok){
      alert(data.message);
      location.reload();
    }else{
      console.log("error");
    }
  }catch(err){
    console.error("delete error",err);
  }
})

function startCountdown(votingStartTimeString) {
  const countdownElement = document.getElementById("countdown");
  const targetTime = new Date(votingStartTimeString).getTime();

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance <= 0) {
      clearInterval(interval);
      countdownElement.querySelector("h2").innerText = "Voting Started!";
      document.getElementById("days").innerText = "00";
      document.getElementById("hours").innerText = "00";
      document.getElementById("minutes").innerText = "00";
      document.getElementById("seconds").innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
  }, 1000);
}

//calendar
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function renderCalendar(month, year) {
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
  document.getElementById('month-name').textContent = `${monthName} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const calendarDates = document.getElementById('calendar-dates');
  calendarDates.innerHTML = "";

  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  const highlightDates = {};
  if (electiondata) {
    highlightDates[new Date(electiondata.nomination_start).toDateString()] = 'Nomination Start';
    highlightDates[new Date(electiondata.nomination_end).toDateString()] = 'Nomination End';
    highlightDates[new Date(electiondata.final_candidate_list).toDateString()] = 'Final List';
    highlightDates[new Date(electiondata.voting_start).toDateString()] = 'Voting Start';
    highlightDates[new Date(electiondata.voting_end).toDateString()] = 'Voting End';
    highlightDates[new Date(electiondata.result_declaration).toDateString()] = 'Result';
  }

  // Add empty divs for offset
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarDates.appendChild(empty);
  }

  // Add day numbers
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    const date = new Date(year, month, i).toDateString();

    // Highlight today
    if (isCurrentMonth && i === today.getDate()) {
      const span = document.createElement("span");
      span.classList.add("today");
      span.textContent = i;
      day.appendChild(span);
    } else {
      day.textContent = i;
    }
    if (highlightDates[date]) {
      day.classList.add("highlight");
      day.setAttribute("data-tooltip", highlightDates[date]); // ✅ Use data-tooltip for custom tooltip
    }
    calendarDates.appendChild(day);
  }
}

// Event listeners for navigation
document.getElementById('prev').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

document.getElementById('next').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

//navigate to each page
document.querySelectorAll(".head1 i").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    const section = e.currentTarget.parentElement.classList[1]; 
    document.querySelector(`.list_items1 li.${section}`).click();
  });
});

//logout function
const logout = document.querySelector(".logout");
logout.addEventListener("click",async()=>{
  try{
    const res = await fetch("http://localhost:3000/user/signout",{
      method: "POST"
    });
    if(res.ok){
      localStorage.removeItem("token");
      window.location.href = "../index.html";
    }
  }catch(err){
    console.error("logout error",err);
  }
})

//notification function
async function loadnotification(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/notifications/notification",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    //console.log("fetch data",data);
    const notifications = data.notifications;

    const notification_content = document.querySelector(".notification_content ul");
    const signal = document.querySelector(".signal");
   
    let unreadcount = 0;
    notifications.forEach(notification =>{
      const li = document.createElement("li");
      li.innerText = `${notification.title}: ${notification.message}`;
      li.setAttribute("data-id", notification.id);
      li.classList.add("notification-item");
      if (notification.is_read) {
        li.classList.add("read");
      }else{
        unreadcount++;
      }
      notification_content.appendChild(li);
    });

    if(unreadcount>0){
      signal.style.display = "block";
    }else{
      signal.style.display = "none";
    }
  }catch(err){
    console.error("notification error",err);
  }
}
document.addEventListener("DOMContentLoaded", loadnotification);

//marking as read function of notification
async function markread(notificationid){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/notifications/read",{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body:JSON.stringify({notificationid})
    });
    const data = await res.json();
    if(data.success){
      console.log("notification read");
    }
  }catch(err){
    console.error("notification error",err);
  }
}

document.querySelector(".notification_content ul").addEventListener("click", (e) => {
  if (e.target.tagName === "LI" && e.target.dataset.id) {
    const notificationId = e.target.dataset.id;
    markread(notificationId);
    e.target.classList.add("read");

    const alllist = document.querySelectorAll(".notification_content ul li");
    const unreadli = Array.from(alllist).filter(li =>!li.classList.contains("read"));

    if(unreadli.length === 0){
      document.querySelector(".signal").style.display = "none";
    }
  }
});


//notification appearing and disappearing functions
const notification = document.querySelector(".notification");
const notification_content = document.querySelector("#notifications_card");
notification.addEventListener("click",(e)=>{
  e.stopPropagation();
  notification_content.classList.remove("hidden");
  notification_content.classList.add("show");
  
})
document.addEventListener("click",(e)=>{
  if(!notification.contains(e.target) && !notification_content.contains(e.target)){
    notification_content.classList.remove("show");
    notification_content.classList.add("hidden");
  }
})

/* dashboard block showing*/
const sidebarItems = document.querySelectorAll('.list_items1 li, .list_items2 li');
const allContent = document.querySelectorAll('.content-box');

sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    // Get class name of clicked item (excluding common ones)
    const sectionClass = Array.from(item.classList).find(c =>
      !['fa-solid', 'fa-brands', 'help', 'logout', 'settings', 'password_change','theme','light_mode','dark_mode'].includes(c)
    );

    // If it's help, logout, or settings, skip opening a section
    if (!sectionClass) return;

    // Hide all content boxes
    allContent.forEach(box => box.classList.remove('active'));

    // Remove active class from all sidebar items
    sidebarItems.forEach(i => i.classList.remove('active'));

    // Show the content box with that class
    const contentToShow = document.querySelector(`.content-box.${sectionClass}`);
    if (contentToShow) {
      contentToShow.classList.add('active');
    }

    // Highlight the clicked sidebar item
    item.classList.add('active');
  });
});


//settings pop up block
const settingsBtn = document.querySelector(".settings");
const settingsUI = document.querySelector(".settings_hover_ui");
let isOpen = false;

settingsBtn.addEventListener("click", () => {
    if (!isOpen) {
        settingsUI.style.display = "block";

        // Animate icons from left
        gsap.from(".settings_hover_ui li", {
            x: -50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });
        
        // Light glow effect on the whole box
        gsap.fromTo(".settings_hover_ui", 
            {boxShadow: "0 0 0 rgba(0,0,0,0)"},
            {boxShadow: "0 0 20px rgba(100,100,255,0.6)", duration: 0.3}
        );
        //clicking sound
        //const toggleSound = document.getElementById('toggleSound');
        //toggleSound.play();
        
        isOpen = true;
    } else {
        gsap.to(".settings_hover_ui ", {
            opacity: 0,
            y: -20,
            duration: 0.3,
            onComplete: () => {
                settingsUI.style.display = "none";
                gsap.set(".settings_hover_ui", {opacity: 1, y: 0}); // reset
            }
        });
        isOpen = false;
    }
});

document.addEventListener("click", (e) => {
  const isClickInside = settingsBtn.contains(e.target) || settingsUI.contains(e.target);
  if (!isClickInside && isOpen) {
    gsap.to(".settings_hover_ui", {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        settingsUI.style.display = "none";
        gsap.set(".settings_hover_ui", {opacity: 1, y: 0}); // reset
        isOpen = false;
      }
    });
  }
});


//click event on password change
const password_change = document.querySelector(".password_change");
password_change.addEventListener("click",()=>{
  window.location.href = "../password/password.html";
})

//notification on and off
const notificationToggle = document.querySelector("#notificationToggle");
notificationToggle.addEventListener("change",async(e)=>{
  const token = localStorage.getItem("token");
  const ischecked = e.target.checked;
  try{
    const res = await fetch("http://localhost:3000/user/profile/notifications/status",{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body:JSON.stringify({notifications: ischecked})
    });

    const data = await res.json();
    if(data.success){
      console.log("notification setting updated");
    }
  }catch(err){
    console.error("Error while updating notification:", err);
  }
})

//light and dark mode model open
const theme = document.querySelector(".theme");
const theme_wrap = document.querySelector(".theme_wrap");

let modelopen=0;
theme.addEventListener("click", () => {
  if (!modelopen) {
    theme_wrap.style.display = "block";

      // Animate icons from left
      gsap.from(".theme_wrap li", {
          x: -50,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)"
      });
      
      // Light glow effect on the whole box
      gsap.fromTo(".theme_wrap", 
          {boxShadow: "0 0 0 rgba(0,0,0,0)"},
          {boxShadow: "0 0 20px rgba(100,100,255,0.6)", duration: 0.3}
      );
      //clicking sound
      //const toggleSound = document.getElementById('toggleSound');
      //toggleSound.play();
      
      modelopen = true;
  } else {
      gsap.to(".theme_wrap ", {
          opacity: 0,
          y: -20,
          duration: 0.3,
          onComplete: () => {
              theme_wrap.style.display = "none";
              gsap.set(".theme_wrap", {opacity: 1, y: 0}); // reset
          }
      });
      modelopen = false;
  }
});

document.addEventListener("click", (e) => {
const isClickInside = theme.contains(e.target) || theme_wrap.contains(e.target);
if (!isClickInside && modelopen) {
  gsap.to(".theme_wrap", {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      theme_wrap.style.display = "none";
      gsap.set(".theme_wrap", {opacity: 1, y: 0}); // reset
      modelopen = false;
    }
  });
}
});

//light and dark mode
const dark_mode = document.querySelector(".dark_mode");
const light_mode = document.querySelector(".light_mode");

if(localStorage.getItem("theme")=== "dark"){
  document.body.classList.add("dark-mode");
}
dark_mode.addEventListener("click",async()=>{
  document.body.classList.add("dark-mode");
  localStorage.setItem("theme","dark");
})
light_mode.addEventListener("click",()=>{
  document.body.classList.remove("dark-mode");
  localStorage.setItem("theme","light");
})


//for small screen sidebar opening and closing
const smallscreenwrap = document.querySelector(".sidebar");
const menu = document.querySelector(".menu");
const closemenu = document.querySelector(".closemenu i");
menu.addEventListener("click", (e) => {
  e.stopPropagation();

  gsap.set(".sidebar", { display: "block", x: -50, opacity: 0 });

  gsap.to(".sidebar", {
    x: 0,
    opacity: 1,
    duration: 0.4,
    ease: "power2.out",
  });
});

closemenu.addEventListener("click",(e)=>{
  e.stopPropagation();
  gsap.to(".sidebar ", {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
        smallscreenwrap.style.display = "none";
        gsap.set(".sidebar", {opacity: 1, y: 0}); // reset
    }
});
})

//user profile loading

async function loadprofileimage(){
  const token = localStorage.getItem("token");
  try{
    const res = await fetch("http://localhost:3000/user/profileimage",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    const data = await res.json();
    console.log("data:", data);
    document.getElementById("profileimage").src = data.avatar;
    document.getElementById("profileinfoimage").src = data.avatar;
  }catch(err){
    console.error("error loading profile:", err);
  }
}
document.addEventListener("DOMContentLoaded", loadprofileimage);