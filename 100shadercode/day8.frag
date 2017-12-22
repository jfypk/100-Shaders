#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

uniform sampler2D texture;
uniform vec2 u_resolution;
uniform float time;

#define PI 3.14159265359

varying vec4 vertTexCoord;

const vec3 color0 = vec3(.588235294, .674509804, .741176471);
const vec3 color1 = vec3(.529411765, .623529412, .68627451);
const vec3 replace1 = vec3(1., 1., 1.);
const vec3 color2 = vec3(.509803922, .592156863, .647058824);

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

float bounceOut(float t) {
  const float a = 4.0 / 11.0;
  const float b = 8.0 / 11.0;
  const float c = 9.0 / 10.0;

  const float ca = 4356.0 / 361.0;
  const float cb = 35442.0 / 1805.0;
  const float cc = 16061.0 / 1805.0;

  float t2 = t * t;

  return t < a
    ? 7.5625 * t2
    : t < b
      ? 9.075 * t2 - 9.9 * t + 3.4
      : t < c
        ? ca * t2 - cb * t + cc
        : 10.8 * t * t - 20.52 * t + 10.72;
}

float backOut(float t) {
  float f = 1.0 - t;
  return 1.0 - (pow(f, 3.0) - f * sin(f * PI));
}

void main()
{
	vec4 pixel = texture2D(texture, vertTexCoord.st);
	vec3 eps = vec3(0.05, 0.05, 0.05);

  if( all( greaterThanEqual(pixel, vec4(color0 - eps, 1.0)) ) && all( lessThanEqual(pixel, vec4(color0 + eps, 1.0)) ) )
		pixel = vec4(color0, 1.0);
    pixel += noise(pixel.rg/(1.-bounceOut(time/11.)));

	if( all( greaterThanEqual(pixel, vec4(color1 - eps, 1.0)) ) && all( lessThanEqual(pixel, vec4(color1 + eps, 1.0)) ) )
		pixel = vec4(color1, 1.0);
    pixel += noise(pixel.gb/(1.-bounceOut(time/11.)));
	
	if( all( greaterThanEqual(pixel, vec4(color2 - eps, 1.0)) ) && all( lessThanEqual(pixel, vec4(color2 + eps, 1.0)) ) )
		pixel = vec4(color2, 1.0);
    pixel += noise(pixel.rb/(1.-bounceOut(time/11.)));

	gl_FragColor = pixel;
}