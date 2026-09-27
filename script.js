import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.querySelector("#labCanvas");
const fallback = document.querySelector("#webglFallback");
const progressEl = document.querySelector("#progress");
const boot = document.querySelector("#boot");
const bootBar = document.querySelector("#bootBar");
const bootStatus = document.querySelector("#bootStatus");

const projects = [
  ["PROJECT 01","Pikobot","Fingerprint-controlled mood-changing interactive robot with weather and mood-related features.","Arduino","Embedded / Robotics"],
  ["PROJECT 02","Mini Weather Station","Arduino-based environmental monitoring concept using sensors and display output.","Arduino · Tinkercad","IoT / Sensors"],
  ["PROJECT 03","Arduino Gas Detector","Gas detection and alert system concept with sensor monitoring and warning logic.","Arduino · Sensors","Safety / IoT"],
  ["PROJECT 04","Home Automation System","Practical automation concept connecting household loads, control and sensing.","Arduino · IoT","Automation"],
  ["PROJECT 05","AutoCAD 2D Home Design","Engineering drawing and 2D residential layout design workflow.","AutoCAD","CAD / Design"],
  ["PROJECT 06","CGPA Calculator","Web-based semester CGPA calculator with course, marks and credit-weighted results.","HTML · CSS · JS","Web App"],
  ["PROJECT 07","Mess Expense Calculator","Web-based expense calculation project. Live link is reserved for the final URL.","HTML · CSS · JS","Web App"],
  ["PROJECT 08","Automatic Railway Gate System","Railway crossing automation concept using sensing, control logic and barrier actuation.","Arduino · Sensors","Control"],
  ["PROJECT 09","Smart Traffic Controller","Four-road controller concept with sensors, physical controls and coordinated barrier logic.","Arduino · Control","Smart Transport"],
  ["PROJECT 10","Mini Building Distribution and Wiring System","Miniature DB/MCB distribution system with separate lighting/socket circuits and protection.","DB · MCB · Wiring","Power / Protection"],
  ["PROJECT 11","Wireless Power Transfer","Transformer/coil-based wireless power transfer concept for practical demonstration.","Coils · Power","Power Electronics"]
];

function renderProjects(){
  const grid = document.querySelector("#projectGrid");
  grid.innerHTML = projects.map((p,i)=>`
    <article class="project-card reveal" data-index="${i}">
      <span class="project-id">${p[0]}</span>
      <h3>${p[1]}</h3>
      <p>${p[2]}</p>
      <div class="project-tech"><span>${p[3]}</span><span>${p[4]}</span></div>
      ${p[1] === "CGPA Calculator" ? '<a class="project-open project-live-link" href="CGPA.html" target="_blank" rel="noopener" aria-label="Open CGPA Calculator">OPEN CGPA CALCULATOR ↗</a>' : '<span class="project-open">VIEW PROJECT ↗</span>'}
    </article>`).join("");
}
renderProjects();

const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modalTitle");
const modalId = document.querySelector("#modalId");
const modalBody = document.querySelector("#modalBody");
const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.style.overflow=""; };
document.querySelector("#modalClose").addEventListener("click", closeModal);
document.querySelector(".modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if(e.key==="Escape") closeModal(); });
const certificateModal = {
  cards: document.querySelectorAll(".cert[data-cert]"),
  open(card){
    const n = card.dataset.cert;
    modalId.textContent = `CREDENTIAL / 0${n}`;
    modalTitle.textContent = `Certificate ${n}`;
    modalBody.innerHTML = `<div class="certificate-modal-media"><img src="assets/certificate ${n}.jpeg" alt="Certificate ${n}" onerror="this.outerHTML='<div class=\"certificate-missing\">Certificate image not found.<br><small>Add <b>assets/certificate ${n}.jpeg</b> to the project folder.</small></div>'"></div><p class="certificate-modal-note">This certificate is presented in the portfolio exactly as supplied by Mirza Pias Ahmed. The title and issuing details can be updated later without changing the portfolio structure.</p>`;
    modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
  }
};
certificateModal.cards.forEach(card=>{
  card.addEventListener("click",()=>certificateModal.open(card));
  card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();certificateModal.open(card);}});
});

