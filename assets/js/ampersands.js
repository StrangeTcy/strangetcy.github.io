/*
 * Adds the custom Garamond ampersand to ordinary prose in #main_content.
 *
 * Diagnostic build: logs whether the script ran, how many ampersands it wrapped,
 * and which CSS mask the browser sees. Repeated calls are safe: existing wrappers
 * are excluded from subsequent passes.
 */
(() => {
  const loadedScriptURL = document.currentScript?.src ?? "(script URL unavailable)";
  console.info("[ampersands] script loaded:", loadedScriptURL);

  function boot() {
    const root = document.querySelector("#main_content");
    if (!root) {
      console.error("[ampersands] #main_content not found; nothing was processed.");
      return;
    }

    const excluded = [
      "code", "pre", "script", "style", "textarea", "noscript", "svg", "math",
      "mjx-container", ".MathJax", ".MathJax_Display", ".katex", ".ampersand"
    ].join(",");

    const rawTexPattern = /\\(?:\[|\]|\(|\)|begin\s*\{|end\s*\{)|\$\$/;

    function hasUnescapedDollar(text) {
      let count = 0;
      for (let i = 0; i < text.length; i++) {
        if (text[i] === "$" && (i === 0 || text[i - 1] !== "\\")) count++;
      }
      // Any paired dollar delimiters may indicate inline/display math still awaiting MathJax.
      return count >= 2;
    }

    function appearsToBeRawMath(node) {
      const value = node.nodeValue || "";
      if (rawTexPattern.test(value) || hasUnescapedDollar(value)) return true;

      const block = node.parentElement?.closest("p, li, dd, blockquote");
      const blockText = block?.textContent || "";
      return rawTexPattern.test(blockText) || hasUnescapedDollar(blockText);
    }

    function applyAmpersands(reason) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue?.includes("&")) return NodeFilter.FILTER_REJECT;
          if (!node.parentElement || node.parentElement.closest(excluded)) return NodeFilter.FILTER_REJECT;
          if (appearsToBeRawMath(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      const candidates = [];
      while (walker.nextNode()) candidates.push(walker.currentNode);

      let added = 0;
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
            added++;
          }
        });

        node.replaceWith(fragment);
      }

      const total = root.querySelectorAll(".ampersand").length;
      const sampleGlyph = root.querySelector(".ampersand__glyph");
      const sampleStyle = sampleGlyph ? getComputedStyle(sampleGlyph) : null;
      console.info("[ampersands] pass completed:", {
        reason,
        addedThisPass: added,
        totalWrappers: total,
        maskImage: sampleStyle?.maskImage ?? "(no glyph element)",
        webkitMaskImage: sampleStyle?.webkitMaskImage ?? "(no glyph element)",
        backgroundColor: sampleStyle?.backgroundColor ?? "(no glyph element)"
      });
    }

    let startupHooked = false;
    function waitForMathJax() {
      const promise = window.MathJax?.startup?.promise;
      if (promise && typeof promise.then === "function" && !startupHooked) {
        startupHooked = true;
        promise.then(
          () => applyAmpersands("MathJax startup completed"),
          (error) => {
            console.warn("[ampersands] MathJax startup rejected; applying only outside raw-TeX blocks.", error);
            applyAmpersands("MathJax startup rejected")
          }
        );
      }
    }

    // Poll instead of relying on a script-load event that might already have fired.
    const poll = window.setInterval(() => {
      waitForMathJax();
      if (startupHooked) window.clearInterval(poll);
    }, 100);

    // Fail-safe: don't wait forever. Any still-raw math block is guarded above.
    window.setTimeout(() => {
      window.clearInterval(poll);
      applyAmpersands("8-second safety pass");
    }, 8000);

    // If MathJax is absent or blocked, give it a short chance to initialize before
    // applying the safe pass; the timeout above will perform the final fallback.
    waitForMathJax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
