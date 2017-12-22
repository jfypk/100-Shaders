#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float shape(in vec2 st, in int N ) {
    float d = 0.0;
    st = st * 2.-1.;
    float a = atan(st.x, st.y) + PI;
    float r = (PI*2.)/float(N);
    d = cos(floor(.5+a/r)*r-a)*length(st);
    return d;
}

void main(){
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
  vec3 black = vec3(0.);
  vec3 blue = vec3(.074509804, .28627451, .639215686);
  vec3 orange = vec3(.909803922, .388235294, .117647059);
    
  vec3 color = blue; 
    
  float d = shape(st, 3);
    
  color = mix(color, orange, 1.-smoothstep(.4, cos(u_time)*2., d));

  gl_FragColor = vec4(color,1.0);
}