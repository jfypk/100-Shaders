// Author: @patriciogv - 2015
// Title: Metaballs

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(0.290,0.410)),dot(p,vec2(269.5,183.3))))*43758.273);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.);
    if(st.x/3.==270.) {
        color = vec3(0.835,0.325,0.349);
    }
    
    // Scale 
    st *= 5.;
    
    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 5.;  // minimun distance 
    
    for (int j= -1; j <= 1; j++ ) {
        for (int i= -1; i <= 1; i++ ) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(i),float(j));
            
            // Random position from current + neighbor place in the grid
            vec2 offset = random2(i_st + neighbor);

            // Animate the offset
            offset = .5 + 0.5*sin(u_time + 6.2831*offset);
            
            // Position of the cell             
            vec2 pos = neighbor + offset - f_st;
            
            // Cell distance
            float dist = length(pos);

            // Metaball it!
            m_dist = min(m_dist, m_dist*dist);
        }
    }

    // Draw cells
    
    color.g = m_dist*0.813;
    color.b = 0.933;
    color.r = abs(sin(u_time));
    
    gl_FragColor = vec4(color,1.0);
}