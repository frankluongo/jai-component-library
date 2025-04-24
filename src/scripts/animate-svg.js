// Create execution context for our SVG work
(function SVGContext() {
  const CURVE_RADIUS = 16;
  const OFFSET = 32;

  // Immediately Executed Code:
  document.addEventListener("DOMContentLoaded", initializeSVGPaths);

  // Function Definitions
  function initializeSVGPaths() {
    // First, get our container:
    const container = document.querySelector(`#page-lines`);
    // Second, get all of our points + give them a path:
    const pointsAndPaths = Array.from(
      document.querySelectorAll("[data-point]")
    ).map(addPathToPoint);
    const coordinates = pointsAndPaths.map(createCoordinatesMap);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const path = entry.target;
          animatePath(path);
        }
      });
    });

    // ACTIONS:
    // =============================================================
    coordinates.forEach(drawPath);
    // Third, add an event listener to the window to update the paths on resize:
    window.addEventListener("resize", updatePath);

    function addPathToPoint(point) {
      const pathId = `${point.id}-path`;
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.id = pathId;
      return { point, path };
    }

    function animatePath(path) {
      path.style.transition = "stroke-dashoffset 500ms linear";
      path.style.strokeDashoffset = "0";
    }

    function createCoordinatesMap({ point, path }) {
      // The svg container that takes up the whole page:
      const containerRect = container.getBoundingClientRect();
      // The starting point element:
      const startRect = point.getBoundingClientRect();
      const startX = startRect.left - containerRect.left + startRect.width / 2;
      const startY =
        startRect.top - containerRect.top + startRect.height / 2 + OFFSET;
      // The ending point element:
      const end = document.querySelector(`#${point.dataset.connects}`);
      const endRect = end.getBoundingClientRect();
      const endX =
        endRect.left - containerRect.left + endRect.width / 2 - OFFSET;
      const endY = endRect.top - containerRect.top + endRect.height / 2;
      return { path, startX, startY, endX, endY };
    }

    function drawPath({ path, startX, startY, endX, endY }) {
      // Define the path data for an "L" shape with a curved corner
      const pathData = `
        M ${startX} ${startY} 
        L ${startX} ${endY - CURVE_RADIUS} 
        Q ${startX} ${endY} ${startX + CURVE_RADIUS} ${endY} 
        L ${endX} ${endY}
      `;
      path.setAttribute("d", pathData.trim());
      path.setAttribute("stroke", "var(--color-call-to-action--default)");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("fill", "none");

      // Add stroke-dasharray and stroke-dashoffset for animation
      const pathLength = path.getTotalLength();
      path.setAttribute("stroke-dasharray", pathLength);
      path.setAttribute("stroke-dashoffset", pathLength);

      container.appendChild(path);
      observer.observe(path);
    }

    function updatePath() {
      pointsAndPaths.map(createCoordinatesMap).forEach(drawPath);
    }
  }
})();
