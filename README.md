# Animated-scene-in-JavaScript-WebGL-
Hosted on Github Pages, Link: https://accardonull.github.io/Animated-scene-in-JavaScript-WebGL-/

Usage:

- Click the "textureToggleButton" to start the scene.

Overview:

- A program that uses JavaScript to draw an animated scene, includes:
 
- one hierarchical object of at least three levels in the hierarchy: a white scaled cube connected to the main body, a gold scaled cube with joint like connection to the previous one, least a white sphere at the end connected to the tail and move around with it. 

- 360-degree camera fly around using lookAt() and setMV() to move the camera, it circled around the center in a loop.

- Connection to real-time.Utilize real-time to synchronize animations, all animated rotation use 'Time' variable to calculate object's movements.

- Implement 5 procedure textures map them to various objects.

- Convert the ADS shader in the main.html from a vertex shader to a fragment shader. Computed the lighting equation per fragment. And convert the Phong to Blinn-Phong in the new fragment shader.

- Write and implement a glow effect with various colors on objects by editing fragment shader in main.html, and by implementing Emissive Lighting and Fresnel Effect.

- Included animated rotation for several objects' movements.
