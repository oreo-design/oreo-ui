import assert from "node:assert/strict";

/** Run with the existing Playwriter session, passing its task-owned page:
 * const { checkRouteState } = await import(".../scripts/playground/check-route-state.mjs");
 * await checkRouteState({ page: state.page, baseURL: "http://localhost:5192" });
 * No browser is launched; these are the real app routes and controls.
 */
export async function checkRouteState({ page, baseURL, observe = async () => {} }) {
  const frame = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const control = () => page.getByRole("switch", { name: "Stretch motion", exact: true });
  await page.goto(new URL("/switch?view=docs", baseURL).href, { waitUntil: "domcontentloaded" });
  await control().waitFor();
  await observe("documentation loaded");
  if (!await control().isChecked()) await control().click();
  await observe("example switched on");
  const initialId = await control().getAttribute("id");
  assert.ok(initialId, "The real example exposes a stable form identity");
  for (const heading of ["Overview", "States"]) {
    await page.getByRole("link", { name: heading, exact: true }).click();
    await frame();
    await observe(`anchor ${heading}`);
    assert.equal(await control().isChecked(), true, `${heading} anchor must preserve the edited example`);
    assert.equal(await control().getAttribute("id"), initialId, `${heading} anchor must not remount the example`);
  }
  await page.goBack();
  await frame();
  await observe("back to previous anchor");
  assert.equal(await control().isChecked(), true, "Back between anchors must preserve example state");
  assert.equal(await control().getAttribute("id"), initialId);

  const configURL = checked => {
    const url = new URL("/switch", baseURL);
    url.searchParams.set("config", JSON.stringify({ version: 1, component: "switch", values: { checked } }));
    return url.href;
  };
  await page.goto(configURL(true), { waitUntil: "domcontentloaded" });
  await control().waitFor();
  await observe("true URL configuration loaded");
  assert.equal(await control().isChecked(), true);
  // Prepare a second same-route history entry without a document reload.
  // Native Back/Forward events below exercise the app's popstate restoration.
  await page.evaluate(url => history.pushState(null, "", url), configURL(false));
  await page.goBack();
  await frame();
  await observe("back to true configuration");
  assert.equal(await control().isChecked(), true);
  await page.goForward();
  await frame();
  await observe("forward to false configuration");
  assert.equal(await control().isChecked(), false, "A changed query must restore its different configuration");
  await page.goBack();
  await frame();
  await observe("back restores true configuration");
  assert.equal(await control().isChecked(), true);
  return { anchorsPreserveStateAndIdentity: true, hashHistoryPreservesState: true, queryHistoryRestoresConfiguration: true };
}

/** Exercise the picker destination contract through real links and routing. */
export async function checkPickerDestinations({ page, baseURL, observe = async () => {} }) {
  const cases = [
    { query: "table", filter: "docs", label: /^Workflow Table /, hint: "Composition · Documentation", href: "/workflow-table?view=docs" },
    { query: "prompt", filter: "remixes", label: /^Prompt Box /, hint: "Remix examples", href: "/prompt-box?view=remixes" },
  ];
  for (const scenario of cases) {
    await page.goto(new URL("/button", baseURL).href, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Choose component, current Button", exact: true }).click();
    await observe(`${scenario.filter}: picker opened`);
    const input = page.getByRole("searchbox", { name: "Find a component", exact: true });
    await input.click();
    await input.fill(scenario.query);
    await observe(`${scenario.filter}: search entered`);
    await page.getByRole("combobox", { name: "Page type", exact: true }).selectOption(scenario.filter);
    await observe(`${scenario.filter}: filtered`);
    const link = page.getByRole("dialog").getByRole("link", { name: scenario.label });
    assert.equal(await link.getAttribute("href"), scenario.href, "Native links must target the selected capability");
    assert.ok((await link.textContent()).includes(scenario.hint), "The result must advertise its actual destination");
    // Modifier clicks intentionally retain the native anchor destination;
    // normal navigation below must resolve to this exact same URL.
    await link.click();
    await page.waitForURL(new URL(scenario.href, baseURL).href, { waitUntil: "domcontentloaded" });
    if (scenario.filter === "docs") await page.getByRole("link", { name: "Overview", exact: true }).waitFor();
    else await page.getByRole("navigation", { name: "Remix components", exact: true }).waitFor();
    assert.equal(new URL(page.url()).pathname + new URL(page.url()).search, scenario.href);
    await observe(`${scenario.filter}: normal click loaded correct view`);
  }
  return { filteredHintsMatchDestination: true, normalClicksOpenSelectedView: true, nativeHrefMatchesNormalNavigation: true };
}
