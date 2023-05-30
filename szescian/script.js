const vertexShaderTxt = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main()
    {
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }

`

const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0); // R,G,B, opacity
    }
`

// https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language

const mat4 = glMatrix.mat4;

let GenerateCube = function (edgeLength, colourArray){
    // colour array shold look like :
    // first vertex -> (R,G,B)  [R, G, B, 
    // second vertex -> (R,G,B)  R, G, B, 
    // :                         :  :  :
    // :                         :  :  :
    // eighth vertex -> (R,G,B) R, G, B]
    let fillWithColourAndAdjustLength = function(vertArr, colourArr, whichColour, edgeLen){
        for(var i=0; i<3; ++i){
            vertArr[i] *= edgeLen/2;
        }
        for(var i=0; i<3; ++i){
            vertArr[3 + i] = colourArr[whichColour*3 + i];
        }
        return vertArr;
    };
    let topLC = fillWithColourAndAdjustLength([-1.0, 1.0, 1.0, 0.0, 0.0, 0.0], colourArray, 0, edgeLength);
    let topLF = fillWithColourAndAdjustLength([-1.0, 1.0, -1.0, 0.0, 0.0, 0.0], colourArray, 1, edgeLength);
    let topRC = fillWithColourAndAdjustLength([1.0, 1.0, 1.0, 0.0, 0.0, 0.0], colourArray, 2, edgeLength);
    let topRF = fillWithColourAndAdjustLength([1.0, 1.0, -1.0, 0.0, 0.0, 0.0], colourArray, 3, edgeLength);
    let botLC = fillWithColourAndAdjustLength([-1.0, -1.0, 1.0, 0.0, 0.0, 0.0], colourArray, 4, edgeLength); 
    let botLF = fillWithColourAndAdjustLength([-1.0, -1.0, -1.0, 0.0, 0.0, 0.0], colourArray, 5, edgeLength); 
    let botRC = fillWithColourAndAdjustLength([1.0, -1.0, 1.0, 0.0, 0.0, 0.0], colourArray, 6, edgeLength);
    let botRF = fillWithColourAndAdjustLength([1.0, -1.0, -1.0, 0.0, 0.0, 0.0], colourArray, 7, edgeLength);
    var vertices = []
    // top
    vertices.push(...topLF);
    vertices.push(...topLC);
    vertices.push(...topRC);
    vertices.push(...topRF);
    // left
    vertices.push(...topLC);
    vertices.push(...botLC);
    vertices.push(...botLF);
    vertices.push(...topLF);
    // right 
    vertices.push(...topRC);
    vertices.push(...botRC);
    vertices.push(...botRF);
    vertices.push(...topRF);
    // front
    vertices.push(...topRC);
    vertices.push(...botRC);
    vertices.push(...botLC);
    vertices.push(...topLC);
    // back
    vertices.push(...topRF);
    vertices.push(...botRF);
    vertices.push(...botLF);
    vertices.push(...topLF);
    // bottom
    vertices.push(...botRF);
    vertices.push(...botLF);
    vertices.push(...botLC);
    vertices.push(...botRC);
    return vertices;
}

let CubeSettable = function (id) {
    let canvas = document.getElementById(id);
    let gl = canvas.getContext('webgl');

    if (!gl) {
        alert('webgl not supported');
    }

    gl.clearColor(0, 0, 0, 1.0);
    // gl.clearColor(0.5, 0.5, 0.5, 1.0);  // R,G,B, opacity
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);


    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader); //https://www.khronos.org/opengl/wiki/Shader_Compilation#Before_linking
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);
    var boxIndices =
    [
            // Top
            0, 1, 2,
            0, 2, 3,

            // Left
            5, 4, 6,
            6, 4, 7,

            // Right
            8, 9, 10,
            8, 10, 11,

            // Front
            13, 12, 14,
            15, 14, 12,

            // Back
            16, 17, 18,
            16, 18, 19,

            // Bottom
            21, 20, 22,
            22, 20, 23
    ];
    // kolory są losowane
    let colourArr = []
    for(var i=0; i<8; ++i){
        for(var k=0; k<3; ++k){
            colourArr.push(Math.random())
        }
    }
    // rozmiar, tablica kolorow
    let cube = GenerateCube(100, colourArr);

    const boxVerticesertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVerticesertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube), gl.STATIC_DRAW); // since everything in JS is 64 bit floating point we need to convert to 32 bits

    const cubeIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW); // since everything in JS is 64 bit floating point we need to convert to 32 bits

    const posAttrLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttrLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0,
    );

    const colorAttrLocation = gl.getAttribLocation(program, 'vertColor');
    const color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube), gl.STATIC_DRAW);

    gl.vertexAttribPointer(
        colorAttrLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6*Float32Array.BYTES_PER_ELEMENT,
        3*Float32Array.BYTES_PER_ELEMENT,
    );

    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorAttrLocation);

    gl.useProgram(program);

    const matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    let worldMatrix = mat4.create();
    let viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0,0,-Math.max(canvas.width, canvas.height)], [0,0,0], [0,1,0]); // vectors are: position of the camera, which way they are looking, which way is up
    let projMatrix = mat4.create();
    mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    let rotationMatrix = new Float32Array(16);
    let translationMatrix = new Float32Array(16);
    let angle = 0;
    const loop = function () {
        angle = performance.now() / 1000 / 8 * 2* Math.PI;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        mat4.fromRotation(rotationMatrix, angle, [2,-0.5,1]);
        mat4.fromTranslation(translationMatrix, [0,0,0]);
        mat4.mul(worldMatrix, translationMatrix, rotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
        rotationMatrix = new Float32Array(16);
        translationMatrix = new Float32Array(16);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}