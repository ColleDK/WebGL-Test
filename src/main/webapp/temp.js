var vertexShaderText =
    [
        'precision mediump float;',
        '',
        'attribute vec2 vertPosition;',
        'attribute vec3 vertColor;',
        'varying vec3 fragColor;',
        '',
        'void main()',
        '{',
        'fragColor = vertColor;',
        'gl_Position = vec4(vertPosition, 0.0, 1.0);',
        '}'
    ].join('\n');

var fragmentShaderText =
    [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        'void main()',
        '{',
        'gl_FragColor = vec4(fragColor, 1.0);',
        '}'
    ].join('\n');



var initDemo = function () {
    var canvas = document.getElementById("window-surface");
    var gl = canvas.getContext('webgl');

    if (!gl){
        console.log("WebGL not fully supported, trying to get experimental version")
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl){
        alert("WebGL not supported on this browser")
    }

    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    //gl.viewport(0,0,window.innerWidth, window.innerHeight);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // Create shaders for WebGL
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        alert("Error compiling vertex shader", gl.getShaderInfoLog(vertexShader))
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        alert("Error compiling fragment shader", gl.getShaderInfoLog(fragmentShader))
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
        alert('Error linking the shaders to the program', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        alert('Error validating the program', gl.getProgramInfoLog(program));
        return;
    }


    // Create buffer
    var triangleVertices =
        [ //X, Y, R, G, B
            0.0, 0.5, 1.0, 1.0, 0.0,
            -0.5, -0.5, 0.7, 0.9, 0.3,
            0.5, -0.5, 0.2, 0.5, 0.3,
        ];

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');


    gl.vertexAttribPointer(
        // Attribute location
        positionAttributeLocation,
        // Number of elements per attribute
        2,
        // Type of elements
        gl.FLOAT,
        // Is data normalized
        gl.FALSE,
        // Size of an individual vertex
        5 * Float32Array.BYTES_PER_ELEMENT,
        // Offset from the beginning to the attribute
        0
    );

    gl.vertexAttribPointer(
        // Attribute location
        colorAttributeLocation,
        // Number of elements per attribute
        3,
        // Type of elements
        gl.FLOAT,
        // Is data normalized
        gl.FALSE,
        // Size of an individual vertex
        5 * Float32Array.BYTES_PER_ELEMENT,
        // Offset from the beginning of a single vertex to the attribute
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);


    // Main render loop
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

}