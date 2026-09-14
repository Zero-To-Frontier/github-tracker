import assert from "node:assert/strict";
import test from "node:test";
import { ecosystemCategories, ecosystemEdges, ecosystemNodes, getConnections } from "../lib/ecosystem";

function assertHttps(value: string, context: string) {
  const url = new URL(value);
  assert.equal(url.protocol, "https:", `${context}: only HTTPS source links are supported`);
  assert.equal(url.username, "", `${context}: links must not contain credentials`);
  assert.equal(url.password, "", `${context}: links must not contain credentials`);
}

function assertDate(value: string, context: string) {
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/, `${context}: a verification date is required`);
  assert.equal(new Date(value).toISOString().slice(0, 10), value, `${context}: invalid date`);
}

test("the ecosystem has unique nodes and twelve populated, ordered categories", () => {
  assert.deepEqual(ecosystemCategories.map((item) => item.id), ["models", "coding", "agents", "orchestration", "tools", "memory", "data", "infrastructure", "open-models", "training", "evaluation", "deployment"]);
  assert.equal(new Set(ecosystemNodes.map((item) => item.id)).size, ecosystemNodes.length);
  const categories = new Set(ecosystemCategories.map((item) => item.id));
  for (const node of ecosystemNodes) assert.ok(categories.has(node.category), `${node.id}: unknown category`);
  for (const category of ecosystemCategories) {
    assert.ok(ecosystemNodes.some((node) => node.category === category.id), `${category.id}: empty category`);
  }
});

test("every ecosystem detail has substantive fields, official links, licensing and dated sources", () => {
  for (const node of ecosystemNodes) {
    for (const field of ["id", "name", "mark", "mapLabel", "tagline", "description", "problem", "role", "license"] as const) {
      assert.ok(node[field].trim(), `${node.id}: missing ${field}`);
    }
    assert.ok([...node.mapLabel].length <= 18, `${node.id}: keep the map role label readable within 18 characters`);
    assert.ok(node.useCases.length && node.useCases.every((item) => item.trim()), `${node.id}: missing use cases`);
    assert.ok(node.features.length && node.features.every((item) => item.trim()), `${node.id}: missing features`);
    assert.ok(node.sources.length, `${node.id}: source evidence is required`);
    assertDate(node.verifiedAt, node.id);
    assertHttps(node.website, `${node.id} website`);
    assertHttps(node.docs, `${node.id} docs`);
    if (node.github) {
      assertHttps(node.github, `${node.id} GitHub`);
      assert.equal(new URL(node.github).hostname, "github.com");
    }
    if (node.openness === "open-source" || node.openness === "source-available") {
      assert.ok(node.github, `${node.id}: publicly accessible source repository is required`);
      assert.ok(node.licenseUrl, `${node.id}: verify the stated code license`);
    }
    if (node.openness === "open-weight") {
      assert.ok(node.licenseUrl, `${node.id}: verify the model weights' license separately from any linked code`);
    }
    if (node.licenseUrl) assertHttps(node.licenseUrl, `${node.id} license`);
    for (const source of node.sources) {
      assert.ok(source.title.trim(), `${node.id}: unnamed source`);
      assertHttps(source.url, `${node.id} source`);
    }
  }
});

test("technical relations have valid endpoints, unique direction and meaning, and their own evidence", () => {
  assert.ok(ecosystemEdges.length, "technical relations are required");
  assert.equal(new Set(ecosystemEdges.map((edge) => edge.id)).size, ecosystemEdges.length, "duplicate edge IDs");
  assert.equal(new Set(ecosystemEdges.map((edge) => JSON.stringify([edge.from, edge.to, edge.label]))).size, ecosystemEdges.length, "duplicate relation");
  const ids = new Set(ecosystemNodes.map((node) => node.id));
  for (const edge of ecosystemEdges) {
    assert.ok(ids.has(edge.from), `${edge.id}: missing source node ${edge.from}`);
    assert.ok(ids.has(edge.to), `${edge.id}: missing target node ${edge.to}`);
    assert.notEqual(edge.from, edge.to, `${edge.id}: self-relation`);
    assert.ok(edge.label.trim() && edge.description.trim(), `${edge.id}: relation meaning is required`);
    assert.ok(edge.source.title.trim(), `${edge.id}: unnamed source`);
    assertHttps(edge.source.url, `${edge.id} source`);
    assertDate(edge.verifiedAt, edge.id);
  }
});

test("Hermes and OpenCode resolve to the verified canonical projects", () => {
  const hermes = ecosystemNodes.find((node) => node.id === "hermes");
  const opencode = ecosystemNodes.find((node) => node.id === "opencode");
  assert.ok(hermes);
  assert.ok(opencode);
  assert.equal(hermes.github, "https://github.com/NousResearch/hermes-agent");
  assert.equal(hermes.category, "agents");
  assert.equal(opencode.github, "https://github.com/anomalyco/opencode");
  assert.equal(opencode.category, "coding");
  assert.equal(ecosystemNodes.filter((node) => node.github === hermes.github).length, 1);
  assert.equal(ecosystemNodes.filter((node) => node.github === opencode.github).length, 1);
});

test("a relation is traversable from either endpoint with the correct arrow direction", () => {
  for (const edge of ecosystemEdges) {
    const outgoing = getConnections(edge.from).find((connection) => connection.edge.id === edge.id);
    const incoming = getConnections(edge.to).find((connection) => connection.edge.id === edge.id);
    assert.equal(outgoing?.node.id, edge.to, `${edge.id}: outgoing target`);
    assert.equal(outgoing?.direction, "outgoing", `${edge.id}: outgoing direction`);
    assert.equal(incoming?.node.id, edge.from, `${edge.id}: incoming source`);
    assert.equal(incoming?.direction, "incoming", `${edge.id}: incoming direction`);
  }
  assert.deepEqual(getConnections("unknown-project"), []);
});
