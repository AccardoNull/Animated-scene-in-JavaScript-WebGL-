
var canvas;
var gl;

var program;

var near = 1;
var far = 100;


var left = -6.0;
var right = 6.0;
var ytop =6.0;
var bottom = -6.0;


var lightPosition2 = vec4(100.0, 100.0, 100.0, 1.0 );
var lightPosition = vec4(0.0, 0.0, 100.0, 1.0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 0.4, 0.4, 0.4, 1.0 );
var materialShininess = 30.0;

var ambientColor, diffuseColor, specularColor;

var modelMatrix, viewMatrix, modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var RX = 0;
var RY = 0;
var RZ = 0;

var MS = []; // The modeling matrix stack
var TIME = 0.0; // Realtime
var dt = 0.0
var prevTime = 0.0;
var resetTimerFlag = true;
// These are used to store the current state of objects.
// In animation it is often useful to think of an object as having some DOF
// Then the animation is simply evolving those DOF over time.
var currentRotation = [0,0,0];

var useTextures = 0;

//making a texture image procedurally
//Let's start with a 1-D array
var texSize = 64;
var imageCheckerBoardData = new Array();

// Now for each entry of the array make another array
// 2D array now!
for (var i =0; i<texSize; i++)
	imageCheckerBoardData[i] = new Array();

// Now for each entry in the 2D array make a 4 element array (RGBA! for colour)
for (var i =0; i<texSize; i++)
	for ( var j = 0; j < texSize; j++)
		imageCheckerBoardData[i][j] = new Float32Array(4);

// Now for each entry in the 2D array let's set the colour.
// We could have just as easily done this in the previous loop actually
for (var i = 0; i < texSize; i++) 
    for (var j = 0; j < texSize; j++) {
        var c = 0.2 + Math.random() * 0.6;  // Random green intensity between 0.2 and 0.8
        imageCheckerBoardData[i][j] = [0.1 * c, 0.5 * c, 0.1 * c, 1];  // Varying shades of green
    }

//Convert the image to uint8 rather than float.
var imageCheckerboard = new Uint8Array(4*texSize*texSize);

for (var i = 0; i < texSize; i++)
	for (var j = 0; j < texSize; j++)
	   for(var k =0; k<4; k++)
			imageCheckerboard[4*texSize*i+4*j+k] = 255*imageCheckerBoardData[i][j][k];
//
//making a texture image procedurally
//Let's start with a 1-D array
var texSize2 = 64;
var TombData = new Array();

// Now for each entry of the array make another array
// 2D array now!
for (var i =0; i<texSize2; i++)
	TombData[i] = new Array();

// Now for each entry in the 2D array make a 4 element array (RGBA! for colour)
for (var i =0; i<texSize2; i++)
	for ( var j = 0; j < texSize2; j++)
		TombData[i][j] = new Float32Array(4);

// 
// 
for (var i = 0; i < texSize; i++) 
    for (var j = 0; j < texSize; j++) {
        var c = 0.5 - Math.random() * 0.1;  // Less variation, smoother texture
        TombData[i][j] = [c, c, c, 1];  // Grey-scale variation
    }


//
var Tombtexture = new Uint8Array(4*texSize2*texSize2);

for (var i = 0; i < texSize2; i++)
	for (var j = 0; j < texSize2; j++)
	   for(var k =0; k<4; k++)
			Tombtexture[4*texSize2*i+4*j+k] = 255*TombData[i][j][k];
//
//
//
var texSize2 = 64;
var CrossData = new Array();

// 
// 
for (var i =0; i<texSize2; i++)
	CrossData[i] = new Array();

// 
for (var i =0; i<texSize2; i++)
	for ( var j = 0; j < texSize2; j++)
		CrossData[i][j] = new Float32Array(4);

// 
// 
for (var i = 0; i < texSize; i++) 
    for (var j = 0; j < texSize; j++) {
        var c = 0.6 + Math.random() * 0.3;  // Base golden intensity (0.6 to 0.9)
        
        // Introduce slight tarnish (darker patches) randomly
        if (Math.random() < 0.1) c *= 0.5;  

        // Apply gold-like color tones (more red & yellow, less blue)
        CrossData[i][j] = [c, 0.7 * c, 0.3 * c, 1];  
    }

