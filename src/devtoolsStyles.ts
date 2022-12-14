export function installStyles(targetDocument: Document) {
  // Watch for style changes in dev mode
  if (process.env.NODE_ENV === "development") {
    watchStyles(targetDocument);
    const styles = document.querySelectorAll('style[type="text/css"]');
    styles.forEach((style) => {
      // clone the style node
      const newStyle = style.cloneNode(true) as HTMLStyleElement;
      targetDocument.head.appendChild(newStyle);
    });
  } else {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => {
      // clone the link node
      const newLink = link.cloneNode(true) as HTMLLinkElement;
      targetDocument.head.appendChild(newLink);
    });
  }
}

function watchStyles(targetDocument: Document) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== "childList") return;

      const addedNodes = Array.from(mutation.addedNodes);

      addedNodes.forEach((node) => {
        if (node.nodeName === "STYLE") {
          const newStyle = node.cloneNode(true) as HTMLStyleElement;
          targetDocument.head.appendChild(newStyle);
        }

        // Text case, we check if parent is a style tag
        if (
          node.nodeName === "#text" &&
          node.parentElement?.nodeName === "STYLE"
        ) {
          const newStyle = node.parentElement as HTMLStyleElement;
          const id = newStyle.getAttribute("data-vite-dev-id");
          const oldStyle = targetDocument.querySelector(
            `[data-vite-dev-id="${id}"]`
          );
          if (!oldStyle) return;
          oldStyle.innerHTML = newStyle.innerHTML;
        }
      });
    });
  });

  observer.observe(window.document.head, {
    subtree: true,
    childList: true,
  });
}
