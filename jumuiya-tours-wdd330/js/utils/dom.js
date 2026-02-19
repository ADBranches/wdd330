// js/utils/dom.js

/**
 * Shorthand for querySelector.
 * @param {string} selector
 * @param {ParentNode} [parent=document]
 */
export const qs = (selector, parent = document) => parent.querySelector(selector);

/**
 * Shorthand for querySelectorAll that returns a real array.
 * @param {string} selector
 * @param {ParentNode} [parent=document]
 */
export const qsa = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

