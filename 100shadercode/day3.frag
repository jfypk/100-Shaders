// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define t u_time

float pulse(float cn, float wi, float x)
{
	return 1.-smoothstep(0., wi, abs(x-cn));
}

vec2 field(in vec2 p)
{
	vec2 n = floor(p);
	vec2 f = fract(p);
	vec2 m = vec2(1.);
    vec2 o = vec2(cos(t)*sin(t),.5);
	vec2 r = f+o-.99;
	float d = abs(r.x) + abs(r.y);
	if(d<m.x)
	{
		m.x = d;
	}
	return vec2(m.x,m.y);
}

void main()
{
	vec2 uv = gl_FragCoord.xy / u_resolution.xy-0.5;
	uv.x *= u_resolution.x/u_resolution.y;
	uv *= 29.;
	
	vec2 p = uv*.0001;
	p *= 1./(p-sin(u_time));
	
	uv.y += sin(t*.5)*0.000+t;
	uv.x += cos(t*.5)*1.536;
	
	vec3 col = vec3(0.0);
	for(float i=1.; i<= 40.; i++) //density
	{
		vec2 rn = field(uv);
		uv -= p*(i*.5-2.)*2.; //rate
		rn.x = pulse(0.7,.02, rn.x+rn.y*.15);
		col += rn.x*vec3(sin(rn.y*sin(t*10.)), tan(t*50.),sin(t)*0.3+.8);
	}
	
	gl_FragColor = vec4(col,1.);
}