//
var Crosstexture = new Uint8Array(4*texSize2*texSize2);

for (var i = 0; i < texSize2; i++)
	for (var j = 0; j < texSize2; j++)
	   for(var k =0; k<4; k++)
			Crosstexture[4*texSize2*i+4*j+k] = 255*CrossData[i][j][k];
//
//
//
var texSize2 = 64;
var FairyData = new Array();

//
// 
for (var i =0; i<texSize2; i++)
	FairyData[i] = new Array();

//
for (var i =0; i<texSize2; i++)
	for ( var j = 0; j < texSize2; j++)
		FairyData[i][j] = new Float32Array(4);

// 
// 
for (var i = 0; i < texSize; i++) 
    for (var j = 0; j < texSize; j++) {
        FairyData[i][j] = [1.0, 0.84, 0.0, 1.0];  
    }

//
var Fairytexture = new Uint8Array(4*texSize2*texSize2);

for (var i = 0; i < texSize2; i++)
	for (var j = 0; j < texSize2; j++)
	   for(var k =0; k<4; k++)
        Fairytexture[4*texSize2*i+4*j+k] = 255*FairyData[i][j][k];
//
var texSize2 = 64;
var WingData = new Array();

//
// 
for (var i =0; i<texSize2; i++)
	WingData[i] = new Array();

//
for (var i =0; i<texSize2; i++)
	for ( var j = 0; j < texSize2; j++)
		WingData[i][j] = new Float32Array(4);

// 
// 
for (var i = 0; i < texSize; i++) 
    for (var j = 0; j < texSize; j++) {
        WingData[i][j] = [1.0, 1.0, 1.0, 1.0];  
    }

//
var Wingtexture = new Uint8Array(4*texSize2*texSize2);

for (var i = 0; i < texSize2; i++)
	for (var j = 0; j < texSize2; j++)
	   for(var k =0; k<4; k++)
        Wingtexture[4*texSize2*i+4*j+k] = 255*WingData[i][j][k];                     		
// For this example we are going to store a few different textures here
var textureArray = [] ;


function setColor(c)
{
    ambientProduct = mult(lightAmbient, c);
    diffuseProduct = mult(lightDiffuse, c);
    specularProduct = mult(lightSpecular, materialSpecular);
    
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
                                         "lightPosition"),flatten(lightPosition2) );
    gl.uniform1f( gl.getUniformLocation(program, 
                                        "shininess"),materialShininess );
}

// We are going to asynchronously load actual image files this will check if that call if an async call is complete
// You can use this for debugging
function isLoaded(im) {
    if (im.complete) {
        console.log("loaded") ;
        return true ;
    }
    else {
        console.log("still not loaded!!!!") ;
        return false ;
    }
}

// Helper function to load an actual file as a texture
// NOTE: The image is going to be loaded asyncronously (lazy) which could be
// after the program continues to the next functions. OUCH!
function loadFileTexture(tex, filename)
{
	//create and initalize a webgl texture object.
    tex.textureWebGL  = gl.createTexture();
    tex.image = new Image();
    tex.image.src = filename ;
    tex.isTextureReady = false ;
    tex.image.onload = function() { handleTextureLoaded(tex); }
}

