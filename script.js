document.addEventListener('DOMContentLoaded', function() {
  const svg = document.getElementById('stars');
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cursor = { x: width / 2, y: height / 2 };
  let startTime = Date.now(); // Variable to track animation start time
  const duration = 10000; // Duration in milliseconds

  function createStar() {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 2 + 1;
    const speed = size; // Speed based on size
    let opacity;

    // Determine opacity
    if (Math.random() < 0.9) {
        opacity = Math.random() * 0.3 * (1 - size / 10); // Random opacity between 0 and 0.3, adjusted by size for 80% of stars
    } else {
        opacity = Math.random() * (1 - 0.3) * (1 - size / 3) + 0.3; // Random opacity between 0.3 and 1, adjusted by size for the remaining 20% of stars
    }

    dot.setAttribute('cx', x);
    dot.setAttribute('cy', y);
    dot.setAttribute('r', size);
    dot.setAttribute('opacity', opacity);
    dot.classList.add('star');
    svg.appendChild(dot);

    return { element: dot, speed: speed, x: x, y: y, size: size, opacity: opacity }; // Store initial position, size, and opacity
}

const clouds = []; // Array to store cloud objects
let cloudSpeed = 0.2; // Speed at which clouds will move horizontally

function generateCloudSlope() {
  const slopeRange = 0.2; // Define slope range
  const slope = (Math.random() - 0.2) * slopeRange; // Generate random slope
  const yIntercept = Math.random() * height; // Choose y-intercept within viewport height
  return { slope, yIntercept };
}

function createCloud() {
  const svgNS = "http://www.w3.org/2000/svg";
  const cloud = document.createElementNS(svgNS, 'polygon');
  const points = [];
  const cloudWidth = Math.random() * 100 + 900; // Keep the cloud width large
  const cloudHeight = Math.random() * 15 + 20; // Keep cloud height small for a flat look
  const baselineY = Math.random() * 100 + 400; // Position the baseline lower on the canvas
  const numPoints = 6; // Keep a small number of points for a more geometric look
  const avgx = cloudWidth / (numPoints - 1);
  
  // Generate the points for the cloud with sharper corners
  for (let i = 0; i < numPoints; i++) {
    let x = avgx * i;
    let y;
    
    if (i % 2 === 0) {
      // The even points will be on the baseline, creating the flat bottom of the cloud
      y = baselineY;
    } else {
      // The odd points will be the peaks of the cloud
      y = baselineY - cloudHeight;
    }
    
    // Add the point to the points array
    points.push(`${x},${y}`);
  }
  
  // Complete the shape by returning to the starting y position
  points.push(`${cloudWidth},${baselineY}`);
  points.push(`0,${baselineY}`);

  const pointsAttribute = points.join(' ');
  cloud.setAttribute('points', pointsAttribute);
  cloud.setAttribute('fill', 'white');
  cloud.classList.add('cloud');
  cloud.setAttribute('opacity', '0.5'); // Slightly transparent for a cloud-like look

  // Assuming 'svg' is the SVG element already present in the DOM
  document.querySelector('svg').appendChild(cloud);

  return {
    element: cloud,
    opacity: 0.5,
    x: 0,
    y: baselineY - cloudHeight // Adjust the y position here if needed
  };
}


// You will need to implement or replace this function with actual slope calculation logic
function generateCloudSlope() {
  // Placeholder function; implement according to your needs or replace with fixed values
  return { slope: -0.5, yIntercept: 50 };
}



  const numStars = 500;
  const stars = [];
  for (let i = 0; i < numStars; i++) {
      stars.push(createStar());
  }

  setTimeout(() => {
    for (let i = 0; i < 3; i++) { // Create 10 clouds
      clouds.push(createCloud());
    }
  }, (duration - 3000)); // duration is the length of your falling star animation


  function cubicBezier(t, p0, p1, p2, p3, p4) {
    return (
      Math.pow(1 - t, 5) * p0 +
      5 * Math.pow(1 - t, 4) * t * (p1 + 0.001) +
      10 * Math.pow(1 - t, 3) * Math.pow(t, 2) * (p2 + 0.01) +
      10 * Math.pow(1 - t, 2) * Math.pow(t, 3) * (p3 - 0.3) +
      5 * (1 - t) * Math.pow(t, 4) * (p4 - 0.01) +
      Math.pow(t, 5) * p4
    );
  }

  function toggleOpacity(element, finalOpacity) {
    element.style.transition = `transform 4s ease-out, opacity 3s ease`; // Set up transitions for transform and opacity properties
    element.style.opacity = finalOpacity;
  }
  
  function updateScene() {
    const elapsedTime = Date.now() - startTime;
    const t = Math.min(elapsedTime / duration, 1); // Progress from 0 to 1
    const speedMultiplier = cubicBezier(t, 0, 1, 20, 5, 0); // Get speed multiplier using cubic Bezier function

    stars.forEach(star => {
      const cy = parseFloat(star.element.getAttribute('cy')) - (star.speed * speedMultiplier);
      if (cy < -parseFloat(star.element.getAttribute('r'))) {
          star.element.setAttribute('cx', Math.random() * width);
          star.element.setAttribute('cy', height + parseFloat(star.element.getAttribute('r')));
      } else {
          star.element.setAttribute('cy', cy);
      }
      
      // Store previous cursor position
      let prevCursor = { x: cursor.x, y: cursor.y };

      // Calculate the difference between current and previous cursor positions
      const dxMouse = cursor.x - prevCursor.x;
      const dyMouse = cursor.y - prevCursor.y;

      // Update the previous cursor position
      prevCursor = { x: cursor.x, y: cursor.y };

      // Update star position based on the difference between current and previous cursor positions
      star.x += dxMouse;
      star.y += dyMouse;

      // Parallax effect including cursor movement
      const dx = cursor.x - star.x;
      const dy = cursor.y - star.y;
      const parallaxFactor = 0.4 * (star.size / 5);

      // Constant upward movement proportional to star size
      const upwardMovement = -star.size * 0.1 * speedMultiplier;

      const storemousepos = cursor.x + cursor.y

      // Inside updateScene function
      if (Math.random() < 0.001) {
        const newOpacity = Math.random() * 0.3 * (1 - star.size / 10);
        
        // Change location
        if (Math.random() < 0.2) { // 50% chance of changing location
          toggleOpacity(star.element, 0); // Fade out
          setTimeout(() => { // Delay changing location until after the fading out transition
            const newX = Math.random() * width;
            const newY = Math.random() * height;
            star.element.setAttribute('cx', newX);
            star.element.setAttribute('cy', newY);
            toggleOpacity(star.element, newOpacity); // Fade in
          }, 3000); // 3000 milliseconds = 3 seconds (duration of the fading out transition)
        } else {
          toggleOpacity(star.element, newOpacity);
        }
      }

      // Apply the transformation to move the star
      star.element.style.transform = `translate(${(dx * parallaxFactor)}px, ${(dy * parallaxFactor + upwardMovement)}px)`;
      star.element.style.transition = `transform 4s ease-out, opacity 3s ease`; // Set up transitions for transform and opacity properties
      star.element.style.transform = `translate(${(dx * parallaxFactor)}px, ${(dy * parallaxFactor + upwardMovement)}px)`;
      

    });

    clouds.forEach(cloud => {
      // Fade in the cloud if it's not fully opaque
      if (cloud.opacity < 1) {
        cloud.opacity += 0.01; // Increase the opacity slowly
        cloud.element.setAttribute('opacity', cloud.opacity);
      }
    
      // Move the cloud horizontally
      cloud.x += cloudSpeed 
      cloud.y = cloud.y 
      cloud.element.setAttribute('transform', `translate(${cloud.x},${cloud.y * speedMultiplier})`);
    
      // If the cloud has moved beyond the viewport, reposition it to the other side
      if (cloud.x > width + cloud.cloudWidth) { // cloud.cloudWidth should be the individual cloud's width
        cloud.x = -cloud.cloudWidth;
      } else if (cloud.x < -cloud.cloudWidth) {
        cloud.x = width;
      }
    });
    
    
  }
  

    function updateCursor(event) {
        cursor.x = event.clientX;
        cursor.y = event.clientY;
    }

    function updateSpeed(event) {
        startTime = Date.now(); // Update start time when speed changes
        // Other speed update logic
    }
  
    document.addEventListener('mousemove', updateCursor);
    document.getElementById('speedControl').addEventListener('input', updateSpeed);
    setInterval(updateScene, 10);
});
