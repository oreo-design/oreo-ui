// @ts-nocheck

// Property metadata is only used in Figma Design, so this is a no-op.
function defineProperties(
  _component: unknown,
  _properties: unknown,
): void {}

export default function Effect() { }
export function setup(device, frame) {
    var wgsl = `
diagnostic(off,derivative_uniformity);
struct Uniforms {
  frameData: vec4f,
  inputDimsData: vec4f,
  pitch: vec4f,
  cellSize: vec4f,
  gamma: vec4f,
  noisePhase: vec4f,
  twinkleIntensity: vec4f,
  color1: vec4f,
  color2: vec4f,
  color3: vec4f,
};
@group(0) @binding(0) var<uniform> u: Uniforms;

struct VsIn {
  @location(0) pos: vec2f,
  @location(1) uv: vec2f,
};
struct VsOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

fn hash21(p: vec2f) -> f32 {

  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);

  p3 += dot(p3, vec3f(p3.y + 33.33, p3.z + 33.33, p3.x + 33.33));

  return fract((p3.x + p3.y) * p3.z);

}

fn valueNoise(p: vec2f) -> f32 {

  let i = floor(p);

  let f = fract(p);

  let u = f * f * (3.0 - 2.0 * f);

  let a = hash21(i);

  let b = hash21(i + vec2f(1.0, 0.0));

  let c = hash21(i + vec2f(0.0, 1.0));

  let d = hash21(i + vec2f(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);

}

fn roundedBoxSDF(p: vec2f, half_size: vec2f, radius: f32) -> f32 {

  let q = abs(p) - half_size + vec2f(radius);

  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;

}

@vertex fn vs_main(in: VsIn) -> VsOut {
  var out: VsOut;
  out.position = vec4f(in.pos, 0.0, 1.0);
  out.uv = in.uv;
  return out;
}

@fragment fn fs_main(@location(0) outputUv_in: vec2f) -> @location(0) vec4f {
  let time = u.frameData.x;
  let outputUv = outputUv_in;
  let dims = max(u.frameData.yz, vec2f(1.0));
  let inputDims = max(u.inputDimsData.xy, vec2f(1.0));
  let inputTexel = vec2f(1.0) / inputDims;
  let uv = outputUv;
  // texel and aspect are input-relative to match uv. Zoom fills rescale texel
  // alongside their uv redefinition below (see zoomLocal).
  let texel = inputTexel;
  let aspect = inputDims.x / max(inputDims.y, 1.0);
  let pitch = u.pitch.x;
  let cellSize = u.cellSize.x;
  let gamma = u.gamma.x;
  let noisePhase = u.noisePhase.x;
  let twinkleIntensity = u.twinkleIntensity.x;
  let color1 = u.color1;
  let color2 = u.color2;
  let color3 = u.color3;
  // Work in pixel space
  let p = uv * dims;
  let gridCoord = floor(p / pitch);
  let cellCenter = (gridCoord + 0.5) * pitch;
  let localP = p - cellCenter;
  // Cell random threshold
  let threshold = hash21(gridCoord);
  // Left-to-right dissolve
  let normX = cellCenter.x / dims.x;
  let dissolve = pow(normX, gamma);
  // Skip cell if dissolve < threshold
  if (dissolve < threshold) {
    return vec4f(0.0);
  }
  // Value noise for twinkle
  let noiseVal = valueNoise(gridCoord * 0.7 + vec2f(noisePhase * 0.3, noisePhase * 0.17));
  // Opacity modulation
  let baseOpacity = clamp(dissolve - threshold, 0.0, 1.0) * 2.0;
  let opacity = clamp(baseOpacity * (1.0 - twinkleIntensity + twinkleIntensity * noiseVal), 0.0, 1.0);
  // Size modulation
  let sizeScale = 1.0 - twinkleIntensity * 0.2 + twinkleIntensity * 0.4 * noiseVal;
  let halfSize = cellSize * 0.5 * sizeScale;
  let cornerRadius = min(1.0, halfSize * 0.4);
  // Rounded box SDF
  let dist = roundedBoxSDF(localP, vec2f(halfSize), cornerRadius);
  if (dist > 0.5) {
    return vec4f(0.0);
  }
  let edge = 1.0 - smoothstep(-0.5, 0.5, dist);
  // Color ramp
  let sparkleThreshold = 0.85;
  var cellColor = mix(color1, color2, vec4f(normX));
  if (noiseVal > sparkleThreshold) {
    let sparkleT = (noiseVal - sparkleThreshold) / (1.0 - sparkleThreshold);
    cellColor = mix(cellColor, color3, vec4f(sparkleT));
  }
  // Straight alpha for fill
  return vec4f(cellColor.rgb, cellColor.a * opacity * edge);
}
`;
    frame.state.module = device.createShaderModule({ code: wgsl });
    frame.state.pipeline = null;
    frame.state.pipelineFormat = null;
    frame.state.quad = device.createBuffer({
        size: 6 * 4 * 4,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    });
    new Float32Array(frame.state.quad.getMappedRange()).set([
        -1, -1, 0, 1,
        1, -1, 1, 1,
        -1, 1, 0, 0,
        -1, 1, 0, 0,
        1, -1, 1, 1,
        1, 1, 1, 0,
    ]);
    frame.state.quad.unmap();
    frame.state.uniformBuf = device.createBuffer({
        size: 160,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
}
export function render(device, frame) {
    var params = frame.params || {};
    function finiteNumber(value, fallback) {
        var num = Number(value);
        return Number.isFinite(num) ? num : fallback;
    }
    function numberParam(name, fallback) {
        return finiteNumber(params[name], fallback);
    }
    function boolParam(name, fallback) {
        if (typeof params[name] === 'boolean')
            return params[name] ? 1 : 0;
        return fallback ? 1 : 0;
    }
    function selectParam(name, count, fallbackIndex) {
        // A select is a numeric dropdown: params[name] is the chosen option's index.
        var index = Math.round(Number(params[name]));
        return Number.isFinite(index) && index >= 0 && index < count ? index : fallbackIndex;
    }
    function colorParam(name, fallback) {
        var value = params[name] || {};
        return [
            finiteNumber(value.r, fallback[0]),
            finiteNumber(value.g, fallback[1]),
            finiteNumber(value.b, fallback[2]),
            finiteNumber(value.a, fallback[3]),
        ];
    }
    function pointParam(name, fallback) {
        var value = params[name] || {};
        return [
            finiteNumber(value.x, fallback[0]),
            finiteNumber(value.y, fallback[1]),
        ];
    }
    function pointRadiusParam(name, fallback) {
        var value = params[name] || {};
        return [
            finiteNumber(value.x, fallback[0]),
            finiteNumber(value.y, fallback[1]),
            finiteNumber(value.radius, fallback[2]),
        ];
    }
    function pointPointLineParam(name, fallback) {
        var value = params[name] || {};
        return [
            finiteNumber(value.x, fallback[0]),
            finiteNumber(value.y, fallback[1]),
            finiteNumber(value.x2, fallback[2]),
            finiteNumber(value.y2, fallback[3]),
        ];
    }
    function pointAngleRadiusParam(name, fallback) {
        var value = params[name] || {};
        return [
            finiteNumber(value.x, fallback[0]),
            finiteNumber(value.y, fallback[1]),
            finiteNumber(value.radius, fallback[2]),
            finiteNumber(value.angle, fallback[3]),
        ];
    }
    function colorPointParam(name, fallback) {
        var value = params[name] || {};
        var color = value.color || {};
        return [
            finiteNumber(value.x, fallback[0]),
            finiteNumber(value.y, fallback[1]),
            0,
            0,
            finiteNumber(color.r, fallback[2]),
            finiteNumber(color.g, fallback[3]),
            finiteNumber(color.b, fallback[4]),
            finiteNumber(color.a, fallback[5]),
        ];
    }
    function gradientParam(name, fallback) {
        var value = params[name] || {};
        var stops = Array.isArray(value.stops) && value.stops.length > 0 ? value.stops : fallback;
        // Layout: 8 stop colors (rgba), then 8 positions packed 4-per-vec4, then the live count.
        var out = new Array(44).fill(0);
        var count = Math.min(stops.length, 8);
        for (var i = 0; i < count; i++) {
            var stop = stops[i] || {};
            var color = stop.color || {};
            out[i * 4] = finiteNumber(color.r, 0);
            out[i * 4 + 1] = finiteNumber(color.g, 0);
            out[i * 4 + 2] = finiteNumber(color.b, 0);
            out[i * 4 + 3] = finiteNumber(color.a, 1);
            out[32 + i] = finiteNumber(stop.position, 0);
        }
        out[40] = count;
        return out;
    }
    var output = frame.output || {};
    var width = Math.max(1, finiteNumber(output.width, 1));
    var height = Math.max(1, finiteNumber(output.height, 1));
    var time = 0;
    var inputWidth = width;
    var inputHeight = height;
    device.queue.writeBuffer(frame.state.uniformBuf, 0, new Float32Array([
        time, width, height, 0,
        inputWidth, inputHeight, 0, 0,
        numberParam("pitch", 8), 0, 0, 0,
        numberParam("cellSize", 4), 0, 0, 0,
        numberParam("gamma", 1.7), 0, 0, 0,
        numberParam("noisePhase", 0), 0, 0, 0,
        numberParam("twinkleIntensity", 0.5), 0, 0, 0,
        ...colorParam("color1", [0.333, 0.267, 0.62, 1]),
        ...colorParam("color2", [0.624, 0.545, 1, 1]),
        ...colorParam("color3", [0.941, 0.929, 1, 1]),
    ]));
    var outputFormat = frame.output.format;
    if (frame.state.pipeline == null || frame.state.pipelineFormat !== outputFormat) {
        frame.state.pipeline = device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: frame.state.module,
                entryPoint: 'vs_main',
                buffers: [{
                        arrayStride: 16,
                        attributes: [
                            { shaderLocation: 0, format: 'float32x2', offset: 0 },
                            { shaderLocation: 1, format: 'float32x2', offset: 8 },
                        ],
                    }],
            },
            fragment: {
                module: frame.state.module,
                entryPoint: 'fs_main',
                targets: [{ format: outputFormat }],
            },
            primitive: { topology: 'triangle-list' },
        });
        frame.state.pipelineFormat = outputFormat;
    }
    var bindGroup = device.createBindGroup({
        layout: frame.state.pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: frame.state.uniformBuf } },
        ],
    });
    var encoder = device.createCommandEncoder();
    var pass = encoder.beginRenderPass({
        colorAttachments: [{
                view: frame.output.createView(),
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                storeOp: 'store',
            }],
    });
    pass.setPipeline(frame.state.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.setVertexBuffer(0, frame.state.quad);
    pass.draw(6);
    pass.end();
    device.queue.submit([encoder.finish()]);
}
defineProperties(Effect, {
    "pitch": {
        type: "number",
        label: "Pitch",
        defaultValue: 8,
        control: "slider",
        min: 4,
        max: 32,
        step: 1,
    },
    "cellSize": {
        type: "number",
        label: "Cell size",
        defaultValue: 4,
        control: "slider",
        min: 1,
        max: 16,
        step: 0.5,
    },
    "gamma": {
        type: "number",
        label: "Gamma",
        defaultValue: 1.7,
        control: "slider",
        min: 0.2,
        max: 5,
        step: 0.1,
    },
    "noisePhase": {
        type: "number",
        label: "Noise phase",
        defaultValue: 0,
        control: "slider",
        min: 0,
        max: 100,
        step: 0.1,
    },
    "twinkleIntensity": {
        type: "number",
        label: "Twinkle intensity",
        defaultValue: 0.5,
        control: "slider",
        min: 0,
        max: 1,
        step: 0.01,
    },
    "color1": {
        type: "color",
        label: "Color 1",
        defaultValue: { "r": 0.333, "g": 0.267, "b": 0.62, "a": 1 },
    },
    "color2": {
        type: "color",
        label: "Color 2",
        defaultValue: { "r": 0.624, "g": 0.545, "b": 1, "a": 1 },
    },
    "color3": {
        type: "color",
        label: "Color 3",
        defaultValue: { "r": 0.941, "g": 0.929, "b": 1, "a": 1 },
    },
});

export const manifest = {
  "version": 2,
  "name": "Dither field",
  "isAnimated": false,
  "usesMouse": false
}
