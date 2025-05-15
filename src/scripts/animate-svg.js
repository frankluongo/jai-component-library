// Create execution context for our SVG work
(function SVGContext() {
  const CURVE_RADIUS = 16;
  const OFFSET = 32;

  // Immediately Executed Code:
  // document.addEventListener("DOMContentLoaded", initializeSVGPaths);
  window.addEventListener("load", initializeSVGPaths);

  // Function Definitions
  function initializeSVGPaths() {
    // First, get our container:
    const container = document.querySelector(`#page-lines`);
    // Second, get all of our points + give them a path:
    const pointsAndPaths = Array.from(
      document.querySelectorAll("[data-point]")
    ).map(addPathToPoint);
    const coordinates = pointsAndPaths.map(createCoordinatesMap);

    const options = {
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const path = entry.target;
          animatePath(path);
        }
      });
    }, options);

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
      const end = document.querySelector(`#${point.dataset.connects}`);

      // Step 1: Get the start and endpoint element coordinates.
      const startRect = point.getBoundingClientRect();
      const endRect = end.getBoundingClientRect();

      // Step 2: Figure out the direction
      const direction = endRect.left - startRect.left > 0 ? "right" : "left";

      // Step 3: Figure out the offsetX, based on the direction:
      const offsetX = direction === "right" ? -OFFSET : OFFSET;

      // Step 4: Get the start and end values:
      const startX = startRect.left - containerRect.left + startRect.width / 2;
      const startY =
        startRect.top - containerRect.top + startRect.height / 2 + OFFSET;
      const endX =
        endRect.left - containerRect.left + endRect.width / 2 + offsetX;
      const endY = endRect.top - containerRect.top + endRect.height / 2;

      return { direction, path, startX, startY, endX, endY };
    }

    function drawPath({ direction, path, startX, startY, endX, endY }) {
      // Define the path data for an "L" shape with a curved corner
      const curveDirection =
        direction === "right" ? CURVE_RADIUS : -CURVE_RADIUS;

      const pathData = `
        M ${startX} ${startY} 
        L ${startX} ${endY - CURVE_RADIUS} 
        Q ${startX} ${endY} ${startX + curveDirection} ${endY} 
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
