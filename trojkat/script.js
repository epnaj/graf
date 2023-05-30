// const vertexShaderTxt = `
//     precision mediump float;

//     attribute vec3 vertPosition;
//     attribute vec3 vertColor;

//     varying vec3 fragColor;

//     uniform mat4 mWorld;
//     uniform mat4 mView;
//     uniform mat4 mProj;

//     void main()
//     {
//         fragColor = vertColor;
//         gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
//     }

// `

// const fragmentShaderTxt = `
//     precision mediump float;

//     varying vec3 fragColor;

//     void main()
//     {
//         gl_FragColor = vec4(fragColor, 1.0); // R,G,B, opacity
//     }
// `

const vertexShaderTxt = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;
    void main()
    {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 1.0);
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

function ButtonFunc() {
    document.getElementById('change-button').onclick = function() {
        Triangle();
        Hexagon();
    };
}

function Hexagon() {
    var canvas = document.getElementById('second-canvas');
    var gl = canvas.getContext('webgl');

    if(!gl){
        alert("WEBLG is not supported")
    }

    // gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error(gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error(gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    var hexagon_2 = []
    for(var i = 0; i<6; i++){
        hexagon_2.push(Math.sin(i/3.0*Math.PI));
        hexagon_2.push(Math.cos(i/3.0*Math.PI));
        for(var k = 0; k<3; k++){
            hexagon_2.push(Math.random());
        }
    }
    let DrawHexagon = function(vertricesAndColours){
        var triangleVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertricesAndColours), gl.STATIC_DRAW);

        var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
        var colourAttributeLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(colourAttributeLocation, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.enableVertexAttribArray(colourAttributeLocation);

        gl.useProgram(program);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
    }
    DrawHexagon(hexagon_2);
    // DrawSingleTriangle(secondTriangle);
}


function Triangle() {
    var canvas = document.getElementById('main-canvas');
    var gl = canvas.getContext('webgl');

    if(!gl){
        alert("WEBLG is not supported")
    }

    // gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error(gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error(gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);
    
    var firstTriangle = [
        -0.5, -0.5,  0.3, 0.3, 0.5,
        0.5, 0.5,    1.0, 0.2, 1.0,
        -0.5, 0.5,   0.1, 0.9, 0.1,
    ];
    var secondTriangle = [
        -0.5, -0.5,  0.3, 0.3, 0.5,
        0.5, 0.5,    1.0, 0.2, 1.0,
        0.5, -0.5,   0.0, 0.1, 0.0
    ]
    
    for(var i=0; i<2; i++){
        for(var k=0; k<3; k++){
            firstTriangle[i*5 + 2+k] = secondTriangle[i*5 + 2+k] = Math.random();
        }
    }
    for(var k=0; k<3; k++){
        firstTriangle[12 + k] = Math.random();
        secondTriangle[12 + k] = Math.random();
    }

    let DrawSingleTriangle = function(vertricesAndColours){
        var triangleVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertricesAndColours), gl.STATIC_DRAW);

        var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
        var colourAttributeLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(colourAttributeLocation, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.enableVertexAttribArray(colourAttributeLocation);

        gl.useProgram(program);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    DrawSingleTriangle(firstTriangle);
    DrawSingleTriangle(secondTriangle);
}