// ====================== Sections & Navigation ======================
const sections = document.querySelectorAll('.container, .hero');
const navLinks = document.querySelectorAll('nav a');
const exploreBtn = document.querySelector('.btn');
const sectionIds = ["home", "2020", "2021", "2022", "2023", "2024", "2025", "TY"];
let currentIndex = 0;

// ====================== Canvas for Leaves & Bees ======================
const canvas = document.createElement("canvas");
canvas.id = "natureCanvas";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.pointerEvents = "none";
canvas.style.zIndex = 999;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function random(min, max) { return Math.random() * (max - min) + min; }

// ------------------- Leaves -------------------
let leaves = [];
function createLeaves(count = 30) {
    leaves = [];
    for (let i = 0; i < count; i++) {
        leaves.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height),
            size: random(10, 25),
            speedX: random(-1, 1),
            speedY: random(1, 3),
            rotation: random(0, Math.PI*2),
            rotationSpeed: random(-0.02, 0.02),
            color: `hsl(${random(20,50)}, 70%, 50%)`
        });
    }
}
function drawLeaves() {
    leaves.forEach(leaf => {
        leaf.x += leaf.speedX;
        leaf.y += leaf.speedY;
        leaf.rotation += leaf.rotationSpeed;
        if (leaf.y > canvas.height) leaf.y = -leaf.size;
        if (leaf.x > canvas.width) leaf.x = 0;
        if (leaf.x < 0) leaf.x = canvas.width;
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.fillStyle = leaf.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size/2, leaf.size, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    });
}

// ------------------- Bees -------------------
let bees = [];
function createBees(count = 8) {
    bees = [];
    for (let i = 0; i < count; i++) {
        bees.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height),
            size: random(15, 25),
            speedX: random(1, 3),
            speedY: random(-1, 1),
            wingOffset: random(0, Math.PI*2),
            wingSpeed: random(0.2, 0.5),
            color: "yellow"
        });
    }
}
function drawBees() {
    bees.forEach(bee => {
        bee.x += bee.speedX;
        bee.y += bee.speedY;
        bee.wingOffset += bee.wingSpeed;
        if (bee.x > canvas.width) bee.x = 0;
        if (bee.x < 0) bee.x = canvas.width;
        if (bee.y > canvas.height) bee.y = 0;
        if (bee.y < 0) bee.y = canvas.height;

        ctx.save();
        ctx.translate(bee.x, bee.y);
        // Body
        ctx.fillStyle = bee.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, bee.size*0.6, bee.size*0.35, 0, 0, Math.PI*2);
        ctx.fill();
        // Stripes
        ctx.fillStyle = "black";
        ctx.fillRect(-bee.size*0.35, -bee.size*0.15, bee.size*0.7, bee.size*0.12);
        ctx.fillRect(-bee.size*0.35, 0, bee.size*0.7, bee.size*0.12);
        // Head
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(bee.size*0.4, 0, bee.size*0.15, 0, Math.PI*2);
        ctx.fill();
        // Wings
        ctx.fillStyle = "rgba(200,200,255,0.5)";
        const wingY = Math.sin(bee.wingOffset) * bee.size/3;
        ctx.beginPath();
        ctx.ellipse(-bee.size/2, -wingY, bee.size*0.4, bee.size*0.2, -0.3, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(bee.size/2, -wingY, bee.size*0.4, bee.size*0.2, 0.3, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    });
}

// ------------------- Animate Nature -------------------
let natureAnimationId = null;
function animateNature() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawLeaves();
    drawBees();
    natureAnimationId = requestAnimationFrame(animateNature);
}

// ====================== Sections Show Function ======================
function showSection(targetId) {
    sections.forEach(sec => sec.style.display = 'none');
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;
    targetSection.style.display = 'block';

    // Hero animation
    if (targetId === 'home') {
        targetSection.classList.remove('show');
        setTimeout(()=> targetSection.classList.add('show'),50);
        document.querySelector('nav').style.display='none';
    } else {
        document.querySelector('nav').style.display='block';
    }

    // Card animation
    const cards = targetSection.querySelectorAll('.card');
    cards.forEach((card,index)=>{
        card.classList.remove('show');
        setTimeout(()=> card.classList.add('show'), index*150);
    });

    // TY section
    if(targetId === "TY") {
        const thankYou = document.getElementById("thankYouMessage");
        if(thankYou){
            thankYou.style.display = "block"; // ensure visible
            thankYou.classList.remove("show");
            setTimeout(()=>thankYou.classList.add("show"),200);
        }
        createLeaves();
        createBees();
        if(!natureAnimationId) animateNature();
    } else {
        // Stop nature animation
        if(natureAnimationId) {
            cancelAnimationFrame(natureAnimationId);
            natureAnimationId = null;
            ctx.clearRect(0,0,canvas.width,canvas.height);
        }
    }
}

// ====================== Next / Prev Buttons ======================
const nextBtn = document.createElement("button");
nextBtn.textContent = "Next ▶";
nextBtn.id="nextBtn"; nextBtn.style.display="none"; document.body.appendChild(nextBtn);
const prevBtn = document.createElement("button");
prevBtn.textContent = "◀ Prev";
prevBtn.id="prevBtn"; prevBtn.style.display="none"; document.body.appendChild(prevBtn);

function goToSection(index) {
    if(index<0 || index>=sectionIds.length) return;
    currentIndex = index;
    showSection(sectionIds[currentIndex]);
    prevBtn.style.display = currentIndex===0 ? "none" : "block";
    nextBtn.style.display = (currentIndex===0 || currentIndex===sectionIds.length-1) ? "none" : "block";
}

nextBtn.addEventListener("click",()=>goToSection(currentIndex+1));
prevBtn.addEventListener("click",()=>goToSection(currentIndex-1));
navLinks.forEach(link=>{
    link.addEventListener('click',e=>{
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        goToSection(sectionIds.indexOf(targetId));
    });
});
exploreBtn.addEventListener('click',e=>{
    e.preventDefault();
    goToSection(1);
});
window.addEventListener('load',()=>goToSection(0));



