uniform sampler2D alphaMap;

varying vec2 vUv;

void main() {
  vec3 bottom = vec3(0.0, 0.75, 0.65);
  vec3 top    = vec3(0.4, 1.0, 0.85);
  vec3 color   = mix(bottom, top, vUv.y);

  float alpha = texture2D(alphaMap, vUv).x;
  gl_FragColor = vec4(color, alpha);
}
