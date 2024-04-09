document.addEventListener('DOMContentLoaded', function() {
    const svg = document.getElementById('stars');
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    function createStar() {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', Math.random() * width);
      dot.setAttribute('cy', Math.random() * height);
      dot.setAttribute('r', Math.random() * 2 + 1);
      dot.setAttribute('fill', 'white');
      dot.setAttribute('fill-opacity', Math.random() * 0.5 + 0.5);
      const radius = parseFloat(dot.getAttribute('r'));
      dot.setAttribute('size', Math.PI * radius * radius);
      svg.appendChild(dot);
      return dot;
    }
  
    const stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push(createStar());
    }
  
    function updateStars() {
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const size = parseInt(star.getAttribute('size'));
        console.log(size)
        const speed = size / 100;
        const cy = parseInt(star.getAttribute('cy'));
        star.setAttribute('cy', (cy - speed));
        if ((cy - speed) < 0) {
          star.remove();
          stars.splice(i, 1);
          i--;
          const newStar = createStar();
          stars.push(newStar);
        }
      }
    }
  
    setInterval(updateStars, 30);
  });