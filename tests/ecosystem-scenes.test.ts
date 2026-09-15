import assert from "node:assert/strict";
import test from "node:test";
import { nodes as drilldownNodes, edges as drilldownEdges } from "../data/ecosystem-drilldown";
import { ecosystemEdges, ecosystemNodes } from "../lib/ecosystem";
import { allEcosystemEdges, allEcosystemNodes, ecosystemScenes, overviewEntrances, type EcosystemScene } from "../lib/ecosystem-scenes";

const nodeIds = new Set(allEcosystemNodes.map((node) => node.id));
const edgeById = new Map(allEcosystemEdges.map((edge) => [edge.id, edge]));
const sceneById = new Map(ecosystemScenes.map((scene) => [scene.id, scene]));
const visibleIds = (scene: EcosystemScene) => [scene.centerId, ...scene.groups.flatMap((group) => group.nodeIds)];

test("scene content extends the catalog without changing overview identities or duplicating projects", () => {
  assert.equal(nodeIds.size, allEcosystemNodes.length);
  assert.equal(edgeById.size, allEcosystemEdges.length);
  assert.equal(new Set(allEcosystemEdges.map((edge) => JSON.stringify([edge.from, edge.to, edge.label]))).size, allEcosystemEdges.length);
  assert.equal(allEcosystemNodes.length, ecosystemNodes.length + drilldownNodes.length);
  assert.equal(allEcosystemEdges.length, ecosystemEdges.length + drilldownEdges.length);
  for (const node of ecosystemNodes) assert.equal(allEcosystemNodes.find((item) => item.id === node.id), node);
  for (const edge of ecosystemEdges) assert.equal(edgeById.get(edge.id), edge);
  const repositories = allEcosystemNodes.flatMap((node) => node.github ? [node.github] : []);
  assert.equal(new Set(repositories).size, repositories.length, "reuse canonical project nodes instead of cloning them");
  assert.ok(drilldownNodes.every((node) => !ecosystemNodes.some((overview) => overview.id === node.id)));
});

test("every scene has readable groups and explicit in-scene relationship endpoints", () => {
  assert.equal(sceneById.size, ecosystemScenes.length);
  for (const scene of ecosystemScenes) {
    const ids = visibleIds(scene);
    assert.equal(new Set(ids).size, ids.length, `${scene.id}: center or group node duplicated`);
    assert.ok(scene.groups.length > 0 && scene.groups.length <= 4);
    assert.equal(new Set(scene.groups.map((group) => group.id)).size, scene.groups.length);
    assert.match(scene.color, /^#[0-9a-f]{6}$/i);
    for (const field of [scene.title, scene.subtitle, scene.description]) assert.ok(field.trim());
    for (const group of scene.groups) {
      assert.ok(group.title.trim() && group.description.trim());
      assert.ok(group.nodeIds.length >= 2 && group.nodeIds.length <= 3, `${scene.id}/${group.id}: keep groups legible`);
    }
    for (const id of ids) assert.ok(nodeIds.has(id), `${scene.id}: unknown node ${id}`);
    assert.equal(new Set(scene.edgeIds).size, scene.edgeIds.length);
    for (const id of scene.edgeIds) {
      const edge = edgeById.get(id);
      assert.ok(edge, `${scene.id}: unknown edge ${id}`);
      assert.ok(ids.includes(edge.from) && ids.includes(edge.to), `${scene.id}: ${id} has an invisible endpoint`);
    }
    for (const id of ids) {
      assert.ok(scene.edgeIds.some((edgeId) => {
        const edge = edgeById.get(edgeId)!;
        return edge.from === id || edge.to === id;
      }), `${scene.id}: ${id} has no documented relation`);
    }
  }
});

test("every entrance has the selected node as its destination center and reveals new content", () => {
  const inspectEntrances = (entrances: Record<string, string>, currentIds: string[]) => {
    for (const [nodeId, sceneId] of Object.entries(entrances)) {
      assert.ok(currentIds.includes(nodeId), `${sceneId}: entrance is not visible`);
      const destination = sceneById.get(sceneId);
      assert.ok(destination, `${nodeId}: missing destination ${sceneId}`);
      assert.equal(destination.centerId, nodeId);
      assert.ok(visibleIds(destination).some((id) => !currentIds.includes(id)), `${sceneId}: must reveal new elements`);
    }
  };
  inspectEntrances(overviewEntrances, ecosystemNodes.map((node) => node.id));
  for (const scene of ecosystemScenes) inspectEntrances(scene.entrances, visibleIds(scene));
  const first = sceneById.get(overviewEntrances.mcp)!;
  const second = sceneById.get(first.entrances["mcp-typescript-sdk"])!;
  assert.ok(second, "overview → MCP → SDK must be reachable");
  assert.ok(visibleIds(second).includes("zod"), "the second level reveals an actual new library");
  assert.ok(!visibleIds(first).includes("zod"));
  for (const sharedId of ["mcp", "mcp-typescript-sdk", "mcp-inspector", "mcp-stdio", "mcp-streamable-http"]) {
    assert.ok(visibleIds(first).includes(sharedId) && visibleIds(second).includes(sharedId), `${sharedId}: shared node is reused`);
  }
  const reachable = new Set<string>();
  const visit = (id: string, path: string[]) => {
    assert.ok(!path.includes(id), `scene entrance cycle: ${[...path, id].join(" → ")}`);
    reachable.add(id);
    for (const nextId of Object.values(sceneById.get(id)!.entrances)) visit(nextId, [...path, id]);
  };
  for (const id of Object.values(overviewEntrances)) visit(id, []);
  assert.equal(reachable.size, ecosystemScenes.length, "every scene is reachable from the overview");
});

test("new nodes and relationships carry substantive explanations and dated official evidence", () => {
  const https = (value: string) => {
    const url = new URL(value);
    assert.equal(url.protocol, "https:");
    assert.equal(url.username + url.password, "");
  };
  const date = (value: string) => {
    assert.match(value, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Date(value).toISOString().slice(0, 10), value);
  };
  for (const node of drilldownNodes) {
    for (const field of ["id", "name", "mark", "mapLabel", "tagline", "description", "problem", "role", "license"] as const) assert.ok(node[field].trim(), `${node.id}: missing ${field}`);
    assert.ok([...node.mapLabel].length <= 18, `${node.id}: role label is too long`);
    assert.ok(node.useCases.length && node.useCases.every((value) => value.trim()));
    assert.ok(node.features.length && node.features.every((value) => value.trim()));
    https(node.website);
    https(node.docs);
    date(node.verifiedAt);
    assert.ok(node.sources.length);
    for (const item of node.sources) {
      assert.ok(item.title.trim());
      https(item.url);
    }
    if (node.openness === "open-source") {
      assert.ok(node.github && node.licenseUrl);
      https(node.github);
      https(node.licenseUrl);
    } else if (node.openness === "open-standard") {
      assert.equal(node.github, undefined, `${node.id}: concepts must not impersonate source projects`);
      assert.match(node.license, /규약의 개념/);
    }
  }
  for (const edge of drilldownEdges) {
    assert.ok(nodeIds.has(edge.from) && nodeIds.has(edge.to), edge.id);
    assert.notEqual(edge.from, edge.to);
    assert.ok(edge.label.trim() && edge.description.trim() && edge.source.title.trim());
    https(edge.source.url);
    date(edge.verifiedAt);
  }
});
