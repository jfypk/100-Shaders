#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

uniform sampler2D texture;
uniform vec2 u_resolution;
uniform float time;

varying vec4 vertColor;
varying vec4 vertTexCoord;

const vec4 lumcoeff = vec4(0.599, 0.787, 0.314, 0);

float random (in float x) {
    return fract(sin(x)*1e4);
}

float random (in vec2 st) { 
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.000001)+random(p.x)*0.5 );
}

void main() {
  vec4 col = texture2D(texture, vertTexCoord.st);
  float lum = dot(col, lumcoeff);
  if (0.5 < lum) {
    gl_FragColor = vertColor;
  } else {
    vec2 xy = vertTexCoord.st;
    vec2 grid = vec2(120.0,60.);
    xy *= grid;
    
    vec2 ipos = floor(xy);  // integer
    vec2 fpos = fract(xy);  // fraction

    vec2 vel = vec2(time*1.5*max(grid.x,grid.y)); // time
    vel *= vec2(-1.,0.0) * random(1.032+ipos.y); // direction

    // Assign a random value base on the integer coord
    vec2 offset = vec2(0.1,0.);

    vec3 color = vec3(0.);
    color.r = pattern(xy+offset,vel,0.5);
    color.g = pattern(xy,vel,0.5);
    color.b = pattern(xy-offset,vel,0.5);

    // Margins
    color *= step(0.5,fpos.y);

    gl_FragColor = vec4(1.0-color,1.0);
  }
}