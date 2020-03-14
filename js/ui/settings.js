
function uiSettings()
{
    scrSizeFactor = (window.innerWidth > window.innerHeight ? window.innerWidth/2 : window.innerWidth);

    btnSize = vec2(scrSizeFactor * 0.16, scrSizeFactor * 0.04);
    squareBtnSize = vec2(scrSizeFactor * 0.05, scrSizeFactor * 0.05);
    tabSize = vec2(scrSizeFactor * 0.14, scrSizeFactor * 0.08);
    sliderSize = vec2(scrSizeFactor * 0.28, scrSizeFactor * 0.04);
    sliderKnobSize = scrSizeFactor * 0.0075;
    panelSize = vec2(scrSizeFactor * 0.3, scrSizeFactor * 0.5);
    mapMode = true;

    uiContext.set(
        renderer, 2, "Lucida, sans-serif", scrSizeFactor * 0.024,
        "#404080", "#353570", "#252550", "#121225", "#000001", "#ccccee"
        );
}