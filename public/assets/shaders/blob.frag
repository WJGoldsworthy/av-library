precision mediump float;

varying vec3 vNormal;
varying vec2 vTexCoord;

varying float vNoise;
uniform float uTime;
uniform float uAmp;


// https://iquilezles.org/www/articles/palettes/palettes.htm
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    // Try out different values.
    vec3 color1 = vec3(vNoise * uAmp * 0.2, vNoise * uAmp, vNoise * -uAmp);

    vec3 color2 = palette(
        vNormal.y,
        vec3(uAmp, 0.5, 0.5),
        vec3(vNoise * uAmp, 0.5, 0.5),
        vec3(1.0, vNoise, uAmp),
        vec3(vNoise * uAmp, 0.9, 0.3)
    );

    vec3 finalColor = mix(color1, color2, sin(uTime * 0.001));

    // Comment / uncomment for mix on/off.
    
    // One color.
     gl_FragColor = vec4(color2, 1.0);

    // Mix.
    //gl_FragColor = vec4(finalColor, 1.0);      
}