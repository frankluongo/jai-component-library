// Create execution context for our Timeline work
(function TimelineContext() {
  // Immediately Executed Code:
  // document.addEventListener("DOMContentLoaded", initializeSVGPaths);
  window.addEventListener("load", initializeSVGPaths);

  // Function Definitions
  function initializeSVGPaths() {
    const container = document.querySelector("#sidebar");
    const points = document.querySelectorAll(".timeline-point");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.setAttribute("data-visible", entry.isIntersecting);
      });
    });

    // ACTIONS:
    // =============================================================
    points.forEach((point) => observer.observe(point));
    updatePoints();
    // Third, add an event listener to the window to update the paths on resize:
    window.addEventListener("resize", updatePoints);

    function placePoint(point) {
      const target = document.querySelector(
        `#${point.getAttribute("data-aligns")}`
      );
      const pointRect = point.getBoundingClientRect();
      const sidebarRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // Vertically center the point in the middle of the target element:
      // Account for sidebar's top offset
      const pointTop =
        targetRect.top -
        sidebarRect.top +
        targetRect.height / 2 -
        pointRect.height / 2;
      point.style.top = `${pointTop}px`;
    }

    function updatePoints() {
      points.forEach(placePoint);
    }
  }
})();
