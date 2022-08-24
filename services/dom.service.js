export function getElementBy(cssIdentifier, parentEl = document) {
  return parentEl.querySelector(cssIdentifier);
}

export function addClass(element, className) {
  element.classList.add(className);
}

export function removeClass(element, className) {
  element.classList.remove(className);
}

export function hideElement(cssIdentifier) {
  const el = getElementBy(cssIdentifier);
  addClass(el, "is-hidden");
}

export function containsWithin(parentEl, childEl) {
  return parentEl.contains(childEl);
}

export function setInnerHtmlFor(element, html) {
  element.innerHTML = html;
}

export function clearElement(element) {
  setInnerHtmlFor(element, "");
}

export function createElement(elementType, innetHTML, className) {
  const el = document.createElement(elementType);
  if (className) addClass(el, className);
  el.innerHTML = innetHTML;
  return el;
}

export function setValueOnInput(inputEl, value) {
  inputEl.value = value;
}

export function addAsChildTo(parentEl, childEl) {
  parentEl.appendChild(childEl);
}
