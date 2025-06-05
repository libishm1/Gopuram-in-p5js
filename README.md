# Gopuram-in-p5js
Interactive sketch of a Dravidian gopuram rendered with p5.js. Statues are
loaded at runtime from openly licensed GLB models on GitHub. The Duck,
Lantern and Avocado samples from the KhronosGroup repository provide the
placeholder idols. Because `loadModel(url, true)` is used, their textures are
applied automatically.

Open `index.html` locally or copy `final_gopuram_render.js` into a new sketch on
the [p5.js Web Editor](https://editor.p5js.org). The canvas automatically
resizes to the window. When viewed in portrait orientation a "please rotate"
message appears so the gopuram is only shown in landscape mode.
