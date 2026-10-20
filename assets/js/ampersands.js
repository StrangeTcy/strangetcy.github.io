/*
 * Replaces prose ampersands with the right-hand (italic) Garamond ampersand
 * from Wikimedia Commons' Ampersand.svg. The original '&' remains as text in
 * the DOM for selection/copying and assistive technology; the SVG mask is visual.
 */
(() => {
  const root = document.querySelector("#main_content");
  if (!root) return;

  const excluded = [
    "code", "pre", "script", "style", "textarea", "noscript", "svg", "math",
    "mjx-container", ".MathJax", ".MathJax_Display", ".katex", ".ampersand"
  ].join(",");

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.includes("&")) {
        return NodeFilter.FILTER_REJECT;
      }
      if (!node.parentElement || node.parentElement.closest(excluded)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  // Collect first: replacing nodes while walking would disturb traversal.
  const candidates = [];
  while (walker.nextNode()) candidates.push(walker.currentNode);

  for (const node of candidates) {
    const fragment = document.createDocumentFragment();
    const parts = node.nodeValue.split("&");

    parts.forEach((part, index) => {
      if (part) fragment.append(document.createTextNode(part));

      if (index < parts.length - 1) {
        const wrapper = document.createElement("span");
        wrapper.className = "ampersand";

        const originalText = document.createElement("span");
        originalText.className = "ampersand__text";
        originalText.textContent = "&";

        const glyph = document.createElement("span");
        glyph.className = "ampersand__glyph";
        glyph.setAttribute("aria-hidden", "true");

        wrapper.append(originalText, glyph);
        fragment.append(wrapper);
      }
    });

    node.replaceWith(fragment);
  }
})();