// Once the above image file loaded with loadFileTexture is actually loaded,
// this funcion is the onload handler and will be called.
function handleTextureLoaded(textureObj) {
	//Binds a texture to a target. Target is then used in future calls.
		//Targets:
			// TEXTURE_2D           - A two-dimensional texture.
			// TEXTURE_CUBE_MAP     - A cube-mapped texture.
			// TEXTURE_3D           - A three-dimensional texture.
			// TEXTURE_2D_ARRAY     - A two-dimensional array texture.
    gl.bindTexture(gl.TEXTURE_2D, textureObj.textureWebGL);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // otherwise the image would be flipped upsdide down
	
	//texImage2D(Target, internalformat, width, height, border, format, type, ImageData source)
    //Internal Format: What type of format is the data in? We are using a vec4 with format [r,g,b,a].
        //Other formats: RGB, LUMINANCE_ALPHA, LUMINANCE, ALPHA
    //Border: Width of image border. Adds padding.
    //Format: Similar to Internal format. But this responds to the texel data, or what kind of data the shader gets.
    //Type: Data type of the texel data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureObj.image);
	
	//Set texture parameters.
    //texParameteri(GLenum target, GLenum pname, GLint param);
    //pname: Texture parameter to set.
        // TEXTURE_MAG_FILTER : Texture Magnification Filter. What happens when you zoom into the texture
        // TEXTURE_MIN_FILTER : Texture minification filter. What happens when you zoom out of the texture
    //param: What to set it to.
        //For the Mag Filter: gl.LINEAR (default value), gl.NEAREST
        //For the Min Filter: 
            //gl.LINEAR, gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR (default value), gl.LINEAR_MIPMAP_LINEAR.
    //Full list at: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
	
	//Generates a set of mipmaps for the texture object.
        /*
            Mipmaps are used to create distance with objects. 
        A higher-resolution mipmap is used for objects that are closer, 
        and a lower-resolution mipmap is used for objects that are farther away. 
        It starts with the resolution of the texture image and halves the resolution 
        until a 1x1 dimension texture image is created.
        */
    gl.generateMipmap(gl.TEXTURE_2D);
	
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
    gl.bindTexture(gl.TEXTURE_2D, null);
    console.log(textureObj.image.src) ;
    
    textureObj.isTextureReady = true ;
}

// Takes an array of textures and calls render if the textures are created/loaded
// This is useful if you have a bunch of textures, to ensure that those files are
// actually loaded from disk you can wait and delay the render function call
// Notice how we call this at the end of init instead of just calling requestAnimFrame like before
function waitForTextures(texs) {
    setTimeout(
		function() {
			   var n = 0 ;
               for ( var i = 0 ; i < texs.length ; i++ )
               {
                    console.log(texs[i].image.src) ;
                    n = n+texs[i].isTextureReady ;
               }
               wtime = (new Date()).getTime() ;
               if( n != texs.length )
               {
               		console.log(wtime + " not ready yet") ;
               		waitForTextures(texs) ;
               }
               else
               {
               		console.log("ready to render") ;
					render(0);
               }
		},
	5) ;
}

// This will use an array of existing image data to load and set parameters for a texture
// We'll use this function for procedural textures, since there is no async loading to deal with
function loadImageTexture(tex, image) {
	//create and initalize a webgl texture object.
    tex.textureWebGL  = gl.createTexture();
    tex.image = new Image();

	//Binds a texture to a target. Target is then used in future calls.
		//Targets:
			// TEXTURE_2D           - A two-dimensional texture.
			// TEXTURE_CUBE_MAP     - A cube-mapped texture.
			// TEXTURE_3D           - A three-dimensional texture.
			// TEXTURE_2D_ARRAY     - A two-dimensional array texture.
    gl.bindTexture(gl.TEXTURE_2D, tex.textureWebGL);

	//texImage2D(Target, internalformat, width, height, border, format, type, ImageData source)
    //Internal Format: What type of format is the data in? We are using a vec4 with format [r,g,b,a].
        //Other formats: RGB, LUMINANCE_ALPHA, LUMINANCE, ALPHA
    //Border: Width of image border. Adds padding.
    //Format: Similar to Internal format. But this responds to the texel data, or what kind of data the shader gets.
    //Type: Data type of the texel data
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
	
	//Generates a set of mipmaps for the texture object.
        /*
            Mipmaps are used to create distance with objects. 
        A higher-resolution mipmap is used for objects that are closer, 
        and a lower-resolution mipmap is used for objects that are farther away. 
        It starts with the resolution of the texture image and halves the resolution 
        until a 1x1 dimension texture image is created.
        */
    gl.generateMipmap(gl.TEXTURE_2D);
	
	//Set texture parameters.
    //texParameteri(GLenum target, GLenum pname, GLint param);
    //pname: Texture parameter to set.
        // TEXTURE_MAG_FILTER : Texture Magnification Filter. What happens when you zoom into the texture
        // TEXTURE_MIN_FILTER : Texture minification filter. What happens when you zoom out of the texture
    //param: What to set it to.
        //For the Mag Filter: gl.LINEAR (default value), gl.NEAREST
        //For the Min Filter: 
            //gl.LINEAR, gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR (default value), gl.LINEAR_MIPMAP_LINEAR.
    //Full list at: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating)
    gl.bindTexture(gl.TEXTURE_2D, null);

    tex.isTextureReady = true;
}

