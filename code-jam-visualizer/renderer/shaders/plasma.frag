precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform float uBass;
uniform float uMid;
uniform float uHigh;
uniform float uRMS;
uniform sampler2D uSpectrum;

#define PI 3.14159265359
#define TAU 6.28318530718

// --- Palette: maps t ∈ [0,1] to an RGB color ---
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(TAU * (c * t + d));
}

// --- Smooth noise for organic motion ---
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    val += amp * noise(p);
    p *= 2.1;
    amp *= 0.5;
  }
  return val;
}

void main() {
  vec2 uv = vUv;
  vec2 centeredUv = (uv - 0.5) * 2.0;
  float aspect = uResolution.x / uResolution.y;
  centeredUv.x *= aspect;

  float t = uTime * 0.4;

  // --- Layer 1: Plasma base ---
  float plasma = 0.0;
  plasma += sin(centeredUv.x * 3.0 + t * 1.2);
  plasma += sin(centeredUv.y * 2.7 - t * 0.9);
  plasma += sin((centeredUv.x + centeredUv.y) * 2.5 + t * 0.7);
  plasma += sin(length(centeredUv) * 4.0 - t * 1.5);
  plasma += sin(distance(centeredUv, vec2(sin(t * 0.3), cos(t * 0.5))) * 5.0);
  plasma *= 0.2;

  // Audio-reactive distortion on plasma
  plasma += uBass * 0.4 * sin(centeredUv.x * 8.0 + t * 3.0);
  plasma += uMid * 0.3 * sin(centeredUv.y * 6.0 - t * 2.0);

  // --- Layer 2: Tunnel effect ---
  float dist = length(centeredUv);
  float angle = atan(centeredUv.y, centeredUv.x);

  float tunnelDepth = 1.0 / (dist + 0.1);
  float tunnelAngle = angle / PI;

  float tunnelScroll = t * (0.5 + uBass * 2.0);
  float tunnel = sin(tunnelDepth * 4.0 - tunnelScroll) *
                 cos(tunnelAngle * 3.0 + tunnelScroll * 0.5);

  float tunnelNoise = fbm(vec2(tunnelDepth * 2.0 - tunnelScroll, tunnelAngle * 2.0));
  tunnel = mix(tunnel, tunnelNoise, 0.3 + uMid * 0.3);

  // Fade tunnel toward edges
  float tunnelMask = smoothstep(0.0, 0.8, dist) * (1.0 - smoothstep(1.5, 3.0, dist));

  // --- Combine layers ---
  float combined = mix(plasma, tunnel, tunnelMask * 0.6);

  // Add fbm warp based on audio
  vec2 warpUv = centeredUv + vec2(
    fbm(centeredUv * 2.0 + t * 0.3) - 0.5,
    fbm(centeredUv * 2.0 + t * 0.3 + 100.0) - 0.5
  ) * (0.1 + uBass * 0.3);
  combined += fbm(warpUv * 3.0 + t * 0.2) * 0.3;

  // --- Coloring ---
  // Shift palette hue with time and spectral content
  float hueShift = t * 0.1 + uMid * 0.3;
  vec3 col = palette(
    combined + hueShift,
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(1.0, 0.7, 0.4),
    vec3(0.0, 0.15, 0.2)
  );

  // Second palette blended in for richer color
  vec3 col2 = palette(
    combined * 1.3 + hueShift + 0.5,
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(2.0, 1.0, 0.0),
    vec3(0.5, 0.2, 0.25)
  );
  col = mix(col, col2, 0.5 + uHigh * 0.3);

  // --- Beat flash ---
  float beat = smoothstep(0.35, 0.8, uRMS);
  col += beat * vec3(0.3, 0.15, 0.4);

  // Bright kick flash from bass
  col += smoothstep(0.5, 1.0, uBass) * vec3(0.1, 0.2, 0.3);

  // --- Treble sparkle ---
  float sparkle = smoothstep(0.3, 0.8, uHigh) * step(0.97, hash(uv * uResolution + fract(t * 60.0)));
  col += sparkle * vec3(1.0, 0.9, 0.7) * 2.0;

  // --- Chromatic aberration ---
  float caStrength = 0.003 + uRMS * 0.008;
  vec2 caDir = normalize(centeredUv + 0.001);
  float rOffset = plasma + fbm(warpUv * 3.0 + t * 0.2 + caStrength * 10.0) * 0.3;
  float bOffset = plasma + fbm(warpUv * 3.0 + t * 0.2 - caStrength * 10.0) * 0.3;
  vec3 colR = palette(rOffset + combined + hueShift, vec3(0.5), vec3(0.5), vec3(1.0, 0.7, 0.4), vec3(0.0, 0.15, 0.2));
  vec3 colB = palette(bOffset + combined + hueShift, vec3(0.5), vec3(0.5), vec3(1.0, 0.7, 0.4), vec3(0.0, 0.15, 0.2));
  col.r = mix(col.r, colR.r, 0.5);
  col.b = mix(col.b, colB.b, 0.5);

  // --- Vignette ---
  float vig = 1.0 - smoothstep(0.4, 1.8, dist);
  col *= vig;

  // --- Spectrum texture bar at bottom (subtle) ---
  float specBar = smoothstep(0.0, 0.03, uv.y) * (1.0 - smoothstep(0.03, 0.05, uv.y));
  float specVal = texture2D(uSpectrum, vec2(uv.x, 0.0)).r;
  col = mix(col, vec3(specVal * 0.5, specVal * 1.0, specVal * 0.7), specBar * 0.6);

  // Clamp and output
  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
}
