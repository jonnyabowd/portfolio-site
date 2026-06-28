/**
 * JS-driven custom SVG cursor.
 * Only activates on devices with a fine pointer + hover (i.e. desktop mice),
 * so touch/mobile keep their native behavior untouched.
 */
(function () {
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    var DEFAULT_SVG = '/images/ja-cursor.svg';
    var HOVER_SVG = '/images/ja-cursor-hover.svg';
    // Hotspot kept consistent with the old PNG cursor (4, 4 from top-left).
    var HOTSPOT_X = 4;
    var HOTSPOT_Y = 4;
    var SIZE = 46; // matches the SVG viewBox

    // Hide the native cursor + define the custom element via an injected stylesheet,
    // so this works on every page without editing each CSS file.
    var style = document.createElement('style');
    style.textContent =
        '@media (hover: hover) and (pointer: fine) {' +
        '  html, body, a, button, [role="button"], input, textarea, select, label { cursor: none !important; }' +
        '}' +
        '.ja-cursor {' +
        '  position: fixed; top: 0; left: 0;' +
        '  width: ' + SIZE + 'px; height: ' + SIZE + 'px;' +
        '  background-repeat: no-repeat; background-size: contain;' +
        '  background-image: url("' + DEFAULT_SVG + '");' +
        '  pointer-events: none; z-index: 2147483647;' +
        '  opacity: 0;' +
        '  transition: opacity 0.15s ease, transform 0.08s ease-out;' +
        '  will-change: transform;' +
        '}' +
        '.ja-cursor.is-visible { opacity: 1; }' +
        '.ja-cursor.is-hover {' +
        '  background-image: url("' + HOVER_SVG + '");' +
        '  transform: scale(1.15);' +
        '}';
    document.head.appendChild(style);

    var cursor = document.createElement('div');
    cursor.className = 'ja-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);

    var x = 0, y = 0, hovering = false, visible = false;

    function render() {
        // translate first (positions the element), then scale for the hover state.
        var scale = hovering ? ' scale(1.15)' : '';
        cursor.style.transform =
            'translate(' + (x - HOTSPOT_X) + 'px, ' + (y - HOTSPOT_Y) + 'px)' + scale;
    }

    var HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, label, .btn';

    document.addEventListener('mousemove', function (e) {
        x = e.clientX;
        y = e.clientY;
        if (!visible) {
            visible = true;
            cursor.classList.add('is-visible');
        }
        var nowHovering = !!(e.target.closest && e.target.closest(HOVER_SELECTOR));
        if (nowHovering !== hovering) {
            hovering = nowHovering;
            cursor.classList.toggle('is-hover', hovering);
        }
        render();
    });

    document.addEventListener('mouseleave', function () {
        visible = false;
        cursor.classList.remove('is-visible');
    });

    document.addEventListener('mouseenter', function () {
        visible = true;
        cursor.classList.add('is-visible');
    });
})();
