// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

float cloud(vec2 st) {
    float n = 0.9;
    for (float i = 1.0; i < 9.0; i ++) {
        float m = pow(1.8, i);
        n += noise(st * m+u_time) * (1. / m);
    }
    return n * 0.5 + 0.5;
}

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
    float n = 0.9;
    for (float i = 1.0; i < 9.0; i ++) {
        float m = pow(1.8, i);
        n += noise(_st * m) * (1. / m);
    }
	return n*0.5+0.5-1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
	
 	vec3 color = vec3(st.x,st.y,.9);
	color *= vec3(cloud(st)+circle(st,.3));

    gl_FragColor = vec4(color,1.0);
}