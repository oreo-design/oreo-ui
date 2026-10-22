/// <reference types="@webgpu/types" />
import * as React from "react";
import { setup, render } from "./shaders/dither-field";

// The original Figma fill module is kept verbatim. The connector does not expose
// file://shader-runtime-index.json/, so this small host supplies its frame API.
// Render in CSS pixels: the authored pitch is 4px, independent of device DPR.
export function DitherFill() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = React.useState("loading");
  React.useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    async function start() {
      const adapter = await navigator.gpu?.requestAdapter();
      if (!adapter || cancelled) {
        if (!cancelled) setStatus("unavailable");
        return;
      }
      const device = await adapter.requestDevice();
      if (cancelled) {
        device.destroy();
        return;
      }
      const canvas = canvasRef.current!;
      const context = canvas.getContext("webgpu")!;
      const format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: "premultiplied" });
      const state: Record<string, GPUBuffer | unknown> = {};
      const params = {
        pitch: 4,
        cellSize: 1.5,
        gamma: 1,
        noisePhase: 100,
        twinkleIntensity: 0,
        color1: {
          r: 0.21220053732395172,
          g: 0.10593856871128082,
          b: 0.6742788553237915,
          a: 1,
        },
        color2: { r: 0.6240000128746033, g: 0.5450000166893005, b: 1, a: 1 },
        color3: { r: 0.9409999847412109, g: 0.9290000200271606, b: 1, a: 1 },
      };
      setup(device, { state });
      // Figma fills output straight alpha. Convert to the canvas's premultiplied
      // presentation format without changing the authored shader or its colors.
      const module = device.createShaderModule({
        code: `
        @group(0) @binding(0) var source: texture_2d<f32>;
        @vertex fn vs(@builtin(vertex_index) i:u32)->@builtin(position) vec4f {
          var p=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));return vec4f(p[i],0,1);
        }
        @fragment fn fs(@builtin(position) p:vec4f)->@location(0) vec4f {
          let c=textureLoad(source,vec2i(p.xy),0);return vec4f(c.rgb*c.a,c.a);
        }`,
      });
      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module, entryPoint: "vs" },
        fragment: { module, entryPoint: "fs", targets: [{ format }] },
      });
      let texture: GPUTexture | undefined;
      const draw = () => {
        canvas.width = Math.max(1, Math.round(canvas.clientWidth));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight));
        texture?.destroy();
        texture = device.createTexture({
          size: [canvas.width, canvas.height],
          format: "rgba8unorm",
          usage:
            GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        });
        render(device, { state, params, output: texture });
        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              loadOp: "clear",
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
              storeOp: "store",
            },
          ],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(
          0,
          device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [{ binding: 0, resource: texture.createView() }],
          }),
        );
        pass.draw(3);
        pass.end();
        device.queue.submit([encoder.finish()]);
        setStatus("ready");
      };
      const observer = new ResizeObserver(draw);
      observer.observe(canvas);
      draw();
      cleanup = () => {
        observer.disconnect();
        texture?.destroy();
        (state.quad as GPUBuffer).destroy();
        (state.uniformBuf as GPUBuffer).destroy();
        context.unconfigure();
        device.destroy();
      };
      void device.lost.then(() => {
        if (!cancelled) setStatus("unavailable");
      });
    }
    void start().catch(() => {
      if (!cancelled) setStatus("unavailable");
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-shader-status={status}
      className="composer-dither"
    />
  );
}
