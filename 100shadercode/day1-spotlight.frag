#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float parabola(float x, float k) {
    return pow(4.0*x*(1.0+x), k);
}

vec2 rotate(vec2 st, float angle) {
    return mat2(cos(angle),-sin(angle),
               sin(angle),cos(angle)) * st;
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) + 
            box(_st, vec2(_size/4.,_size));
}

void main(){
    float PI=3.14159265359;
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    
    float t = u_time*.8;
    float t_size = u_time*0.1;
    
    st.x += tan(t+st.y*8.800)*0.292;
    st.y += cos(t+st.y*3.488)*2.346;
    // st.x += cos(t+st.y*7.0)*.02;
    // st.y += cos(t+st.y*3.)*.01;
    
    float angle = 1.830;
    st = rotate(st, sin(u_time)*PI);

    vec2 pos = vec2(0.520,0.470)-st;

    float r = length(pos)*3.904;
    float a = atan(pos.y,pos.x);

    float f = sin(a*parabola(0.20745,t));

    color = vec3( 1.-smoothstep(f,f+1.032,r) );
    color += vec3(cross(st,cos(u_time)));

    gl_FragColor = vec4(color, 1.0);
}