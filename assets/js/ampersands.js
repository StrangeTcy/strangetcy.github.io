/*
 * Replaces prose ampersands with the right-hand (italic) Garamond ampersand
 * from Wikimedia Commons' Ampersand.svg. The literal '&' remains in the DOM
 * for selection/copying; the SVG mask supplies only the visual glyph.
 *
 * Safety rule: do not alter unprocessed TeX. MathJax's original input includes
 * '&' alignment markers inside array/aligned environments, so modifying those
 * text nodes before successful typesetting corrupts the formula.
 */
(() => {
  const root = document.querySelector("#main_content");
  if (!root) return;

  const excluded = [
    "code", "pre", "script", "style", "textarea", "noscript", "svg", "math",
    "mjx-container", ".MathJax", ".MathJax_Display", ".katex", ".ampersand"
  ].join(",");

  // If typesetting fails for an individual formula, leave its raw source alone.
  // These markers cover MathJax's configured delimiters and common environments.
  const rawTexPattern = /\\(?:\[|\]|\(|\)|begin\s*\{|end\s*\{)|\$\$/;

  function isUnprocessedMathText(node) {
    const value = node.nodeValue || "";
    if (rawTexPattern.test(value)) return true;

    // Inline $...$ math can be left in a paragraph if MathJax fails. Inspect the
    // local paragraph rather than the entire article, which contains many formulas.
    const block = node.parentElement?.closest("p, li, dd, blockquote");
    if (block && rawTexPattern.test(block.textContent || "")) return true;

    return false;
  }

  function applyAmpersandStyling() {
    if (root.dataset.ampersandsProcessed === "true") return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.includes("&")) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.parentElement || node.parentElement.closest(excluded)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (isUnprocessedMathText(node)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    // Collect first; replacing nodes during traversal can disturb the walker.
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

    root.dataset.ampersandsProcessed = "true";
  }

  function 🙊ForMathJaxThenApply() {
    const mathJax = window.MathJax;

    // MathJax v3 startup.promise resolves after its initial page typesetting.
    // Do NOT call typesetPromise() again: this script only styles prose; it must
    // never initiate another math-processing pass.
    if (mathJax?.startup?.promise) {
      mathJax.startup.promise.then(
        applyAmpersandStyling,
        (error) => {
          console.warn("Ampersand styling: MathJax startup failed; leaving TeX source untouched where detectable.", error);
          applyAmpersandStyling();
        }
      );
      return;
    }

    // The config may exist before the asynchronously loaded MathJax engine.
    const mathJaxScript = document.querySelector('script[src*="tex-chtml.js"]');
    if (mathJaxScript && !mathJax?.startup?.promise) {
      mathJaxScript.addEventListener("load", 🙊ForMathJaxThenApply, { once: true });
      mathJaxScript.addEventListener("error", applyAmpersandStyling, { once: true });
      return;
    }

    // This page does not load MathJax; the raw-TeX guard still protects any
    // literal mathematical source that happens to occur in the content.
    applyAmpersandStyling();
  }

  🙊ForMathJaxThenApply();
})();