document.querySelector("#projectGrid").addEventListener("click", e=>{
  if(e.target.closest("a.project-live-link")) return;
  const card=e.target.closest(".project-card"); if(!card) return;
  const p=projects[Number(card.dataset.index)];
  modalId.textContent=`${p[0]} / ENGINEERING PROJECT`;
  modalTitle.textContent=p[1];
  modalBody.innerHTML=`<p>${p[2]}</p><div class="modal-facts"><div><span>TECHNOLOGY</span><b>${p[3]}</b></div><div><span>CATEGORY</span><b>${p[4]}</b></div><div><span>STATUS</span><b>PROJECT / PORTFOLIO</b></div></div><p style="margin-top:25px">This project entry is presented as part of Mirza Pias Ahmed's engineering portfolio. Detailed documentation, live demos and repositories can be attached when their final links/assets are available.</p>`;
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
});

document.querySelectorAll("[data-placeholder]").forEach(a=>a.addEventListener("click",e=>e.preventDefault()));

const navToggle=document.querySelector(".nav-toggle"), navLinks=document.querySelector("#navLinks");
navToggle.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");navToggle.setAttribute("aria-expanded",String(open));});
navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));

function initThree(){
  if(!WebGL.isWebGL2Available()){
    fallback.classList.remove("hidden");
    return;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x04070a);
  scene.fog = new THREE.FogExp2(0x04070a, 0.028);

  const camera = new THREE.PerspectiveCamera(48, innerWidth/innerHeight, .1, 100);
  camera.position.set(0,1.7,10);

  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth<700?1.35:1.8));
  renderer.setSize(innerWidth,innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !reduced && innerWidth>700;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const ambient = new THREE.HemisphereLight(0x9ccbd4,0x030507,1.0);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xd9faff,3.2); key.position.set(-5,8,6); key.castShadow=true; scene.add(key);
  const cyan = new THREE.PointLight(0x4adff4,18,18,2); cyan.position.set(4,3,1); scene.add(cyan);
  const warm = new THREE.PointLight(0xffe1b1,8,15,2); warm.position.set(-5,2,-2); scene.add(warm);

  const matDark = new THREE.MeshStandardMaterial({color:0x111a1e,metalness:.55,roughness:.42});
  const matMetal = new THREE.MeshStandardMaterial({color:0x69767b,metalness:.88,roughness:.24});
  const matPCB = new THREE.MeshStandardMaterial({color:0x10251f,metalness:.18,roughness:.7});
  const matCopper = new THREE.MeshStandardMaterial({color:0xb87838,metalness:.9,roughness:.22});
  const matGlow = new THREE.MeshBasicMaterial({color:0x6be8f7});
  const matGlass = new THREE.MeshPhysicalMaterial({color:0x15272d,metalness:.2,roughness:.1,transparent:true,opacity:.58});
  const lab = new THREE.Group(); scene.add(lab);

  function box(w,h,d,m,x,y,z){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;lab.add(mesh);return mesh}
  function cyl(r,h,m,x,y,z,rotX=0){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),m);mesh.position.set(x,y,z);mesh.rotation.x=rotX;mesh.castShadow=true;lab.add(mesh);return mesh}
  function torus(r,t,m,x,y,z,rx=0,ry=0){const mesh=new THREE.Mesh(new THREE.TorusGeometry(r,t,10,48),m);mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,0);mesh.castShadow=true;lab.add(mesh);return mesh}

  // Workbench
  box(10,.28,3.7,matDark,0,0,0);
  box(10,.12,3.7,matMetal,0,.2,0);
  for(let x=-4;x<=4;x+=2) box(.16,1.8,.16,matMetal,x,-.85,-1.35);
  box(10,2.3,.12,matDark,0,1.5,-1.75);

  // Oscilloscope
  box(2.25,1.35,.75,matDark,-2.8,1.1,-.55);
  box(1.65,.82,.04,matGlass,-2.8,1.15,-.94);
  for(let i=0;i<7;i++) cyl(.055,.18,matMetal,-3.55+i*.23,.72,-.96,Math.PI/2);
  const wave = new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0x72e8f5}));
  const pts=[]; for(let i=0;i<180;i++){const x=-.72+i/179*1.44;pts.push(new THREE.Vector3(x-2.8,1.15+Math.sin(i*.18)*.22,-.965));}
  wave.geometry.setFromPoints(pts); scene.add(wave);

  // Function generator + power supply
  box(1.65,1.05,.65,matDark,-.55,.95,-.55);
  box(1.55,1.5,.72,matDark,1.45,1.12,-.55);
  for(let i=0;i<4;i++) cyl(.07,.04,matGlow,1.0+i*.27,1.45,-.95,Math.PI/2);

  // PCB
  const pcb = new THREE.Group(); pcb.position.set(2.8,2.8,-.2); scene.add(pcb);
  const board=new THREE.Mesh(new THREE.BoxGeometry(3.8,.11,2.35),matPCB); board.castShadow=true; pcb.add(board);
  for(let i=0;i<12;i++){
    const trace=new THREE.Mesh(new THREE.BoxGeometry(1.3,.018,.025),matCopper);
    trace.position.set(-1.0+(i%4)*.65,.07,-.72+Math.floor(i/4)*.65); trace.rotation.y=(i%2)*.12; pcb.add(trace);
  }
  const ic=new THREE.Mesh(new THREE.BoxGeometry(1.1,.18,.7),matDark);ic.position.set(0,.16,0);pcb.add(ic);
  for(let x=-.48;x<=.48;x+=.16){const pin=new THREE.Mesh(new THREE.BoxGeometry(.035,.08,.08),matMetal);pin.position.set(x,.1,-.43);pcb.add(pin);pin.clone().position.set(x,.1,.43);pcb.add(pin.clone());}
  for(let i=0;i<12;i++){const r=box(.18,.12,.45,matDark,0,0,0);r.parent=pcb;r.position.set(-1.3+(i%6)*.5,.15,-.72+Math.floor(i/6)*1.35)}
  const led1=new THREE.Mesh(new THREE.SphereGeometry(.09,12,12),matGlow);led1.position.set(1.35,.2,-.72);pcb.add(led1);
  const pcbRing=torus(1.9,.012,new THREE.MeshBasicMaterial({color:0x438c98,transparent:true,opacity:.45}),2.8,2.8,-.2,Math.PI/2,0); pcbRing.rotation.x=Math.PI/2;

  // Motor
  const motor=new THREE.Group(); motor.position.set(-.15,1.05,1.05); scene.add(motor);
  const housing=new THREE.Mesh(new THREE.CylinderGeometry(.65,.65,.95,32),matMetal);housing.rotation.z=Math.PI/2;motor.add(housing);
  const rotor=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,1.05,20),matDark);rotor.rotation.z=Math.PI/2;motor.add(rotor);
  for(let i=0;i<6;i++){const fin=new THREE.Mesh(new THREE.BoxGeometry(.45,.08,.08),matMetal);fin.position.set(0,Math.cos(i*Math.PI/3)*.42,Math.sin(i*Math.PI/3)*.42);motor.add(fin)}

  // Transformer
  box(1.35,1.15,1.15,matDark,3.2,1.0,1.05);
  for(let i=0;i<5;i++) torus(.38,.05,matCopper,3.2,.7+i*.15,1.05,0,Math.PI/2);

  // Server racks / monitor in background
  box(1.8,3.7,.8,matDark,5.0,1.8,-1.2);
  for(let i=0;i<7;i++){box(1.3,.28,.04,matMetal,5,0.25+i*.48,-1.63);const led=new THREE.Mesh(new THREE.SphereGeometry(.025,8,8),matGlow);led.position.set(4.45,.25+i*.48,-1.68);scene.add(led)}
  box(3.0,2.0,.18,matDark,-.2,3.2,-2.1);
  box(2.7,1.7,.02,matGlass,-.2,3.2,-2.22);

  // AI neural network
  const ai=new THREE.Group();ai.position.set(.1,3.4,-.8);scene.add(ai);
  const layers=[[-1.5,0,1.5],[-.9,-.3,.3,.9],[-.7,-.23,.23,.7],[-1.1,0,1.1]];
  const nodes=[];
  layers.forEach((ys,li)=>ys.forEach(y=>{const n=new THREE.Mesh(new THREE.SphereGeometry(.055,10,10),matGlow);n.position.set((li-1.5)*.75,y,.15*Math.sin(y*3));ai.add(n);nodes.push({mesh:n,li,y});}));
  for(let li=0;li<layers.length-1;li++){
    const a=nodes.filter(n=>n.li===li), b=nodes.filter(n=>n.li===li+1);
    a.forEach(na=>b.forEach(nb=>{
      const g=new THREE.BufferGeometry().setFromPoints([na.mesh.position,nb.mesh.position]);
      ai.add(new THREE.Line(g,new THREE.LineBasicMaterial({color:0x2b6874,transparent:true,opacity:.32})));
    }));
  }

  // Particles
  const count=innerWidth<700?380:850;
  const pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*18;pos[i*3+1]=Math.random()*7-1;pos[i*3+2]=(Math.random()-.5)*12-4;}
  const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pos,3));
  const pm=new THREE.PointsMaterial({color:0x6fd9e8,size:innerWidth<700?.025:.035,transparent:true,opacity:.42});
  const particles=new THREE.Points(pg,pm);scene.add(particles);

  // Circuit/data lines
  const lineGroup=new THREE.Group();scene.add(lineGroup);
  for(let i=0;i<18;i++){
    const y=.5+(i%6)*.32, x=-5+(i%3)*3;
    const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,y,-1.6),new THREE.Vector3(x+1.8,y,-1.6),new THREE.Vector3(x+2.3,y+.18,-1.6)]);
    lineGroup.add(new THREE.Line(g,new THREE.LineBasicMaterial({color:0x2b6975,transparent:true,opacity:.28})));
  }

  let mouseX=0,mouseY=0,scrollP=0;
  addEventListener("pointermove",e=>{mouseX=(e.clientX/innerWidth-.5);mouseY=(e.clientY/innerHeight-.5)});
  addEventListener("scroll",()=>{scrollP=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight);progressEl.style.height=(scrollP*100)+"%"},{passive:true});

  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".reveal").forEach(el=>gsap.fromTo(el,{y:45,opacity:0},{y:0,opacity:1,duration:.9,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}}));
    gsap.to(pcb.rotation,{y:Math.PI*4,duration:18,repeat:-1,ease:"none"});
    gsap.to(ai.rotation,{y:Math.PI*2,duration:28,repeat:-1,ease:"none"});
    gsap.to(motor.rotation,{x:Math.PI*2,duration:3.2,repeat:-1,ease:"none"});
    gsap.to(".hero-copy",{y:-50,opacity:.82,scrollTrigger:{trigger:"#home",start:"top top",end:"bottom top",scrub:true}});
    gsap.to(pcb.position,{y:4.3,x:2.0,scrollTrigger:{trigger:"#skills",start:"top bottom",end:"bottom top",scrub:1}});
    gsap.to(ai.position,{x:1.5,y:3.0,scrollTrigger:{trigger:"#dual",start:"top bottom",end:"bottom top",scrub:1}});
  }

  function resize(){
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.8));
    renderer.setSize(innerWidth,innerHeight);
  }
  addEventListener("resize",resize);

  const clock=new THREE.Clock();
  function animate(){
    const t=clock.getElapsedTime();
    const targetX=mouseX*.55, targetY=1.7-mouseY*.35;
    camera.position.x += (targetX-camera.position.x)*.025;
    camera.position.y += (targetY-camera.position.y)*.025;
    camera.lookAt(0,1.7,-.4);
    if(!reduced){
      particles.rotation.y=t*.008;
      lineGroup.position.x=Math.sin(t*.18)*.08;
      wave.position.x=Math.sin(t*1.5)*.02;
      pcb.rotation.z=Math.sin(t*.35)*.035;
      ai.position.z=-.8+Math.sin(t*.4)*.08;
    }
    renderer.render(scene,camera);
  }
  renderer.setAnimationLoop(animate);
}

initThree();

let pct=0;
const bootTimer=setInterval(()=>{
  pct+=4+Math.random()*8;
  if(pct>=100){pct=100;clearInterval(bootTimer);setTimeout(()=>boot.classList.add("done"),350);}
  bootBar.style.width=pct+"%";
  const labels=["3D ENGINE","PCB SYSTEM","AI CORE","DATA NETWORK","INTERFACE","SYSTEM READY"];
  bootStatus.textContent=(labels[Math.min(labels.length-1,Math.floor(pct/20))])+" · "+Math.round(pct)+"%";
},120);
