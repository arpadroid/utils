/**
 * @typedef CallbackType
 * @type {(event: Event) => boolean | void}
 */
/** @type {CallbackType[]} */
const onResizeCallbacks = [];
/** @type {CallbackType[]} */
const onScrollCallbacks = [];
/** @type {CallbackType[]} */
const onScrollStartCallbacks = [];
let initializedResize = false;
let initializedScroll = false;

/**
 * Initializes the resize event listener and sets the flag indicating it has been initialized.
 * @param {CallbackType} callback - The callback function to be executed on resize.
 */
function initializeResize(callback) {
    window.addEventListener('resize', callback);
    initializedResize = true;
}

/**
 * Removes the specified callback function from the scroll event listener.
 * @param {CallbackType} callback - The callback function to be removed.
 */
export function removeScrollCallback(callback) {
    const index = onScrollCallbacks.indexOf(callback);
    if (index !== -1) {
        onScrollCallbacks.splice(index, 1);
    }
}

/**
 * Executes resize event listener callbacks.
 * @param {Event} event - The resize event handler.
 */
function _onResize(event) {
    /** @type {CallbackType[]} */
    const toBeRemoved = [];
    onResizeCallbacks.forEach(callback => callback(event) === false && toBeRemoved.push(callback));
    toBeRemoved.forEach(callback => onResizeCallbacks.splice(onResizeCallbacks.indexOf(callback), 1));
}

/**
 * Adds a callback function to the resize event listener.
 * @param {CallbackType} callback - The callback function to be added.
 */
export function onResize(callback) {
    !initializedResize && initializeResize(_onResize);
    onResizeCallbacks.indexOf(callback) === -1 && onResizeCallbacks.push(callback);
}

/**
 * Initializes the scroll event listener and sets the flag indicating it has been initialized.
 * @param {CallbackType} callback - The callback function to be executed on scroll.
 */
function initializeOnScroll(callback) {
    window.addEventListener('scroll', callback);
    let isScrolling = false;
    /** @type {any | undefined} */
    let scrollStartTimeout;
    /**
     * Calls the scroll start callback functions.
     * @param {Event} event
     */
    const onScrollStart = event => {
        if (!isScrolling) {
            onScrollStartCallbacks.forEach(callback => callback(event));
            isScrolling = true;
        }
        clearTimeout(scrollStartTimeout);
        scrollStartTimeout = setTimeout(() => (isScrolling = false), 300);
    };
    window.addEventListener('scroll', onScrollStart);
    initializedScroll = true;
}

/**
 * Executes scroll event listener callbacks.
 * @param {Event} event - The resize event.
 */
function _onScroll(event) {
    /** @type {CallbackType[]} */
    const toBeRemoved = [];
    onScrollCallbacks.forEach(callback => callback(event) === false && toBeRemoved.push(callback));
    toBeRemoved.forEach(callback => onScrollCallbacks.splice(onScrollCallbacks.indexOf(callback), 1));
}

/**
 * Adds a callback function to the scroll event listener.
 * @param {CallbackType} callback - The callback function to be added.
 */
export function onScroll(callback) {
    if (!initializedScroll) {
        initializeOnScroll(_onScroll);
    }
    if (onScrollCallbacks.indexOf(callback) === -1) {
        onScrollCallbacks.push(callback);
    }
}

/**
 * Calls the scroll start callback functions.
 * @param {CallbackType} callback - The callback function to be added.
 */
export function onScrollStart(callback) {
    !initializedScroll && initializeOnScroll(_onScroll);
    if (onScrollStartCallbacks.indexOf(callback) === -1) {
        onScrollStartCallbacks.push(callback);
    }
}

/**
 * Removes the specified callback function from the resize event listener.
 * @param {CallbackType} callback - The callback function to be removed.
 */
export function removeResizeCallback(callback) {
    const index = onResizeCallbacks.indexOf(callback);
    if (index !== -1) {
        onResizeCallbacks.splice(index, 1);
    }
}