// This just calls the appropriate texture loads for this example adn puts the textures in an array
function initTexturesForExample() {
    textureArray.push({}) ;
    loadFileTexture(textureArray[textureArray.length-1],"box.png") ;
    
    textureArray.push({}) ;
    loadImageTexture(textureArray[textureArray.length-1],imageCheckerboard) ;

    textureArray.push({}) ;
    loadImageTexture(textureArray[textureArray.length-1],Tombtexture) ;

    textureArray.push({}) ;
    loadImageTexture(textureArray[textureArray.length-1],Crosstexture) ;

    textureArray.push({}) ;
    loadImageTexture(textureArray[textureArray.length-1],Fairytexture) ;

    textureArray.push({}) ;
    loadImageTexture(textureArray[textureArray.length-1],Wingtexture) ;
}

// Changes which texture is active in the array of texture examples (see initTexturesForExample)
function toggleTextures() {
    useTextures = (useTextures + 1) % 2
	gl.uniform1i(gl.getUniformLocation(program, "useTextures"), useTextures);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.53, 0.81, 0.92, 1.0);
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    

    setColor(materialDiffuse);
	
	// Initialize some shapes, note that the curved ones are procedural which allows you to parameterize how nice they look
	// Those number will correspond to how many sides are used to "estimate" a curved surface. More = smoother
    Cube.init(program);
    Cylinder.init(20,program);
    Cone.init(20,program);
    Sphere.init(36,program);

    // Matrix uniforms
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    
    // Lighting Uniforms
    gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );	
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess );
    
    document.getElementById("textureToggleButton").onclick = function() {
        toggleTextures() ;
        window.requestAnimFrame(render);
    };

	// Helper function just for this example to load the set of textures
    initTexturesForExample() ;

    waitForTextures(textureArray);
}

// Sets the modelview and normal matrix in the shaders
function setMV() {
    modelViewMatrix = mult(viewMatrix,modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    normalMatrix = inverseTranspose(modelViewMatrix);
    gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix) );
}

// Sets the projection, modelview and normal matrix in the shaders
function setAllMatrices() {
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    setMV();   
}

// Draws a 2x2x2 cube center at the origin
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawCube() {
    setMV();
    Cube.draw();
}

// Draws a sphere centered at the origin of radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawSphere() {
    setMV();
    Sphere.draw();
}

// Draws a cylinder along z of height 1 centered at the origin
// and radius 0.5.
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawCylinder() {
    setMV();
    Cylinder.draw();
}

// Draws a cone along z of height 1 centered at the origin
// and base radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawCone() {
    setMV();
    Cone.draw();
}

// Post multiples the modelview matrix with a translation matrix
// and replaces the modeling matrix with the result
function gTranslate(x,y,z) {
    modelMatrix = mult(modelMatrix,translate([x,y,z]));
}

// Post multiples the modelview matrix with a rotation matrix
// and replaces the modeling matrix with the result
function gRotate(theta,x,y,z) {
    modelMatrix = mult(modelMatrix,rotate(theta,[x,y,z]));
}

// Post multiples the modelview matrix with a scaling matrix
// and replaces the modeling matrix with the result
function gScale(sx,sy,sz) {
    modelMatrix = mult(modelMatrix,scale(sx,sy,sz));
}

// Pops MS and stores the result as the current modelMatrix
function gPop() {
    modelMatrix = MS.pop();
}

