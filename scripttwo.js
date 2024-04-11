document.addEventListener('DOMContentLoaded', function() {
    const divStars = document.getElementById('div-stars');
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cursor = { x: width / 2, y: height / 2 };
    let startTime = Date.now(); // Variable to track animation start time
    const duration = 10000; // Duration in milliseconds
    const stars = []; // Array to store star objects
  
    function createStar() {
        const starDiv = document.createElement('div');
        starDiv.classList.add('star');
        
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2 + 1; // This will determine the size of the star
        const speed = size; // Speed based on size
        const glowSize = size * 2; // Multiplier can be adjusted for desired effect

        let opacity;
      
        // Determine opacity
        if (Math.random() < 0.97) {
            opacity = Math.random() * (1 - 0.7) * (1 - size / 3) + 0.7; // Random opacity between 0.3 and 1, adjusted by size for the remaining 20% of stars
            starDiv.style.boxShadow = `0 0 ${glowSize}px ${glowSize * 0.5}px rgba(255, 255, 255, ${Math.abs(opacity - 0.2)})`; // Glowing effect
        } else {
            opacity = Math.random() * 0.5 * (1 - size / 10); // Random opacity between 0 and 0.3, adjusted by size for 80% of stars
        }
      
        // Set the styles to make the div look like a star
        starDiv.style.width = `${size}px`;
        starDiv.style.height = `${size}px`;
        starDiv.style.backgroundColor = 'white';
        starDiv.style.borderRadius = '50%'; // Make it circular
        starDiv.style.position = 'absolute';
        starDiv.style.left = `${x}px`;
        starDiv.style.top = `${y}px`;
        starDiv.style.opacity = opacity;
        
        
        // Append the star to the "div-stars" container
        divStars.appendChild(starDiv);
      
        return { element: starDiv, speed: speed, x: x, y: y, size: size, opacity: opacity }; // Store initial position, size, and opacity
      }
  
  
    const numStars = 50;
    for (let i = 0; i < numStars; i++) {
        stars.push(createStar());
    }
  
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
        const cy = parseFloat(star.element.style.top) - (star.speed * speedMultiplier);
        if (cy < -star.size) {
            star.element.style.left = `${Math.random() * width}px`;
            star.element.style.top = `${height + star.size}px`;
        } else {
            star.element.style.top = `${cy}px`;
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
  
        // Inside updateScene function
        if (Math.random() < 0.001) {
            const newOpacity = Math.random() * (1 - 0.7) * (1 - size / 3) + 0.7; 
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
  