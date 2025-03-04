(function() {
  // Set our main variables
  let scene,  
    renderer,
    camera,
    model,                              // Our character
    neck,                               // Reference to the neck bone in the skeleton
    waist,
    sphere,                               // Reference to the waist bone in the skeleton
    possibleAnims,                      // Animations found in our file
    mixer,                              // THREE.js animations mixer
    idle,                               // Idle, the default state our character returns to
    clock = new THREE.Clock(),          // Used for anims, which run to a clock instead of frame rate 
    currentlyAnimating = false,         // Used to check whether characters neck is being used in another anim
    raycaster = new THREE.Raycaster(),  // Used to detect the click on our character
    loaderAnim = document.getElementById('js-loader');
  prevMousePosition = { x: 0, y: 0 },
  rotationSpeed = 0.01;
  init(); 
  


  function init() {
    
    const MODEL_PATH = './assests/model/boy.glb';
    const canvas = document.querySelector('#c');
    const canvasContainer = document.querySelector('#canvas-container');
    const backgroundColor = 0x000000;
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
    // Init the scene
    scene = new THREE.Scene();
    function onMouseDown(event) {
      prevMousePosition.x = event.clientX;
      prevMousePosition.y = event.clientY;
    }


    function onMouseMove(event) {
      if (event.buttons === 1) {
        const deltaX = event.clientX - prevMousePosition.x;
        const deltaY = event.clientY - prevMousePosition.y;
        const slowerRotationSpeed = 0.0009;
        model.rotation.y += deltaX * slowerRotationSpeed;

    
        // Limit the rotation angles around the X-axis
        const maxRotationX = Math.PI / 4; // Maximum rotation angle around the X-axis
        model.rotation.x = THREE.MathUtils.clamp(
          model.rotation.x + deltaY * rotationSpeed,
          -maxRotationX,
          maxRotationX
        );
    
        prevMousePosition.x = event.clientX;
        prevMousePosition.y = event.clientY;
      }
    }
    
    function onMouseUp(event) {
      prevMousePosition.x = event.clientX;
      prevMousePosition.y = event.clientY;
    }
    
    const fixedWidth = 400; // Set your desired width here
    const fixedHeight = 400; // Set your desired height here
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(fixedWidth, fixedHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    canvasContainer.appendChild(renderer.domElement);
    
    // Add a camera
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30 
    camera.position.x = 0;
    camera.position.y = -3;
    
    let stacy_txt = new THREE.TextureLoader().load('./assests/model/boytexture.png');
    stacy_txt.flipY = false;

    const stacy_mtl = new THREE.MeshPhongMaterial({
      map: stacy_txt,
      color: 0xffffff,
      skinning: true
    });

    
    var loader = new THREE.GLTFLoader();

    loader.load(
      MODEL_PATH,
      function(gltf) {
        model = gltf.scene;
        let fileAnimations = gltf.animations;

          model.traverse(o => {

          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = stacy_mtl;
          }
          // Reference the neck and waist bones
          if (o.isBone && o.name === 'mixamorig6:Head') { 
            neck = o;
          }
          if (o.isBone && o.name === 'mixamorig6:Spine1') { 
            waist = o;
          }
        });
        
        model.scale.set(12, 12, 12);
        model.position.y = -11;
        scene.add(model);
        
        loaderAnim.remove();
        
        mixer = new THREE.AnimationMixer(model);
        
         let clips = fileAnimations.filter(val => val.name !== 'idle');
          possibleAnims = clips.map(val => {
            let clip = THREE.AnimationClip.findByName(clips, val.name);

            clip.tracks.splice(3, 3);
            clip.tracks.splice(9, 3);

            clip = mixer.clipAction(clip);
            return clip;
          }
         );
        
        let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');
        
        idleAnim.tracks.splice(3, 3);
        idleAnim.tracks.splice(9, 3);
        
        idle = mixer.clipAction(idleAnim);
        idle.play();
        
      },
      undefined, // We don't need this function
      function(error) {
        console.error(error);
      }
    );
    
    // Add lights
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    scene.add(hemiLight);

    let d = 8.25;
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to scene
    scene.add(dirLight);
    
    
  // Floor
  let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
  let floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xeeeeee,
    shininess: 0,
      transparent: true,
      opacity: 0.0,
  });

  let floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = -11;
  scene.add(floor);
    
let geometry = new THREE.SphereGeometry(8, 32, 32);
let material = new THREE.MeshBasicMaterial({ color: 0xf2ce2e, transparent: true, opacity: 1.0 }); // 0xf2ce2e 
sphere = new THREE.Mesh(geometry, material);
    
sphere.position.z = -15;
sphere.position.y = -2.5;
sphere.position.x = -0.25;
scene.add(sphere);   
 }

 
  function update() {
    if (sphere) {
      const hue = (Date.now() * 0.0001) % 3.0; // Adjust the speed as needed
    const color = new THREE.Color().setHSL(hue, 0.9, 0.8);
    sphere.material.color = color;
      const scaleAmount = Math.sin(Date.now() * 0.002) * 0.1 + 1.0; // Adjust the amplitude and speed as needed
      sphere.scale.set(scaleAmount, scaleAmount, scaleAmount);
    }
    if (mixer) {
      mixer.update(clock.getDelta());
    }
    
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    
     renderer.render(scene, camera);
    requestAnimationFrame(update);
  }

  update();
  
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;
    
    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  
      window.addEventListener('click', e => raycast(e));
      window.addEventListener('touchend', e => raycast(e, true));

      function raycast(e, touch = false) {
        var mouse = {};
        if (touch) {
          mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
          mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
        } else {
          mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
          mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
        }
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects[0]) {
          var object = intersects[0].object;

          if (object.name === 'stacy') {

            if (!currentlyAnimating) {
              currentlyAnimating = true;
              playOnClick();
            }
          }
        }
      }
  
     // Get a random animation, and play it 
   function playOnClick() {
    let anim = Math.floor(Math.random() * possibleAnims.length) + 0;
    playModifierAnimation(idle, 0.25, possibleAnims[anim], 0.25);
  }


    function playModifierAnimation(from, fSpeed, to, tSpeed) {
      to.setLoop(THREE.LoopOnce);
      to.reset();
      to.play();
      from.crossFadeTo(to, fSpeed, true);
      setTimeout(function() {
        from.enabled = true;
        to.crossFadeTo(from, tSpeed, true);
        currentlyAnimating = false;
      }, to._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));
    }
  
    document.addEventListener('mousemove', function(e) {
      console.log('Mouse moved:', e.clientX, e.clientY);
      var mousecoords = getMousePos(e);
      console.log('Mouse coordinates:', mousecoords);
      if (neck && waist) {
        moveJoint(mousecoords, neck, 50);
        moveJoint(mousecoords, waist, 30);
      }
    });

  function getMousePos(e) {
    return { x: e.clientX, y: e.clientY };
  }
  
  function moveJoint(mouse, joint, degreeLimit) {
    let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
    console.log('Degrees:', degrees);
    joint.rotation.y = THREE.Math.degToRad(degrees.x);
    joint.rotation.x = THREE.Math.degToRad(degrees.y);
  }
  function getMouseDegrees(x, y, degreeLimit) {
    let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage;
  
    let w = { x: window.innerWidth, y: window.innerHeight };
  
    // Left (Rotates neck left between 0 and -degreeLimit)
    if (x <= w.x / 2) {
      xdiff = w.x / 2 - x;
      xPercentage = (xdiff / (w.x / 2)) * 100;
      dx = ((degreeLimit * xPercentage) / 100) * -1;
    }
  
    // Right (Rotates neck right between 0 and degreeLimit)
    if (x >= w.x / 2) {
      xdiff = x - w.x / 2;
      xPercentage = (xdiff / (w.x / 2)) * 100;
      dx = (degreeLimit * xPercentage) / 100;
    }
  
    // Up (Rotates neck up between 0 and -degreeLimit)
    if (y <= w.y / 2) {
      ydiff = w.y / 2 - y;
      if (ydiff === 0) {
        dy = 0;
      } else {
        yPercentage = (ydiff / (w.y / 2)) * 100;
        // Note that I cut degreeLimit in half when she looks up
        dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
      }
    }
  
    // Down (Rotates neck down between 0 and degreeLimit)
    if (y >= w.y / 2) {
      ydiff = y - w.y / 2;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      dy = (degreeLimit * yPercentage) / 100;
    }
  
    return { x: dx, y: dy };
  }
  
  })();