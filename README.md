# Gopuram-in-p5js
Interactive sketch of a Dravidian gopuram rendered with p5.js. Statue meshes are
fetched on demand from the open-source three.js repository. Each OBJ model is
loaded using `loadModel(url, true)` so any included materials are applied
automatically.

Open `index.html` locally or copy `final_gopuram_render.js` into a new sketch on
the [p5.js Web Editor](https://editor.p5js.org). The canvas automatically
resizes to the window. When viewed in portrait orientation a "please rotate"
message appears so the gopuram is only shown in landscape mode.
