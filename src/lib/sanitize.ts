const ALLOWED_TAGS = new Set(["A", "I", "B", "EM", "STRONG", "P", "PRE", "CODE", "BR", "U"]);

/**
 * HN's `text` field is HTML from a constrained, HN-controlled subset, but
 * this runs with full DOM access on a live page, so it's whitelisted anyway:
 * unknown tags are unwrapped (kept as text, not dropped), all attributes are
 * stripped except `href` on anchors, and only http(s) links are kept.
 */
export function sanitizeCommentHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  function sanitizeElement(el: Element) {
    if (!ALLOWED_TAGS.has(el.tagName)) {
      // Unwrap: replace the disallowed element with its own children, then
      // keep sanitizing those children — they can themselves be disallowed
      // tags, or allowed tags whose attributes still need stripping.
      const promoted = [...el.childNodes];
      el.replaceWith(...promoted);
      for (const node of promoted) {
        if (node instanceof Element) sanitizeElement(node);
      }
      return;
    }

    for (const attr of [...el.attributes]) {
      if (!(el.tagName === "A" && attr.name === "href")) {
        el.removeAttribute(attr.name);
      }
    }
    if (el.tagName === "A") {
      const href = el.getAttribute("href") ?? "";
      if (!/^https?:/i.test(href)) {
        el.removeAttribute("href");
      }
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer nofollow");
    }

    for (const child of [...el.children]) sanitizeElement(child);
  }

  for (const child of [...doc.body.children]) sanitizeElement(child);
  return doc.body.innerHTML;
}
