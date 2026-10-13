import { useLayoutEffect, useState } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import type { DocsNav } from "@/docs/DocsPage";
import { SettingsShell, DEFAULT_SETTINGS_APPEARANCE, type SettingsAppearance, type SettingsCardStyle, type SettingsScheme } from "@/patterns/settings";
import { INITIAL_STATE, Preferences, Workspace, Integrations, type Recipe } from "./recipes";
import "./lab.css";
import { ExportRecipe } from "./ExportRecipe";

const cases = [
  { id: "preferences", number: "01", label: "内容替换", title: "Notifications", icon: "bell" },
  { id: "workspace", number: "02", label: "结构组合", title: "Workspace", icon: "folder" },
  { id: "integrations", number: "03", label: "边界扩展", title: "Integrations", icon: "plug" },
  { id: "export", number: "04", label: "迁移验证", title: "Your data", icon: "folder" },
] as const;
const recipes = { preferences: Preferences, workspace: Workspace, integrations: Integrations, export: ExportRecipe };

export function SettingsLab({ nav }: { nav: DocsNav }) {
  const params = new URLSearchParams(window.location.search);
  const [recipe, setRecipe] = useState<Recipe>((cases.some(c => c.id === params.get("case")) ? params.get("case") : "integrations") as Recipe);
  const [inherited, setInherited] = useState(params.get("mode") !== "original");
  const [stress, setStress] = useState(params.has("stress"));
  const [narrow, setNarrow] = useState(params.has("narrow"));
  const [dark, setDark] = useState(params.has("dark"));
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.classList.contains("theme-dark");
    root.classList.toggle("theme-dark", dark);
    return () => { root.classList.toggle("theme-dark", previous); };
  }, [dark]);
  const [fail, setFail] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [appearance, setAppearance] = useState<SettingsAppearance>(DEFAULT_SETTINGS_APPEARANCE);
  const [state, setState] = useState(INITIAL_STATE);
  const [resetKey, setResetKey] = useState(0);
  const RecipePage = recipes[recipe];
  const current = cases.find(c => c.id === recipe)!;
  return <div className={`settings-lab ${dark ? "theme-dark" : ""}`}>
    <header className="lab-header">
      <a href="/settings" className="lab-brand" onClick={e => { e.preventDefault(); nav.onNavigate("settings"); }}><OreoLogo className="h-4 w-auto" /><span>Oreo UI</span><span className="text-text-placeholder font-normal">/</span><span className="font-normal text-text-secondary">Pattern lab</span></a>
      <Button type="tertiary" size="sm" aria-label={dark ? "Light theme" : "Dark theme"} onClick={() => setDark(v => !v)} leadingIcon={<Icon size="sm" name={dark ? "sun" : "moon"} />}>{dark ? "Light" : "Dark"}</Button>
    </header>
    <div className="lab-content">
      <div className="lab-intro">
        <div><p className="lab-eyebrow">EXPERIMENT 001 · SETTINGS</p><h1>让打磨，留在每次变化里。</h1><p className="lab-subtitle">同一个 Settings 蓝本，三种变化，一次迁移验证。亲手试一试，哪些细节可以继承，哪些需要重新判断。</p></div>
        <button className="lab-notes-toggle" aria-expanded={showNotes} onClick={() => setShowNotes(v => !v)}>实验说明 <Icon name={showNotes ? "chevron-down" : "arrow-out"} size="sm" /></button>
      </div>
      <div className="lab-case-tabs" role="group" aria-label="实验场景">
        {cases.map(c => <button key={c.id} aria-pressed={recipe === c.id} onClick={() => setRecipe(c.id)}><span className="tab-number">{c.number}</span>{c.label}<span className="tab-english">{c.title}</span></button>)}
      </div>
      <section className="lab-workbench" aria-label="Settings experiment">
        <div className="lab-toolbar">
          <div className="lab-mode" role="group" aria-label="实现方式"><button aria-pressed={!inherited} onClick={() => setInherited(false)}>现有接口</button><button aria-pressed={inherited} onClick={() => setInherited(true)}>继承式扩展</button></div>
          <div className="lab-tools">
            <button aria-pressed={stress} onClick={() => setStress(v => !v)}>长文案</button>
            <button aria-pressed={narrow} onClick={() => setNarrow(v => !v)}>窄容器</button>
            <button aria-label="Reset experiment" onClick={() => { setState(INITIAL_STATE); setResetKey(v => v + 1); setFail(false); }}><Icon name="reset" size="sm" /></button>
          </div>
        </div>
        <div className={`lab-stage ${narrow ? "is-narrow" : ""}`}>
          <div className="lab-product" data-testid="product">
            <SettingsShell adaptiveContent={inherited} appearance={appearance} groups={[{ title: "Personal", items: [{ id: "preferences", label: "Notifications", icon: "bell" }] }, { title: "Workspace", items: [{ id: "workspace", label: "General", icon: "folder" }, { id: "integrations", label: "Integrations", icon: "plug" }, { id: "export", label: "Your data", icon: "folder" }] }]} active={recipe} onNavigate={id => setRecipe(id as Recipe)} contentKey={recipe}>
              <RecipePage key={`${recipe}-${resetKey}`} inherited={inherited} stress={stress} fail={fail} state={state} setState={setState} />
            </SettingsShell>
          </div>
        </div>
        <div className="lab-bottom-bar">
          <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-status-success" />本地交互演示 · 不连接真实服务</span>
          <span>{inherited ? "原版组件 + 定向扩展" : "相同需求 · 仅用现有接口组合"}</span>
        </div>
      </section>
      <div className="lab-context">
        <div className="lab-observation"><span className="lab-eyebrow">{current.number} / 观察重点</span><p>{recipe === "preferences" ? "换了语言、描述和选项长度，标题、控件和分隔线还站得住吗？" : recipe === "workspace" ? "编辑器、保存操作和设置行重新组合，页面的节奏还能一致吗？" : recipe === "export" ? "不增加底层接口，同一套结构能否承载另一种异步流程？" : "新的连接状态与操作，能否保留 Oreo 的质感，并在窄容器里自然展开？"}</p><span className="text-[12px] text-text-tertiary">{recipe === "integrations" ? "试试 Calendar 的重连、GitHub 的管理与断开，再切换长文案和窄容器。" : recipe === "export" ? "导出一个 JSON 或 CSV 示例，或模拟准备失败后重试。" : "切换两种实现方式，内容与已修改的设置会保留。"}</span></div>
        <div className="lab-options">
          <label>背景层级<select aria-label="Background hierarchy" value={appearance.scheme} onChange={e => setAppearance(s => ({ ...s, scheme: e.target.value as SettingsScheme }))}><option value="sunken-nav">Sunken nav</option><option value="sunken-content">Sunken content</option><option value="card-panel">Card panel</option><option value="drawer">Drawer</option></select></label>
          <label>卡片样式<select aria-label="Card style" value={appearance.card} onChange={e => setAppearance(s => ({ ...s, card: e.target.value as SettingsCardStyle }))}><option value="outline">Outline</option><option value="surface">Surface</option><option value="divider">Divider</option></select></label>
          <label className="lab-check"><input type="checkbox" checked={appearance.navIcons} onChange={e => setAppearance(s => ({ ...s, navIcons: e.target.checked }))} />导航图标</label>
          <label className="lab-check"><input type="checkbox" checked={fail} onChange={e => setFail(e.target.checked)} />模拟连接失败</label>
        </div>
      </div>
      {showNotes && <section className="lab-notes">
        <h2>保存结果，也保存变化的边界。</h2>
        <div className="lab-note-grid"><div><h3>01 · 继承实现</h3><p>直接使用原版按钮、开关、菜单、标题和卡片。设置行的文字与分隔线来自同一份实现。</p></div><div><h3>02 · 开放组合</h3><p>内容、顺序和控件由产品决定。媒体、操作和详情通过明确插槽进入，布局关系由扩展行负责。</p></div><div><h3>03 · 审阅变化</h3><p>新增窄容器换行与连接交互单独检查。原版页面做回归比较，不能用「源码没改」代替结果检查。</p></div></div>
        <p className="lab-method-note">这里比较的是同一作者写的两种实现，不是独立模型的 A/B 生成实验。可重复检查证明的是这些场景的表现；设计品质与跨模型稳定性仍需要分别判断。</p>
      </section>}
      <footer className="lab-footer"><span>OREO UI / DESIGN LANGUAGE STUDIES</span><a href="/settings">查看原版 Settings ↗</a></footer>
    </div>
  </div>;
}
