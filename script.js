// Basic page wiring, 3D background, and pipeline scroll animation
document.addEventListener('DOMContentLoaded', () => {
  // update footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // GSAP & ScrollTrigger animations
  gsap.registerPlugin(ScrollTrigger);

  // reveal sections
  gsap.utils.toArray('.section, .hero-left, .project-info, .profile-card').forEach((el, i) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.8, delay: i * 0.08,
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
    });
  });

  // Pipeline stages -- animate when pipeline enters viewport
  const stages = document.querySelectorAll('.pipeline .stage, .pipeline .arrow');
  gsap.fromTo(stages, { y: 30, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.6, stagger: 0.25,
    scrollTrigger: { trigger: '#projects .pipeline', start: 'top 70%', once: true }
  });

  // Simple interactivity: hover on stage glows
  document.querySelectorAll('.stage').forEach(s => {
    s.addEventListener('mouseenter', () => gsap.to(s, { scale: 1.06, boxShadow: '0 10px 30px rgba(0,0,0,0.6)'}));
    s.addEventListener('mouseleave', () => gsap.to(s, { scale: 1, boxShadow: '0 6px 20px rgba(0,0,0,0.4)'}));
  });

  // --------------- Three.js animated particle background ---------------
  const canvas = document.querySelector('#bg');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 2000);
  camera.position.z = 120;

  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // particle geometry
  const pts = 600;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(pts * 3);
  for (let i=0;i<pts;i++){
    positions[i*3 + 0] = (Math.random() - 0.5) * 800;
    positions[i*3 + 1] = (Math.random() - 0.5) * 600;
    positions[i*3 + 2] = (Math.random() - 0.5) * 800;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({color:0x00d4ff, size:2, opacity:0.6, transparent:true});
  const cloud = new THREE.Points(geometry, material);
  scene.add(cloud);

  // floating boxes to give depth (semi-transparent)
  const boxMat = new THREE.MeshBasicMaterial({color:0x062b3a, transparent:true, opacity:0.12});
  for(let i=0;i<9;i++){
    const box = new THREE.Mesh(new THREE.BoxGeometry(200, 80, 8), boxMat);
    box.position.set((i-4)*160, Math.sin(i)*80, -120 - (i*40));
    box.rotation.y = 0.2 * i;
    scene.add(box);
  }

  function onResize(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // subtle animation loop
  let t = 0;
  function animate() {
    t += 0.003;
    cloud.rotation.y += 0.0008;
    cloud.rotation.x = Math.sin(t) * 0.02;
    cloud.position.x = Math.sin(t*0.7) * 10;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // small nav hamburger for mobile (toggles links)
  const hamb = document.querySelector('.hamburger');
  hamb && hamb.addEventListener('click', ()=> {
    const nav = document.querySelector('.nav-links');
    if(nav.style.display === 'flex') nav.style.display = 'none';
    else nav.style.display = 'flex';
  });

  // Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if(!t) return;
      window.scrollTo({top: t.offsetTop - 80, behavior: 'smooth'});
    });
  });
});
