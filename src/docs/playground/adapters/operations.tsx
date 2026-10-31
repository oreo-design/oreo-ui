/** Family-owned preview adapters and local export bindings. */
import { OperationsMap, OperationsFeed, HealthMeters, RouteTimeline, PipelineFile, CameraCheckpoint } from "@/components/operations";
import { VEHICLES, vehicleEvent, vehiclePoint, vehicleStops, HEALTH, MODULES } from "@/patterns/operations-suite/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"operations-map": {...define("Operations Map",{empty:toggle(false),selected:select(["TRK-04","TRK-03","TRK-05","TRK-06","TRK-07"],"TRK-04")},(v,set)=><div className="w-full max-w-2xl p-4"><OperationsMap points={v.empty?[]:VEHICLES.map(vehiclePoint)} selectedId={v.selected} onSelect={id=>set("selected",id as typeof v.selected)}/></div>),source:"operations"},
"operations-feed": {...define("Operations Feed",{empty:toggle(false)},v=><div className="w-full max-w-md p-4"><OperationsFeed items={v.empty?[]:VEHICLES.map(vehicleEvent)}/></div>),source:"operations"},
"health-meters": {...define("Health Meters",{schema:number(100,0,100,1)},v=><div className="w-full max-w-md p-6"><HealthMeters readings={HEALTH.map(r=>r.label==="Schema match"?{...r,value:v.schema,status:v.schema===100?"All fields match":"Review schema",tone:v.schema===100?"success":"warning"}:r)}/></div>),source:"operations"},
"route-timeline": {...define("Route Timeline",{vehicle:select(["TRK-04","TRK-06","TRK-07"],"TRK-04")},v=><div className="w-full max-w-md p-6"><RouteTimeline stops={vehicleStops(VEHICLES.find(x=>x.id===v.vehicle)!)}/></div>),source:"operations"},
"pipeline-file": {...define("Pipeline File",{name:text("feature_pipeline.py"),source:text(MODULES[1].source,true)},v=><div className="w-full max-w-3xl p-4"><PipelineFile name={v.name} source={v.source}/></div>),source:"operations"},
"camera-checkpoint": {...define("Camera Checkpoint",{label:text("North Avenue"),selected:toggle(false)},(v,set)=><div className="w-full max-w-xs p-6"><CameraCheckpoint label={v.label} selected={v.selected} onSelect={()=>set("selected",!v.selected)}/></div>),source:"operations"}
};
const exports = {
"operations": { OperationsMap, OperationsFeed, HealthMeters, RouteTimeline, PipelineFile, CameraCheckpoint }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "operations"; spec.exports = exports; }
export default playgrounds;