// pushes the current modelViewMatrix in the stack MS
function gPush() {
    MS.push(modelMatrix);
}
//ground
function ground(){
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
	gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
    gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 0.13, 0.55, 0.13, 1.0); // Green glow
    gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 2.5); // Strong glow effect
    gPush();{
    gTranslate(0, -10.5, 0);
    gScale(20, 5, 10);
    drawCube();
    }
    gPop();
}
//Tombstone
function Tomb1(){
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[2].textureWebGL);
	gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
    gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 0.8, 0.3, 1.0); // Golden glow
    gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 2.5); // Strong glow effect
    //body
    gPush();{
       gScale(0.9,1.5,0.4);
       gTranslate(0, -3, 0);
    drawCube(); 
    }
    gPop();
}
//Cross
function Cross1(){
    //cross1
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[3].textureWebGL);
	gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
    gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 0.8, 0.3, 1.0); // Golden glow
    gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 7.5); // Strong glow effect
    gPush();{
        gScale(0.2,0.8,0.1);
        gTranslate(0, -3, 0);
        drawCube();
    }
    gPop();
    //cross2
    gPush();{
        gScale(0.7,0.2,0.08);
        gTranslate(0, -10.5, 0);
        drawCube();
    }
    gPop();
}
//  Fairy1
function Fairy1(){
let angle = TIME * 0.3;
let jellyX = 4.0 * Math.cos(angle);
let jellyZ = 4.0 * Math.sin(angle);

// Compute rotation based on direction change 
let prevAngle = (TIME - dt) * 0.3;
let prevJellyX = 4.0 * Math.cos(prevAngle);
let prevJellyZ = 4.0 * Math.sin(prevAngle);

let deltaX = jellyX - prevJellyX;
let deltaZ = jellyZ - prevJellyZ;
let rotationAngle = Math.atan2(deltaZ, deltaX) * (180 / Math.PI);

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textureArray[4].textureWebGL);
gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 0.8, 0.3, 1.0); // Golden glow
gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 2.5); // Strong glow effect

gPush();
    gTranslate(jellyX, TIME * 0.2, jellyZ);
    gRotate(-rotationAngle, 0, 1, 0); 
    // body 
    gPush();
        gScale(0.4, 0.4, 0.4);
        gTranslate(0, -5, 0); 
        drawSphere();
    gPop();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);    
    // buttom left wing
    gPush();
gTranslate(0, -1.8, -0.6);  // Move to pivot point at the wing’s root
gRotate(-10 * Math.sin(TIME * 4), 0, 0, 1); // Oscillating flap
gTranslate(0, 1.8, 0.6);  // Move back to maintain position
    gPush();
        gTranslate(-0.25, -2, -0.5); 
        gScale(0.2, 0.07, 0.2); 
        drawSphere();
    gPop();
    gPop();
    // buttom right wing
    gPush();
gTranslate(0, -1.8, 0.6);  // Move to pivot point at the wing’s root
gRotate(-10 * Math.sin(TIME * 4), 0, 0, 1); // Oscillating flap
gTranslate(0, 1.8, -0.6);  // Move back to maintain position
    gPush();
        gTranslate(-0.25, -2, 0.5); 
        gScale(0.2, 0.07, 0.2); 
        drawSphere();
    gPop();
    gPop();
    //main left wing
    gPush();
gTranslate(0, -1.8, -0.6);  // Move to pivot point at the wing’s root
gRotate(30 * Math.sin(TIME * 4), 0, 0, 1); // Oscillating flap
gTranslate(0, 1.8, 0.6);  // Move back to maintain position
    gPush();
        gTranslate(0.4, -2, -0.6); 
        gScale(0.4, 0.1, 0.4); 
        drawSphere();
    gPop();
    gPop();
   // Main right wing 
gPush();
gTranslate(0, -1.8, 0.6);  // Move to pivot point at the wing’s root
gRotate(30 * Math.sin(TIME * 4), 0, 0, 1); // Oscillating flap
gTranslate(0, 1.8, -0.6);  // Move back to maintain position

gPush();
    gTranslate(0.4, -2, 0.6); // Position the wing outward from body
    gScale(0.4, 0.1, 0.4); 
    drawSphere();
gPop();
gPop();
//Tail
gPush();
        gTranslate(-0.6, -2, 0);
        gRotate(8 * Math.sin(TIME * 1), 0, 0, 1);
        //lower protected part connect to the body
        gPush();
        gScale(0.3, 0.07, 0.07);
          drawCube();
        gPop();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textureArray[4].textureWebGL);
gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        //main tail
        gPush();
          gRotate(8 * Math.sin(TIME * 1), 0, 0, 1);
          gTranslate(-0.55, 0, 0);
          gScale(0.3, 0.07, 0.07);
          drawCube();
        gPop();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        //Magic ball at the end
        gPush();
          gRotate(8 * Math.sin(TIME * 1), 0, 0, 1);
          gTranslate(-1, 0, 0);
          gScale(0.2, 0.2, 0.2);
          drawSphere();
        gPop();
    gPop();
    gPop();
}
//Brave Soul
    // Ascending
