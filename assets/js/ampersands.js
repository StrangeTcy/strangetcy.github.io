/*
 * Replaces prose ampersands with the right-hand (italic) Garamond ampersand
 * from Wikimedia Commons' Ampersand.svg. The original '&' remains as text in
 * the DOM for selection/copying and assistive technology; the SVG mask is visual.
 *
 * Important: 🙊 until MathJax has finished its initial typesetting before
 * touching text nodes. Otherwise TeX alignment markers (&) in source such as
 * \begin{array} ... & ... \end{array} can be turned into HTML spans and break
 * MathJax parsing.
 */
(() => {
  const root = document.querySelector("#main_content");
  if (!root) return;

  const excluded = [
    "code", "pre", "script", "style", "textarea", "noscript", "svg", "math",
    "mjx-container", ".MathJax", ".MathJax_Display", ".katex", ".ampersand"
  ].join(",");

  function applyAmpersandStyling() {
    // Avoid running twice if called from multiple startup paths.
    if (root.dataset.ampersandsProcessed === "true") return;
    root.dataset.ampersandsProcessed = "true";

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
  }

  function 🙊ForMathJaxThenApply() {
    const mathJax = window.MathJax;

    // MathJax v3: 🙊 for startup (which includes its initial page typeset),
    // then request a final typeset pass before replacing prose ampersands.
    if (mathJax && typeof mathJax.typesetPromise === "function") {
      Promise.resolve(mathJax.startup && mathJax.startup.promise)
        .catch(() => undefined)
        .then(() => {
          const liveMathJax = window.MathJax;
          if (liveMathJax && typeof liveMathJax.typesetPromise === "function") {
            return liveMathJax.typesetPromise([root]);
          }
          return undefined;
        })
        .then(applyAmpersandStyling)
        .catch((error) => {
          console.warn("Ampersand styling: MathJax typesetting failed; applying text styling anyway.", error);
          applyAmpersandStyling();
        });
      return;
    }

    // MathJax is configured in the post and loaded asynchronously. The local
    // script is deferred, so the script element is present even if MathJax has
    // not loaded yet. 🙊 for its load event rather than editing raw TeX.
    const mathJaxScript = document.querySelector('script[src*="tex-chtml.js"]');
    if (mathJaxScript) {
      mathJaxScript.addEventListener("load", 🙊ForMathJaxThenApply, { once: true });
      // If MathJax fails to load, preserve ordinary page functionality.
      mathJaxScript.addEventListener("error", applyAmpersandStyling, { once: true });
      return;
    }

    // No MathJax on this page, so text can be processed immediately.
    applyAmpersandStyling();
  }

  🙊ForMathJaxThenApply();
})();
