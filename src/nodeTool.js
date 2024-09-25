import { mechanize } from './stringTool';

/**
 * Adds attributes to a node.
 * @param {HTMLElement} node
 * @param {Record<string,string>} attributes
 */
export function attr(node, attributes = {}) {
    if (typeof node.setAttribute !== 'function') {
        return;
    }
    for (const [key, value] of Object.entries(attributes)) {
        let val = value;
        if ([false, undefined, null, 'undefined'].includes(value)) {
            node.removeAttribute(key);
            continue;
        }
        if (typeof value === 'number' || value === true || Array.isArray(value)) {
            val = value.toString();
        }
        if (typeof val === 'string') {
            node.setAttribute(key, val);
        }
    }
}

/**
 * Returns the attributes of a node.
 * @param {HTMLElement} node
 * @returns {Record<string, string | boolean>}
 */
export function getAttributes(node) {
    return Array.from(node.attributes).reduce((acc, { name, value }) => {
        if (value === '') {
            value = true;
        } else if (value === 'false') {
            value = false;
        }
        acc[name] = value;
        return acc;
    }, {});
}

/**
 * Checks if a node is in the viewport.
 * @param {HTMLElement} node
 * @returns {boolean}
 */
export function isInView(node) {
    const rect = node.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Adds content to a node.
 * @param {HTMLElement} node
 * @param {*} content
 */
export function addContent(node, content) {
    if (typeof content === 'string') {
        node.textContent += content;
    } else if (content instanceof HTMLElement) {
        node.appendChild(content);
    }
}

/**
 * Sets content to a node.
 * @param {HTMLElement} node
 * @param {*} content
 */
export function setContent(node, content) {
    if (typeof content === 'string') {
        node.textContent = content;
    } else if (content instanceof HTMLElement) {
        node.innerHTML = '';
        node.appendChild(content);
    }
}

/**
 * Styles a node.
 * @param {HTMLElement} node
 * @param {Record<string, string>} css
 */
export function style(node, css = {}) {
    for (const [key, value] of Object.entries(css)) {
        node.style[key] = value;
    }
}

/**
 * Prepends a child node to a parent node.
 * @param {HTMLElement} node
 * @param {HTMLElement} child
 */
export function prepend(node, child) {
    if (!child) {
        return;
    }
    if (node.firstChild instanceof HTMLElement) {
        node.insertBefore(child, node.firstChild);
    } else {
        node.appendChild(child);
    }
}

/**
 * Resolves a node.
 * @param {HTMLElement|string} node
 * @param {HTMLElement} container
 * @returns {HTMLElement|null}
 */
export function resolveNode(node, container = document) {
    if (node instanceof HTMLElement) {
        return node;
    }
    if (node?.childNodes?.length === 1 && node?.firstElementChild) {
        return node.firstElementChild;
    }
    if (typeof node === 'string') {
        return (
            container?.querySelector(node) ||
            (typeof container.closest === 'function' && container?.closest(node))
        );
    }
    return node;
}

/**
 * Returns the scrollable parent of a node.
 * @param {HTMLElement} node
 * @returns {HTMLElement|null}
 */
export function getScrollableParent(node) {
    if (!node) {
        return null;
    }
    if (node?.scrollTop > 0) {
        return node;
    }
    return getScrollableParent(node.parentNode);
}

/**
 * Returns the offset of a node.
 * @param {HTMLElement} node
 * @returns {number[]}
 */
export function getOffset(node) {
    return [node.offsetLeft, node.offsetTop];
}

/**
 * Adds a double click event listener to a node.
 * @param {HTMLElement} node
 * @param {Function} callback
 * @param {number} delay
 */
export function onDoubleClick(node, callback, delay = 500) {
    let isRepeat;
    node.addEventListener('click', () => {
        if (isRepeat) {
            callback();
        }
        isRepeat = true;
        setTimeout(() => (isRepeat = false), delay);
    });
}

/**
 * Creates a dynamic CSS rule.
 * @param {string} selector - A css selector.
 * @param {string} styles
 */
export function addCssRule(selector, styles) {
    const id = mechanize(selector);
    let style = document.getElementById(id);
    const content = `${selector} { ${styles} }`;
    if (!style) {
        style = document.createElement('style');
        style.id = id;
        document.head.appendChild(style);
        style.type = 'text/css';
    }
    style && (style.innerHTML = content);
}
