import assert from "node:assert/strict";
import test from "node:test";
import { createThemeStore, parseAppearance, themeStorageKey } from "./store.ts";
import { presetAppearance } from "./tokens.ts";
const memory = () => { const values = new Map<string,string>(); return { removeItem:(key:string)=>values.delete(key), getItem:(key:string)=>values.get(key) ?? null, setItem:(key:string,value:string)=>{values.set(key,value);} }; };
test("a template mode change keeps the preset, density, corners and accent across reloads", () => {
 const storage=memory(), first=createThemeStore(()=>storage);
 first.setTheme(presetAppearance("material")); first.patchTheme({dark:true});
 const second=createThemeStore(()=>storage);
 assert.deepEqual(second.getSnapshot().theme, presetAppearance("material",true));
});
test("legacy saved appearances normalize without losing radius or mode", () => {
 assert.deepEqual(parseAppearance(JSON.stringify({dark:true,radius:12,library:"phosphor"})), {...presetAppearance("oreo",true),radius:12});
});
test("blocked storage keeps the current session usable and retry clears the error", () => {
 const storage=memory();let blocked=true;
 const store=createThemeStore(()=>{if(blocked)throw Error("blocked");return storage;});
 store.getSnapshot();store.setTheme(presetAppearance("claude"));
 assert.equal(store.getSnapshot().theme.variation?.preset,"claude");assert.ok(store.getSnapshot().storageError);
 blocked=false;store.setTheme(store.getSnapshot().theme);assert.equal(store.getSnapshot().storageError,"");
 assert.deepEqual(parseAppearance(storage.getItem(themeStorageKey)),presetAppearance("claude"));
});
test("cross-tab refresh and clearing preferences notify subscribers without writing back", () => {
 const storage=memory(),store=createThemeStore(()=>storage);let notices=0;
 store.getSnapshot();const unsubscribe=store.subscribe(()=>notices++);
 storage.setItem(themeStorageKey,JSON.stringify(presetAppearance("openai",true)));store.refresh();
 assert.equal(store.getSnapshot().theme.radius,16);assert.equal(notices,1);
 storage.setItem(themeStorageKey,"null");store.refresh();assert.ok(store.getSnapshot().storageError);
 assert.equal(store.getSnapshot().theme.radius,16);
 storage.removeItem(themeStorageKey);store.refresh();assert.deepEqual(store.getSnapshot().theme,presetAppearance("oreo"));
 assert.equal(store.getSnapshot().storageError,"");unsubscribe();
});
test("invalid density, radius and color never replace the active preference", () => {
 const storage=memory(),store=createThemeStore(()=>storage);store.setTheme(presetAppearance("material"));
 for(const patch of [{radius:-1},{variation:{preset:"oreo",density:2,accent:null}},{variation:{preset:"oreo",density:1,accent:"red"}}])
 assert.throws(()=>store.setTheme({...presetAppearance("oreo"),...patch} as ReturnType<typeof presetAppearance>));
 assert.equal(store.getSnapshot().theme.variation?.preset,"material");
});
