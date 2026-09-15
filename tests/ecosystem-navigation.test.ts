import assert from "node:assert/strict";
import test from "node:test";
import { enterMapScene, returnToMapScene, type MapFrame } from "../lib/ecosystem-navigation";

const overview: MapFrame = {
  sceneId: null,
  selectedId: "mcp",
  scrollY: 420,
  focusId: "mcp",
  query: "protocol",
  panelScrollTop: 180,
};

const mcp: MapFrame = {
  sceneId: "mcp",
  selectedId: "mcp-inspector",
  scrollY: 120,
  focusId: "mcp-inspector",
  query: "inspect",
  panelScrollTop: 64,
};

test("two levels of exploration return through the complete saved views", () => {
  const first = enterMapScene([], overview, "mcp");
  assert.deepEqual(first.history, [overview]);
  assert.deepEqual(first.frame, {
    sceneId: "mcp",
    selectedId: null,
    scrollY: 0,
    focusId: null,
    query: "",
    panelScrollTop: 0,
  });
  assert.equal(first.returning, false);

  const second = enterMapScene(first.history, mcp, "mcp-inspector");
  assert.deepEqual(second.history, [overview, mcp]);
  assert.equal(second.frame.sceneId, "mcp-inspector");

  const backToMcp = returnToMapScene(second.history, second.frame);
  assert.deepEqual(backToMcp.frame, mcp);
  assert.deepEqual(backToMcp.history, [overview]);
  assert.equal(backToMcp.returning, true);

  const backToOverview = returnToMapScene(backToMcp.history, backToMcp.frame);
  assert.deepEqual(backToOverview.frame, overview);
  assert.deepEqual(backToOverview.history, []);
  assert.equal(backToOverview.returning, true);
});

test("the overview breadcrumb restores the overview directly from a deeper scene", () => {
  const current = { ...mcp, sceneId: "mcp-inspector" };
  const result = returnToMapScene([overview, mcp], current, 0);
  assert.deepEqual(result.frame, overview);
  assert.deepEqual(result.history, []);
  assert.equal(result.returning, true);
});

test("repeated links to an ancestor unwind history without accumulating duplicate scenes", () => {
  let history = [overview];
  let current = mcp;

  for (let repetition = 0; repetition < 4; repetition += 1) {
    const deeper = enterMapScene(history, current, "mcp-inspector");
    const ancestor = enterMapScene(deeper.history, deeper.frame, "mcp");
    assert.deepEqual(ancestor.frame, mcp);
    assert.deepEqual(ancestor.history, [overview]);
    assert.equal(ancestor.returning, true);
    history = ancestor.history;
    current = ancestor.frame;
  }

  const revisited = enterMapScene(history, current, "mcp-inspector");
  assert.deepEqual(revisited.history, [overview, mcp]);
  assert.equal(revisited.returning, false);
});

test("same-scene entries and invalid returns leave the current view and history intact", () => {
  const history = [overview];
  const sameScene = enterMapScene(history, mcp, "mcp");
  assert.equal(sameScene.history, history);
  assert.equal(sameScene.frame, mcp);
  assert.equal(sameScene.returning, false);

  for (const index of [-1, 1, 0.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    const result = returnToMapScene(history, mcp, index);
    assert.equal(result.history, history);
    assert.equal(result.frame, mcp);
    assert.equal(result.returning, false);
  }

  const empty: MapFrame[] = [];
  for (const result of [returnToMapScene(empty, overview), returnToMapScene(empty, overview, 0)]) {
    assert.equal(result.history, empty);
    assert.equal(result.frame, overview);
    assert.equal(result.returning, false);
  }
});

test("navigation does not mutate source history or saved frames", () => {
  const root = Object.freeze({ ...overview });
  const parent = Object.freeze({ ...mcp });
  const history: MapFrame[] = [root, parent];
  Object.freeze(history);
  const current = Object.freeze({ ...mcp, sceneId: "mcp-inspector" });

  enterMapScene(history, current, "mcp-sdk");
  enterMapScene(history, current, "mcp");
  returnToMapScene(history, current);
  returnToMapScene(history, current, 0);

  assert.deepEqual(history, [overview, mcp]);
  assert.deepEqual(current, { ...mcp, sceneId: "mcp-inspector" });
});
