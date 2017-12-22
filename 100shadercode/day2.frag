// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592653589793
#define HALF_PI 1.5707963267948966

uniform vec2 u_resolution;
uniform float u_time;

vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    _st.x += step(1., mod(_st.y,2.0)) * sin(u_time);
    _st.y += step(1., mod(_st.x,2.0)) * sin(u_time);

    return fract(_st);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

float circle(vec2 _st, float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.590,0.116,0.201);

    // Apply the brick tiling
    st = brickTile(st,29.0);

    color = vec3(box(st,vec2(sin(u_time),sin(u_time))));

    
    // Uncomment to see the space coordinates
    // color = vec3(st,0.0);

    gl_FragColor = vec4(color,1.0);
}