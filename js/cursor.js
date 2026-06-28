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
    var SIZE = 32; // matches the SVG viewBox (32x32)
    // Anchor at the CENTER of the box. The default and hover SVGs differ in size
    // (their visible artwork sits near center, ~25/25), so anchoring at a corner
    // made the icon shift relative to the pointer when swapping to the larger
    // hover art + scale. Centering keeps both states (and the hover scale)
    // symmetric around the pointer, so there's no positional jump.
    var HOTSPOT_X = SIZE / 2;
    var HOTSPOT_Y = SIZE / 2;

    // Hide the native cursor + define the custom element via an injected stylesheet,
    // so this works on every page without editing each CSS file.
    var style = document.createElement('style');
    style.textContent =
        '@media (hover: hover) and (pointer: fine) {' +
        '  html, body, a, button, [role="button"], input, textarea, select, label { cursor: none !important; }' +
        '}' +
        // Outer element handles POSITION only — no transition, so it tracks the
        // pointer instantly (a transition here makes it lag/misalign while moving).
        '.ja-cursor {' +
        '  position: fixed; top: 0; left: 0;' +
        '  width: ' + SIZE + 'px; height: ' + SIZE + 'px;' +
        '  pointer-events: none; z-index: 2147483647;' +
        '  opacity: 0;' +
        '  transition: opacity 0.15s ease;' +
        '  will-change: transform;' +
        '}' +
        '.ja-cursor.is-visible { opacity: 1; }' +
        // Inner element handles the look + hover SCALE, which can safely animate.
        '.ja-cursor__img {' +
        '  width: 100%; height: 100%;' +
        '  background-repeat: no-repeat; background-size: contain;' +
        '  background-image: url("' + DEFAULT_SVG + '");' +
        '  transition: transform 0.08s ease-out;' +
        '}' +
        '.ja-cursor.is-hover .ja-cursor__img {' +
        '  background-image: url("' + HOVER_SVG + '");' +
        '  transform: scale(1.15);' +
        '}';
    document.head.appendChild(style);

    var cursor = document.createElement('div');
    cursor.className = 'ja-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    var inner = document.createElement('div');
    inner.className = 'ja-cursor__img';
    cursor.appendChild(inner);
    document.body.appendChild(cursor);

    var x = 0, y = 0, hovering = false, visible = false;

    function render() {
        // Position only — instant, no easing. The hover scale lives on the inner
        // element via CSS, so it can transition without affecting tracking.
        cursor.style.transform =
            'translate(' + (x - HOTSPOT_X) + 'px, ' + (y - HOTSPOT_Y) + 'px)';
    }

    var HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, label, .btn';

    function setHover(target) {
        var nowHovering = !!(target && target.closest && target.closest(HOVER_SELECTOR));
        if (nowHovering !== hovering) {
            hovering = nowHovering;
            cursor.classList.toggle('is-hover', hovering);
        }
    }

    document.addEventListener('mousemove', function (e) {
        x = e.clientX;
        y = e.clientY;
        if (!visible) {
            visible = true;
            cursor.classList.add('is-visible');
        }
        setHover(e.target);
        render();
    });

    // The pointer stays still while the page scrolls under it, so no mousemove
    // fires — the hover state would otherwise go stale (e.g. stuck in the hover
    // image over a non-link area after scrolling away from a link). Re-check what
    // is actually under the last-known pointer position on scroll.
    window.addEventListener('scroll', function () {
        if (!visible) return;
        setHover(document.elementFromPoint(x, y));
        render();
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
        visible = false;
        cursor.classList.remove('is-visible');
    });

    document.addEventListener('mouseenter', function () {
        visible = true;
        cursor.classList.add('is-visible');
    });
})();