function Soul1(){
    let astronautOffsetY = TIME * 0.2; 
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 1.0, 1.0, 1.0); // White glow
gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 2.5); // Strong glow effect
    gPush();
        gTranslate(0, 2+astronautOffsetY, 0);
        gScale(0.8, 0.8, 0.8);
    gPush();
        // Head 
        gPush();
            gScale(0.6, 0.6, 0.6);
            drawSphere();
        gPop();
        //halo circle
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[4].textureWebGL);
        gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 0.8, 0.3, 1.0); // Golden glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 7.5); // Strong glow effect
        gPush();
            gTranslate(0, 0.7, 0);
            gRotate(90, 1, 0, 0);
            gScale(1.0 ,1.0, 0.1);
            drawCylinder();
        gPop();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
        gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 1.0, 1.0, 1.0); // White glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 2.5); // Strong glow effect
        // Torso
        gPush();
            gTranslate(0, -1.6, 0);
            gRotate(-30, 0, 1, 0);
            gScale(0.7, 1.1, 0.3); 
            drawCube();
        gPop();
        // Legs
        
        // Left Leg 
        gPush();
            gTranslate(-0.4, -3.4, -0.2);
            gRotate(15+8 * Math.sin(TIME * 1), 1, 0, 0);
            gRotate(-30, 0, 1, 0);
            setColor(vec4(1.0, 1.0, 1.0, 1.0));
            
            // Thigh
            gPush();
                gScale(0.25, 0.7, 0.25);
                drawCube();
            gPop();
            
            // Calf
            gPush();
                gRotate(4+8 * Math.sin(TIME * 1), 1, 0, 0);
                gTranslate(0, -1.3, 0);
                gScale(0.25, 0.6, 0.25);
                drawCube();
            gPop();
            
            // Foot
            gPush();
                gRotate(4+8 * Math.sin(TIME * 1), 1, 0, 0);
                gTranslate(0, -1.8, 0);
                gScale(0.25, 0.1, 0.5);
                drawCube();
            gPop();
        gPop();

        //Right leg
         gPush();
         gTranslate(0.4, -3.4, -0.2);
         gRotate(15-8 * Math.sin(TIME * 1), 1, 0, 0);
         gRotate(-30, 0, 1, 0);
         setColor(vec4(1.0, 1.0, 1.0, 1.0));
         
         // Thigh
         gPush();
             gScale(0.25, 0.7, 0.25);
             drawCube();
         gPop();
         
         // Calf
         gPush();
             gRotate(4-8 * Math.sin(TIME * 1), 1, 0, 0);
             gTranslate(0, -1.3, 0);
             gScale(0.25, 0.6, 0.25);
             drawCube();
         gPop();
         
         // Foot
         gPush();
             gRotate(4-8 * Math.sin(TIME * 1), 1, 0, 0);
             gTranslate(0, -1.8, 0);
             gScale(0.25, 0.1, 0.5);
             drawCube();
         gPop();
     gPop();
        
        // Arms
        // Left Arm
        gPush();
            gRotate(-45+5 * Math.sin(TIME * 1), 0, 0, 1);
            gRotate(-15, 0, 1, 0);
            gScale(0.2, 0.7, 0.2);
            gTranslate(-1.2, -2.4, -3.0);
            setColor(vec4(0.8, 0.8, 0.8, 1.0));
            drawCube();
        gPop();
        
        // Right Arm
        gPush();
            gRotate(45+5 * Math.sin(TIME * 1), 0, 0, 1);
            gRotate(-15, 0, 1, 0);
            gScale(0.2, 0.7, 0.2);
            gTranslate(1.2, -2.4, 3.0);
            setColor(vec4(0.8, 0.8, 0.8, 1.0));
            drawCube();
        gPop();
    gPop();
}
//Flower1
function flower1(){
    gPush();
        gTranslate(-2, -5.3, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
	    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 0.13, 0.55, 0.13, 1.0); // green glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 2.5); // Strong glow effect
        //brench1
        gPush();
        gScale(0.05, 0.2, 0.05);
        drawCube();
        gPop();
        //brench2
        gPush();
        gRotate(30, 0, 0, 1);
        gTranslate(-0.2, -0.1, 0);
        gScale(0.05, 0.15, 0.05);
        drawCube();
        gPop();
        //brench3
        gPush();
        gRotate(-30, 0, 0, 1);
        gTranslate(0.2, -0.1, 0);
        gScale(0.05, 0.15, 0.05);
        drawCube();
        gPop();
        //flower
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
        gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 1.0, 1.0, 1.0); // White glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 7.5); // Strong glow effect
        gPush();
        gTranslate(0, 0.25, 0);
        gRotate(90, 1, 0, 0);
        gScale(0.2, 0.2, 0.2);
        drawCylinder();
        gPop();
    gPop();    
}
//flower 2
function flower2(){
    gPush();
        gTranslate(-4, -5.3, 3);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
	    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 0.13, 0.55, 0.13, 1.0); // green glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 2.5); // Strong glow effect
        //brench1
        gPush();
        gScale(0.05, 0.2, 0.05);
        drawCube();
        gPop();
        //brench2
        gPush();
        gRotate(30, 0, 0, 1);
        gTranslate(-0.2, -0.1, 0);
        gScale(0.05, 0.15, 0.05);
        drawCube();
        gPop();
        //brench3
        gPush();
        gRotate(-30, 0, 0, 1);
        gTranslate(0.2, -0.1, 0);
        gScale(0.05, 0.15, 0.05);
        drawCube();
        gPop();
        //flower
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
        gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 1.0, 1.0, 1.0); // White glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 7.5); // Strong glow effect
        gPush();
        gTranslate(0, 0.25, 0);
        gRotate(90, 1, 0, 0);
        gScale(0.2, 0.2, 0.2);
        drawCylinder();
        gPop();
    gPop();    
}
//flower 3
function flower3(){
    gPush();
        gTranslate(5, -5.3, -2);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
	    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 0.13, 0.55, 0.13, 1.0); // green glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 2.5); // Strong glow effect
        //brench1
        gPush();
        gScale(0.05, 0.2, 0.05);
        drawCube();
        gPop();
        //brench2
        gPush();
        gRotate(30, 0, 0, 1);
        gTranslate(-0.2, -0.1, 0);
        gScale(0.05, 0.15, 0.05);
        drawCube();
        gPop();
        //brench3
        gPush();
        gRotate(-30, 0, 0, 1);
        gTranslate(0.2, -0.1, 0);
        gScale(0.05, 0.15, 0.05);
        drawCube();
        gPop();
        //flower
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
        gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 1.0, 1.0, 1.0); // White glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 7.5); // Strong glow effect
        gPush();
        gTranslate(0, 0.25, 0);
        gRotate(90, 1, 0, 0);
        gScale(0.2, 0.2, 0.2);
        drawCylinder();
        gPop();
    gPop();    
}
//flower 4
function flower4(){
    gPush();
        gTranslate(6, -5.3, 4);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
	    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 0.13, 0.55, 0.13, 1.0); // green glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 2.5); // Strong glow effect
        //brench1
        gPush();
        gScale(0.05, 0.2, 0.05);
        drawCube();
        gPop();
        //brench2
        gPush();
        gRotate(30, 0, 0, 1);
        gTranslate(-0.2, -0.1, 0);
        gScale(0.05, 0.15, 0.05);
        drawCube();
        gPop();
        //brench3
        gPush();
        gRotate(-30, 0, 0, 1);
        gTranslate(0.2, -0.1, 0);
        gScale(0.05, 0.15, 0.05);
        drawCube();
        gPop();
        //flower
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
        gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 1.0, 1.0, 1.0); // White glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 7.5); // Strong glow effect
        gPush();
        gTranslate(0, 0.25, 0);
        gRotate(90, 1, 0, 0);
        gScale(0.2, 0.2, 0.2);
        drawCylinder();
        gPop();
    gPop();    
}
//flower 5
function flower5(){
    gPush();
        gTranslate(0, -5.3, -5);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[1].textureWebGL);
	    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 0.13, 0.55, 0.13, 1.0); // green glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 2.5); // Strong glow effect
        //brench1
        gPush();
        gScale(0.05, 0.2, 0.05);
        drawCube();
        gPop();
        //brench2
        gPush();
        gRotate(30, 0, 0, 1);
        gTranslate(-0.2, -0.1, 0);
        gScale(0.05, 0.15, 0.05);
        drawCube();
        gPop();
        //brench3
        gPush();
        gRotate(-30, 0, 0, 1);
        gTranslate(0.2, -0.1, 0);
        gScale(0.05, 0.15, 0.05);
        drawCube();
        gPop();
        //flower
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
        gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
        gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 1.0, 1.0, 1.0); // White glow
        gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 7.5); // Strong glow effect
        gPush();
        gTranslate(0, 0.25, 0);
        gRotate(90, 1, 0, 0);
        gScale(0.2, 0.2, 0.2);
        drawCylinder();
        gPop();
    gPop();    
}
//Sword
function sword1(){
    gPush();
    gTranslate(0, -4.7, 1.5);
    //Blade
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[5].textureWebGL);
    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
    gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 0.8, 0.3, 1.0); // Golden glow
    gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 7.5); // Strong glow effect
    gPush();
    gScale(0.25, 0.9, 0.02);
    drawCube();
    gPop();
    //handle1
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[2].textureWebGL);
	gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
    gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 1.0, 1.0, 1.0); // White glow
    gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 7.5); // Strong glow effect
    gPush();
    gTranslate(0, 0.9, 0);
    gRotate(90, 0, 0, 1);
    gScale(0.1, 0.35, 0.05);
    drawCube();
    gPop();
    //handle2
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureArray[2].textureWebGL);
	gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
    gl.uniform4f(gl.getUniformLocation(program, "glowColor"), 1.0, 1.0, 1.0, 1.0); // White glow
    gl.uniform1f(gl.getUniformLocation(program, "glowIntensity"), 7.5); // Strong glow effect
    gPush();
    gTranslate(0, 1.3, 0);
    gScale(0.05, 0.3, 0.05);
    drawCube();
    gPop();
    gPop();

}
function render(timestamp) {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
  // Define the radius and speed of the circular motion
const cameraRadius = 90; // Distance from the center
const cameraSpeed = 0.1; // Speed of rotation
const cameraHeight = 5; // Fixed height of the camera

// Compute new eye position in a horizontal circular trajectory (XZ plane)
const angle = timestamp * cameraSpeed * 0.001; // Convert time to an angle
const eye = vec3(cameraRadius * Math.cos(angle), cameraHeight, cameraRadius * Math.sin(angle)); // Circle around the center

    MS = []; // Initialize modeling matrix stack
	
	// initialize the modeling matrix to identity
    modelMatrix = mat4();
    
    // set the camera matrix
    viewMatrix = lookAt(eye, at, up);
   
    // set the projection matrix
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    
    // set all the matrices
    setAllMatrices();
    
	// dt is the change in time or delta time from the last frame to this one
	// in animation typically we have some property or degree of freedom we want to evolve over time
	// For example imagine x is the position of a thing.
	// To get the new position of a thing we do something called integration
	// the simpelst form of this looks like:
	// x_new = x + v*dt
	// That is the new position equals the current position + the rate of of change of that position (often a velocity or speed), times the change in time
	// We can do this with angles or positions, the whole x,y,z position or just one dimension. It is up to us!
	dt = (timestamp - prevTime) / 1000.0;
	prevTime = timestamp;
    TIME += dt; // Ensure TIME updates each frame
	
	// We need to bind our textures, ensure the right one is active before we draw
	//Activate a specified "texture unit".
    //Texture units are of form gl.TEXTUREi | where i is an integer.

	// Now let's draw a shape animated!
	// You may be wondering where the texture coordinates are!
	// We've modified the object.js to add in support for this attribute array!
    // Ensure the spotlight texture is active each frame

    // Set spotlight properties dynamically (if needed)

	ground();
    Tomb1();
    Cross1();
    Fairy1();
    flower1();
    flower2();
    flower3();
    flower4();
    flower5();
    sword1();
    Soul1();
    window.requestAnimFrame(render);
}
