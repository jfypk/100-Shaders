
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233))) 
                * 43758.5453123);
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ), 
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ), 
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float pattern(vec2 st, vec2 v, float t) {
    vec2 p = floor(st+v);
    return step(t, random(100.+p*.000001)+random(p)*0.5 );
}

vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

float shape(vec2 st, float radius) {
    st = tile(vec2(0.000)-st, 333.);
    st = vec2(0.370,0.760)-st;
    float r = length(st)*(cos(u_time*.234)+3.);
    float a = atan(st.y,st.x);
    float m = abs(mod(a+u_time*2.,3.14*2.)-3.14)/3.6;
    float f = radius;
    m += noise(st+u_time*0.1)*.5;
    a *= 1.+abs(atan(u_time*0.2))*.1;
    // a *= 1.+noise(st+u_time*0.1)*0.1;
    f += sin(a*50.)*noise(st+u_time*.2)*.1;
    f += (sin(a*20.)*.1*pow(m,2.));
    return 1.-smoothstep(f,f+0.159,r);
}

float shapeBorder(vec2 st, float radius, float width) {
    return shape(st,radius)-shape(st,radius-width);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	vec3 color = vec3(.3,.5,0.) * shapeBorder(st,1.104,0.476);

	gl_FragColor = vec4(color, 1.0 );
}