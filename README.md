# Animated-scene-in-JavaScript-WebGL-
 A program in JavaScript/WebGL that draws an animated scene, includes:
 
one hierarchical object of at least three levels in the hierarchy, I implement a fairy whose tail made out of three levels, a white scaled cube connected to its body, a gold scaled cube with joint like connection to the previous one, least a white sphere at the end connected to the golden tail and move around with it. 

360-degree camera fly around using lookAt() and setMV() to move the camera, it circled around the center in a loop.

Connection to real-time.Utilize real-time to synchronize animations, all animated rotation use 'Time' variable to calculate object's movements.

Implement 5 procedure textures map them to various objects, including grass field, flowers, the fairy, the warrior's soul, the sword, the tombstone, the cross, the halo circle.

Convert the ADS shader in the main.html from a vertex shader to a fragment shader. Computed the lighting equation per fragment. And convert the Phong to Blinn-Phong in the new fragment shader.

Write and implement a glow effect with various colors on objects, it's meant to give the scene a spiritual atmosphere, for example, the halo circle and the cross have a golden glow, and with fairy flies around, other objects also glows as if reflecting the light come from the fairy, with the soul shines bright in white and ascending. I achieve this by editing fragment shader in main.html, by implementing Emissive Lighting and Fresnel Effect.

Included animated rotation for fairy's wings and tail, arms and legs movement.
