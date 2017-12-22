// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const vec3 red = vec3(.949019608, .219607843, .352941176);
const vec3 orange = vec3(.960784314, .647058824, .011764706);
const vec3 blue = vec3(.290196078, .850980392, .850980392);

const float PI = 3.14159;

float hash (float n) {
    return fract(sin(n)*43758.54);
}

float noise ( in vec2 x) {
    vec2 p = floor(x); //left of decimal
    vec2 f = fract(x); //right of decimal
    f = f*f*(3.0-2.0*f); //f^2 * (3-2f)
    float n = p.x + p.y * 57.0;
    return mix(mix(hash(n+0.0), hash(n+1.0), f.x), mix(hash(n+57.0), hash(n+58.0),f.x), f.y);
}

mat2 m = mat2(0.6, 0.6, -0.6, 0.8);

float fbm(vec2 p) {
    float f = 0.0;
    f += 0.5000 * noise(p); p *= m * 2.02;
    f += 0.2500 * noise(p); p *= m * 2.03;
    f += 0.1250 * noise(p); p *= m * 2.01;
    f += 0.0625 * noise(p); p *= m * 2.04;
    f /= 0.9375;
    return f;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 p = -1. + 2. * st;
    p.x *= u_resolution.x/u_resolution.y;
    
    vec2 ctr = vec2(1.0, 0.0);
    vec2 ctr2 = vec2(-1.0, 0.0);
    
    vec2 m = vec2(0.2, 0.8);
    
    float rad = sqrt(dot(p,p));
    float r = sqrt(dot(p+ctr, p+ctr)) + m.y;
    float r2 = sqrt(dot(p+ctr2, p+ctr2)) + m.y;
    float a = r * r2;

    a*= fbm(m.x*p);
    a *= fbm(m.x * sqrt(p*p));
    a -= u_time * .3;
    
    vec3 col = vec3(0.);
    //vec3 col = red;
    float f = smoothstep(0.05, .9, fbm(vec2(a*2., r*r2)));
    col = mix(col, red, f);
    f = smoothstep(0.4, 0.9, fbm(vec2(a*2.0, r*r2)));
    col = mix(col, orange, f);
    f = smoothstep(0.3, 0.9, fbm(vec2(a*2.0, r * r2)));
    col*= 1.048 - f; //brightness
    

    gl_FragColor = vec4(col,1.0);
}