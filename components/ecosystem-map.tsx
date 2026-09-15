"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Box, Braces, Check, ChevronRight, CircleHelp, Compass, Database, ExternalLink, GitBranch, Github, Globe, Layers3, Map as MapIcon, MemoryStick, Network, RotateCcw, Search, Server, Sparkles, Terminal, Workflow, X } from "lucide-react";
import { ecosystemCategories, ecosystemEdges, ecosystemNodes, getConnections } from "@/lib/ecosystem";
import type { EcosystemEdge, EcosystemNode } from "@/lib/ecosystem-types";
import styles from "./ecosystem-map.module.css";
import { EcosystemSceneView } from "./ecosystem-scene";
import { ecosystemScenes, allEcosystemNodes, allEcosystemEdges, overviewEntrances } from "@/lib/ecosystem-scenes";
import { enterMapScene, returnToMapScene, type MapFrame, type MapNavigation } from "@/lib/ecosystem-navigation";

const categoryIcons = { models: Sparkles, coding: Terminal, agents: Compass, orchestration: Workflow, tools: Braces, memory: MemoryStick, data: Database, infrastructure: Server, "open-models": Box, training: Layers3, evaluation: Check, deployment: Server };
const opennessLabels = { "open-source": "오픈소스", "source-available": "소스 공개 · 이용 조건 있음", service: "서비스", "open-standard": "공개 표준", "open-weight": "공개 가중치", proprietary: "독점 소프트웨어" };
const categoryById = new Map(ecosystemCategories.map(category => [category.id, category]));
const nodeById = new Map(allEcosystemNodes.map(node => [node.id, node]));
const verificationDates = [...new Set([...ecosystemNodes, ...ecosystemEdges].map(item => item.verifiedAt))].sort();
const verificationLabel = verificationDates.length === 1 ? `${verificationDates[0].replaceAll("-", ". ")}.` : `${verificationDates[0]} – ${verificationDates.at(-1)}`;
const colors = (color: string) => ({ "--area-color": color }) as CSSProperties;
const sceneById = new Map(ecosystemScenes.map(scene => [scene.id, scene]));
const nextPaint = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
type TravelCard = { node: EcosystemNode; left: number; top: number; width: number; height: number };
type Line = { edge: EcosystemEdge; path: string; x: number; y: number; incoming: boolean };

function NodeIcon({ node, large = false }: { node: EcosystemNode; large?: boolean }) {
  const Icon = categoryIcons[node.category];
  return <span className={`${styles.nodeIcon} ${large ? styles.largeIcon : ""}`} style={colors(categoryById.get(node.category)!.color)} aria-hidden="true"><Icon size={large ? 27 : 18} strokeWidth={1.7} /><span>{node.mark}</span></span>;
}

export function EcosystemMap() {
  const [sceneId, setSceneId] = useState<string | null>(null);
  const [history, setHistory] = useState<MapFrame[]>([]);
  const [motion, setMotion] = useState<"idle" | "out" | "in">("idle");
  const [travel, setTravel] = useState<TravelCard | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const surfaceRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);
  const moving = useRef(false);
  const skipDetailFocus = useRef(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  const scene = sceneId ? sceneById.get(sceneId) : undefined;
  const entrances = scene?.entrances ?? overviewEntrances;
  const visibleNodeIds = useMemo(() => new Set(scene ? [scene.centerId, ...scene.groups.flatMap(group => group.nodeIds)] : ecosystemNodes.map(node => node.id)), [scene]);
  const previousNodeIds = useMemo(() => {
    const previous = history.at(-1)?.sceneId;
    const previousScene = previous ? sceneById.get(previous) : undefined;
    return new Set(previousScene ? [previousScene.centerId, ...previousScene.groups.flatMap(group => group.nodeIds)] : ecosystemNodes.map(node => node.id));
  }, [history]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mobile, setMobile] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [boardSize, setBoardSize] = useState({ width: 1, height: 1 });
  const boardRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const selected = selectedId ? nodeById.get(selectedId) : undefined;
  const connections = useMemo(() => {
    if (!selectedId) return [];
    if (!scene) return getConnections(selectedId);
    return allEcosystemEdges.filter(edge => scene.edgeIds.includes(edge.id)).flatMap(edge => {
      const direction = edge.from === selectedId ? "outgoing" as const : edge.to === selectedId ? "incoming" as const : null;
      if (!direction) return [];
      const node = nodeById.get(direction === "outgoing" ? edge.to : edge.from);
      return node ? [{ edge, node, direction }] : [];
    });
  }, [selectedId, scene]);
  const connectedIds = useMemo(() => new Set(connections.map(connection => connection.node.id)), [connections]);
  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized ? allEcosystemNodes.filter(node => visibleNodeIds.has(node.id) && `${node.name} ${node.mapLabel} ${node.tagline} ${node.description} ${categoryById.get(node.category)!.name}`.toLocaleLowerCase().includes(normalized)) : [];
  }, [query, visibleNodeIds]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const close = useCallback(() => {
    if (moving.current) return;
    const previous = selectedId;
    setSelectedId(null);
    if (previous) requestAnimationFrame(() => surfaceRef.current?.querySelector<HTMLElement>(`[data-node-id="${previous}"]`)?.focus({ preventScroll: true }));
  }, [selectedId]);

  const select = (id: string) => {
    if (moving.current || !visibleNodeIds.has(id)) return;
    setSelectedId(id); setQuery("");
  };

  const selectCard = (id: string, event: MouseEvent<HTMLButtonElement>) => {
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (moving.current) return;
    // Keyboard activation is immediate. Pointer activation leaves a short window
    // for the native double-click before moving focus into the inspector.
    if (event.detail === 0 || !entrances[id]) { select(id); return; }
    if (event.detail === 1) clickTimer.current = setTimeout(() => select(id), 300);
  };

  const snapshot = (focusId: string | null = selectedId): MapFrame => ({
    sceneId, selectedId, focusId, scrollY: window.scrollY, query,
    panelScrollTop: panelRef.current?.scrollTop ?? 0,
  });

  const navigate = async (navigation: MapNavigation, anchorId: string) => {
    if (moving.current || navigation.frame.sceneId === sceneId) return;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    moving.current = true;
    skipDetailFocus.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sourceId = navigation.returning ? scene?.centerId ?? anchorId : anchorId;
    let source = surfaceRef.current?.querySelector<HTMLElement>(`[data-node-id="${sourceId}"]`);
    const sourceBounds = source?.getBoundingClientRect();
    if (!sourceBounds || sourceBounds.bottom < 0 || sourceBounds.top > window.innerHeight) source = panelRef.current?.querySelector<HTMLElement>(`.${styles.detailHero}`) ?? undefined;
    const rect = source?.getBoundingClientRect();
    const node = nodeById.get(sourceId);
    if (!reduced && rect && node) setTravel({ node, left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    setMotion("out");
    try {
      if (!reduced && stageRef.current) {
        const bounds = stageRef.current.getBoundingClientRect();
        const origin = rect ? `${rect.left + rect.width / 2 - bounds.left}px ${rect.top + rect.height / 2 - bounds.top}px` : "50% 40%";
        await stageRef.current.animate([
          { opacity: 1, transform: "scale(1)", filter: "blur(0)", transformOrigin: origin },
          { opacity: 0, transform: navigation.returning ? "scale(.94)" : "scale(1.065)", filter: "blur(3px)", transformOrigin: origin },
        ], { duration: navigation.returning ? 260 : 220, easing: "cubic-bezier(.4,0,.8,.4)", fill: "forwards" }).finished.catch(() => {});
      }
      if (!alive.current) return;
      setHistory(navigation.history);
      setSceneId(navigation.frame.sceneId);
      setSelectedId(navigation.frame.selectedId);
      setQuery(navigation.frame.query);
      setMotion("in");
      await nextPaint();
      if (!alive.current) return;
      const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 78;
      const targetTop = navigation.returning ? navigation.frame.scrollY : Math.max(0, (surfaceRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - headerHeight - 14);
      window.scrollTo({ top: targetTop, behavior: "instant" });
      if (panelRef.current) panelRef.current.scrollTop = navigation.frame.panelScrollTop;
      const targetId = navigation.returning ? navigation.frame.focusId ?? navigation.frame.selectedId : sceneById.get(navigation.frame.sceneId!)?.centerId;
      const target = targetId ? surfaceRef.current?.querySelector<HTMLElement>(`[data-node-id="${targetId}"]`) : undefined;
      const destination = target?.getBoundingClientRect();
      const animations: Promise<unknown>[] = [];
      if (!reduced && stageRef.current) animations.push(stageRef.current.animate([
        { opacity: 0, transform: navigation.returning ? "scale(.97)" : "scale(.99)" },
        { opacity: 1, transform: "scale(1)" },
      ], { duration: 520, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }).finished.catch(() => {}));
      if (!reduced && travelRef.current && destination) animations.push(travelRef.current.animate([
        { left: `${rect!.left}px`, top: `${rect!.top}px`, width: `${rect!.width}px`, height: `${rect!.height}px`, opacity: 1 },
        { left: `${destination.left}px`, top: `${destination.top}px`, width: `${destination.width}px`, height: `${destination.height}px`, opacity: 1, offset: .78 },
        { left: `${destination.left}px`, top: `${destination.top}px`, width: `${destination.width}px`, height: `${destination.height}px`, opacity: 0 },
      ], { duration: 640, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }).finished.catch(() => {}));
      await Promise.all(animations);
      if (!alive.current) return;
      setTravel(null);
      setMotion("idle");
      await nextPaint();
      if (!alive.current) return;
      if (navigation.returning) {
        window.scrollTo({ top: navigation.frame.scrollY, behavior: "instant" });
        if (mobile && navigation.frame.selectedId) headingRef.current?.focus({ preventScroll: true });
        else target?.focus({ preventScroll: true });
      } else document.getElementById("scene-heading")?.focus({ preventScroll: true });
      setAnnouncement(navigation.frame.sceneId ? `${sceneById.get(navigation.frame.sceneId)?.title}. 세부 지도를 펼쳤습니다.` : "전체 지도의 이전 위치로 돌아왔습니다.");
    } finally {
      if (alive.current) { setTravel(null); setMotion("idle"); }
      moving.current = false;
      skipDetailFocus.current = false;
    }
  };

  const enter = (id: string) => {
    const destination = entrances[id];
    if (!destination || !sceneById.has(destination)) return;
    void navigate(enterMapScene(history, snapshot(id), destination), id);
  };
  const back = (index?: number) => {
    if (!history.length) return;
    const navigation = returnToMapScene(history, snapshot(), index);
    void navigate(navigation, navigation.frame.focusId ?? navigation.frame.selectedId ?? "mcp");
  };

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; if (clickTimer.current) clearTimeout(clickTimer.current); };
  }, []);

  useEffect(() => {
    if (!scene || selectedId) return;
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape" && !(event.target instanceof HTMLInputElement)) { event.preventDefault(); back(); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  });

  useEffect(() => {
    if (!selectedId) return;
    if (!skipDetailFocus.current) {
      headingRef.current?.focus({ preventScroll: true });
      if (panelRef.current) panelRef.current.scrollTop = 0;
    }
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); close(); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [selectedId, close, mobile]);

  useEffect(() => {
    if (!mobile || !selectedId) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mobile, selectedId]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board || scene) return;
    const measure = () => {
      const bounds = board.getBoundingClientRect();
      setBoardSize({ width: bounds.width, height: bounds.height });
      const obstacles = [...board.querySelectorAll('[data-node-id], [data-map-area-heading]')].map(element => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left - bounds.left - 4, right: rect.right - bounds.left + 4, top: rect.top - bounds.top - 3, bottom: rect.bottom - bounds.top + 3 };
      });
      const labels: { left: number; right: number; top: number; bottom: number }[] = [];
      setLines(connections.flatMap(({ edge, direction }, index) => {
        const from = nodeRefs.current.get(edge.from)?.getBoundingClientRect();
        const to = nodeRefs.current.get(edge.to)?.getBoundingClientRect();
        if (!from || !to) return [];
        const sameColumn = Math.abs(from.left - to.left) < 10;
        const rightward = to.left > from.left;
        const sx = (sameColumn ? from.right : rightward ? from.right : from.left) - bounds.left;
        const sy = from.top + from.height / 2 - bounds.top;
        const tx = (sameColumn ? to.right : rightward ? to.left : to.right) - bounds.left;
        const ty = to.top + to.height / 2 - bounds.top;
        // Same-column links travel in the category gutter. Other links use a horizontal curve.
        const bend = sameColumn ? 68 + (index % 2) * 4 : Math.max(34, Math.abs(tx - sx) * .46);
        const c1 = sx + (sameColumn || rightward ? bend : -bend);
        const c2 = tx + (sameColumn || !rightward ? bend : -bend);
        const point = (t: number) => ({ x: (1-t)**3*sx + 3*(1-t)**2*t*c1 + 3*(1-t)*t*t*c2 + t**3*tx, y: (1-t)**3*sy + 3*(1-t)**2*t*sy + 3*(1-t)*t*t*ty + t**3*ty });
        const halfWidth = Math.max(39, edge.label.length * 6.2);
        const candidates = Array.from({length: 177}, (_, n) => .06 + n * .005).sort((a, b) => Math.abs(a-.5) - Math.abs(b-.5));
        const position = candidates.map(point).find(({x, y}) => x-halfWidth >= 0 && x+halfWidth <= bounds.width && [...obstacles, ...labels].every(rect => x+halfWidth < rect.left || x-halfWidth > rect.right || y+12 < rect.top || y-12 > rect.bottom)) ?? point(.5);
        labels.push({left: position.x-halfWidth-4, right: position.x+halfWidth+4, top: position.y-14, bottom: position.y+14});
        return [{ edge, incoming: direction === "incoming", path: `M ${sx} ${sy} C ${c1} ${sy}, ${c2} ${ty}, ${tx} ${ty}`, ...position }];
      }));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(board);
    nodeRefs.current.forEach(node => observer.observe(node));
    measure();
    return () => observer.disconnect();
  }, [connections, scene]);

  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!mobile || event.key !== "Tab") return;
    const elements = panelRef.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]');
    if (!elements?.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === headingRef.current)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  return <main id="main" className={styles.page}>
    <p id="drilldown-instructions" className="sr-only">한 번 클릭하면 설명을 확인합니다. 더블클릭하거나 세부지도 보기 버튼을 누르면 세부 지도로 이동합니다.</p>
    <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    <div inert={mobile && !!selected ? true : undefined}>
      <section className={styles.intro} aria-labelledby="ecosystem-title">
        <div><div className={styles.eyebrow}><Network size={15} /> THE AI LANDSCAPE</div><h1 id="ecosystem-title">AI 생태계, <span>연결해서 이해하기.</span></h1><p>모델과 에이전트부터 학습·평가·운영까지. 각 도구의 역할을 살펴보고 연결을 따라가세요.</p></div>
        <div className={styles.edition}><span>CURATED FIELD GUIDE</span><strong>{verificationLabel}</strong><small>공식 자료 확인 기준</small></div>
      </section>
      <details className={styles.scopeNote}>
        <summary><CircleHelp size={15} /><strong>생성형 AI · 에이전트 중심</strong><span>지도 범위와 선정 기준</span></summary>
        <p>각 영역은 기술의 역할이고, 항목은 그 역할을 설명하는 대표 사례입니다. 모델 제공과 자체 실행, 앱 개발, 학습·평가·운영을 이해하는 데 필요한 도구를 공식 자료로 확인해 담았습니다. 시장 점유율·성능·인기 순위가 아니며 영역의 크기도 시장 규모를 뜻하지 않습니다.</p>
        <p>전통적인 머신러닝, 로보틱스, 영상·음성 제작 제품 전체를 다루지는 않습니다. 공개 가중치·오픈소스·상용 서비스를 함께 보여주되, 공개 범위와 조건은 각 항목에서 구분합니다.</p>
      </details>
      <div className={styles.toolbar}>
        <div className={styles.viewLabel}><MapIcon size={17} /><strong>{scene ? "세부 생태계" : "생태계 지도"}</strong><span>{scene ? `탐색 깊이 ${String(history.length).padStart(2, "0")}` : `${ecosystemCategories.length}개 영역`} <i /> {visibleNodeIds.size}개 항목</span></div>
        <div className={styles.searchWrap}>
          <Search size={16} aria-hidden="true" />
          <input aria-label="생태계 항목 검색" placeholder={scene ? "이 지도에서 찾기" : "이름이나 역할로 찾기"} value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && searchResults[0]) select(searchResults[0].id); if (event.key === "Escape") setQuery(""); }} aria-controls={query.trim() ? "ecosystem-search-results" : undefined} />
          {query && <button aria-label="검색 지우기" onClick={() => setQuery("")}><X size={15} /></button>}
          {query.trim() && <div id="ecosystem-search-results" className={styles.searchResults}><p role="status">{searchResults.length ? `${searchResults.length}개 항목` : "일치하는 항목이 없습니다."}</p>{searchResults.map(node => <button key={node.id} onClick={() => select(node.id)}><NodeIcon node={node} /><span>{node.name}<small>{categoryById.get(node.category)!.name}</small></span><ArrowUpRight size={15} /></button>)}</div>}
        </div>
      </div>
    </div>
    <div className={styles.workspace}>
      <section ref={surfaceRef} className={`${styles.mapSurface} ${scene ? styles.sceneSurface : ""}`} aria-label="AI 생태계 관계 지도" aria-busy={motion !== "idle"} inert={mobile && !!selected ? true : undefined}>
        {scene ? <div className={styles.sceneNavigation}>
          <button className={styles.backButton} onClick={() => back()} disabled={motion !== "idle"} aria-label="이전 지도로 돌아가기"><ArrowLeft size={15} />뒤로가기</button>
          <nav aria-label="생태계 탐색 경로">{history.map((frame, index) => <span key={frame.sceneId ?? "overview"}><button onClick={() => back(index)} disabled={motion !== "idle"}>{frame.sceneId ? nodeById.get(sceneById.get(frame.sceneId)!.centerId)?.name : "전체 지도"}</button><ChevronRight size={12} /></span>)}<strong aria-current="page">{nodeById.get(scene.centerId)?.name}</strong></nav>
          <span className={styles.depthIndicator}>{String(history.length).padStart(2, "0")}<small>DEPTH</small></span>
        </div> : <div className={styles.mapTop}><span><span className={styles.liveDot} />{selected ? <><strong>{selected.name}</strong>의 연결 {connections.length}개</> : "전체 구조를 둘러보세요"}</span><button onClick={() => { setQuery(""); close(); }} disabled={!selected && !query}><RotateCcw size={13} /> 전체 보기</button></div>}
        <div key={sceneId ?? "overview"} ref={stageRef} className={styles.mapStage} inert={motion !== "idle" ? true : undefined}>
        {scene ? <EcosystemSceneView scene={scene} selectedId={selectedId} previousNodeIds={previousNodeIds} leaving={motion === "out"} onSelect={selectCard} onEnter={enter} /> : <>
        <div ref={boardRef} className={`${styles.board} ${selected ? styles.boardActive : ""}`} data-testid="ecosystem-board">
          <svg className={styles.connections} width="100%" height="100%" viewBox={`0 0 ${boardSize.width} ${boardSize.height}`} aria-hidden="true">
            <defs><marker id="outgoing-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M 0 0 L 7 3.5 L 0 7 z" fill="#a4f2cf" /></marker><marker id="incoming-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M 0 0 L 7 3.5 L 0 7 z" fill="#a6bffa" /></marker></defs>
            {lines.map(line => <g key={line.edge.id} data-edge={line.edge.id}><path d={line.path} stroke="#0b1017" strokeWidth="6" fill="none" /><path d={line.path} stroke={line.incoming ? "#a6bffa" : "#a4f2cf"} strokeWidth="1.7" strokeDasharray={line.incoming ? "5 4" : undefined} fill="none" markerEnd={`url(#${line.incoming ? "incoming" : "outgoing"}-arrow)`} /><g className={styles.edgeLabel} transform={`translate(${line.x},${line.y})`}><rect x={-Math.max(39, line.edge.label.length * 6.2)} y="-12" width={Math.max(78, line.edge.label.length * 12.4)} height="24" rx="5" /><text textAnchor="middle" dy="4" fill={line.incoming ? "#bfd1ff" : "#b8f7d9"}>{line.edge.label}</text></g></g>)}
          </svg>
          {ecosystemCategories.map(category => {
            const Icon = categoryIcons[category.id];
            return <section key={category.id} className={styles.area} style={colors(category.color)} aria-labelledby={`area-${category.id}`}><div className={styles.areaHeader} data-map-area-heading><div><Icon size={17} /><span>{ecosystemNodes.filter(node => node.category === category.id).length}개 항목</span></div><h2 id={`area-${category.id}`}>{category.name}</h2><p>{category.subtitle}</p></div><div className={styles.nodes}>{ecosystemNodes.filter(node => node.category === category.id).map(node => {
              const isSelected = selectedId === node.id;
              const connected = connectedIds.has(node.id);
              const dimmed = selected ? !isSelected && !connected : query.trim() ? !searchResults.some(result => result.id === node.id) : false;
              return <button key={node.id} ref={element => { if (element) nodeRefs.current.set(node.id, element); else nodeRefs.current.delete(node.id); }} className={`${styles.node} ${isSelected ? styles.selected : ""} ${connected ? styles.connected : ""} ${dimmed ? styles.dimmed : ""}`} onClick={event => selectCard(node.id, event)} onDoubleClick={entrances[node.id] ? () => enter(node.id) : undefined} title={entrances[node.id] ? "한 번 클릭: 상세 · 더블클릭: 세부지도" : undefined} aria-pressed={isSelected} aria-label={`${node.name} 상세 보기`} aria-describedby={`role-${node.id}`} aria-controls="ecosystem-detail" data-node-id={node.id}><NodeIcon node={node} /><span className={styles.nodeName}>{node.name}</span><small className={styles.nodeRole} id={`role-${node.id}`}>{node.mapLabel}</small>{entrances[node.id] ? <Layers3 size={13} className={styles.drillIndicator} /> : isSelected ? <Check size={13} /> : <ChevronRight size={12} />}</button>;
            })}</div></section>;
          })}
        </div>
        <div className={styles.mapLegend}><span><Box size={13} /> 상자: 주 역할에 따른 분류</span><span><ArrowRight size={14} /> 화살표: 확인된 기술 연결</span>{selected ? <><span><i className={styles.outgoingKey} />이 항목이 연결</span><span><i className={styles.incomingKey} />이 항목에 연결</span></> : <span className={styles.legendHint}>항목 선택 시 연결 표시</span>}</div>
        </>}
        </div>
        {selected && <div className={styles.selectionNote} role="status"><GitBranch size={14} /><span>{selected.name}: 연결 항목 {connections.length}개를 강조했습니다. <span>구체적인 방향과 근거는 상세 패널에서 확인하세요.</span></span></div>}
      </section>
      {mobile && selected && <div className={styles.backdrop} onClick={close} aria-hidden="true" />}
      <div id="ecosystem-detail" ref={panelRef} className={`${styles.inspector} ${selected ? styles.inspectorOpen : ""}`} role={mobile && selected ? "dialog" : "complementary"} aria-modal={mobile && selected ? true : undefined} aria-labelledby={selected ? "ecosystem-detail-heading" : "ecosystem-guide-heading"} onKeyDown={trapFocus}>
        {selected ? <>
          <div className={styles.panelTop}><span>EXPLORE THE CONNECTIONS</span><button onClick={close} aria-label="상세 패널 닫기"><X size={19} /></button></div>
          <div className={styles.detailHero} style={colors(categoryById.get(selected.category)!.color)}><NodeIcon node={selected} large /><span className={styles.categoryBadge}>{categoryById.get(selected.category)!.name}</span><h2 id="ecosystem-detail-heading" ref={headingRef} tabIndex={-1}>{selected.name}</h2><p>{selected.tagline}</p></div>
          {entrances[selected.id] && <div className={styles.diveCtaWrap}><button className={styles.diveCta} aria-label={`${selected.name} 세부지도 보기`} onClick={() => enter(selected.id)} disabled={motion !== "idle"}><span className={styles.diveCtaIcon}><Layers3 size={20} /></span><span><strong>세부지도 보기</strong><small>{sceneById.get(entrances[selected.id])?.groups.reduce((count, group) => count + group.nodeIds.length, 0)}개 연관 항목으로 더 깊게</small></span><ArrowUpRight size={19} /></button><span className={styles.diveHint}>지도에서 카드를 더블클릭해도 들어갈 수 있어요.</span></div>}
          <div className={styles.externalLinks}><a href={selected.website} target="_blank" rel="noopener noreferrer"><Globe size={14} />홈페이지<ArrowUpRight size={12} /><span className="sr-only"> (새 탭)</span></a><a href={selected.docs} target="_blank" rel="noopener noreferrer"><BookOpen size={14} />문서<ArrowUpRight size={12} /><span className="sr-only"> (새 탭)</span></a>{selected.github && <a href={selected.github} target="_blank" rel="noopener noreferrer"><Github size={14} />GitHub<ArrowUpRight size={12} /><span className="sr-only"> (새 탭)</span></a>}</div>
          <div className={styles.detailBody}>
            <section><h3>어떤 도구인가요?</h3><p>{selected.description}</p></section>
            <section><h3>해결하는 문제와 역할</h3><p>{selected.problem}</p><div className={styles.roleNote}><Layers3 size={15} /><p>{selected.role}</p></div></section>
            <section><h3>이럴 때 사용해요</h3><ul>{selected.useCases.map(useCase => <li key={useCase}>{useCase}</li>)}</ul></section>
            <section><h3>핵심 기능</h3><ul>{selected.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>
            <section className={styles.related}><h3>연결된 기술 <span>{connections.length}</span></h3><p className={styles.sectionHint}>설정 가능한 연동도 포함합니다. 필수 의존성을 뜻하지 않습니다.</p>{connections.length ? connections.map(({ edge, node, direction }) => <div key={edge.id} className={styles.relation}><div className={styles.relationDirection}>{direction === "outgoing" ? selected.name : node.name}<ArrowRight size={11} />{direction === "outgoing" ? node.name : selected.name}</div><button onClick={() => select(node.id)}><NodeIcon node={node} /><span>{node.name}<small>{edge.label}</small></span><ArrowUpRight size={15} /></button><p>{edge.description}</p><a href={edge.source.url} target="_blank" rel="noopener noreferrer">연결 근거 · {edge.source.title}<ExternalLink size={11} /><span className="sr-only"> (새 탭)</span></a><small className={styles.verifiedDate}>확인 {edge.verifiedAt}</small></div>) : <p>이 지도에 등록된 항목 사이에서 확인한 기술 연결이 아직 없습니다.</p>}</section>
            <section><h3>공개 범위와 라이선스</h3><span className={styles.openBadge}>{opennessLabels[selected.openness]}</span><p>{selected.license}</p>{selected.licenseUrl && <a className={styles.textLink} href={selected.licenseUrl} target="_blank" rel="noopener noreferrer">라이선스·이용 조건 원문<ArrowUpRight size={12} /><span className="sr-only"> (새 탭)</span></a>}</section>
            <section className={styles.sources}><h3>정보 출처</h3>{selected.sources.map(source => <a href={source.url} key={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={13} /><span className="sr-only"> (새 탭)</span></a>)}<p>공식 자료 확인일 <time dateTime={selected.verifiedAt}>{selected.verifiedAt}</time></p></section>
          </div>
        </> : <>
          <div className={styles.panelTop}><span>YOUR FIELD GUIDE</span><Compass size={17} /></div>
          <div className={styles.guideHero}><div className={styles.guideIllustration} aria-hidden="true"><div><Sparkles size={23} /></div><span /><div><Workflow size={23} /></div><span /><div><Database size={23} /></div></div><h2 id="ecosystem-guide-heading">{scene ? <>연결을 따라,<br />한 단계 더 깊이.</> : <>하나의 도구에서,<br />생태계 전체로.</>}</h2><p>{scene ? scene.description : "궁금한 항목을 선택하면 어떤 역할을 하는지, 무엇과 연결되는지 볼 수 있어요."}</p></div>
          {Object.keys(entrances).length > 0 && <div className={styles.guideDive}><span><Layers3 size={12} /> EXPLORE DEEPER</span>{Object.entries(entrances).map(([nodeId, destination]) => <button key={nodeId} onClick={() => enter(nodeId)} disabled={motion !== "idle"}><span><strong>{nodeById.get(nodeId)?.name}</strong><small>{sceneById.get(destination)?.groups.length}개 역할로 펼쳐지는 세부 생태계</small></span><ArrowUpRight size={19} /></button>)}</div>}
          <div className={styles.guideSteps}><p><span>01</span>영역 안에서 도구를 선택하세요.</p><p><span>02</span>화살표의 의미를 확인하세요.</p><p><span>03</span>연결된 도구로 탐색을 이어가세요.</p></div>
          <div className={styles.startingPoints}><h3>여기서 시작해 보세요</h3>{(scene ? [scene.centerId, ...scene.groups.flatMap(group => group.nodeIds).slice(0, 2)] : ["opencode", "hermes", "mcp"]).map(id => { const node = nodeById.get(id); return node && <button key={id} onClick={() => select(id)}><NodeIcon node={node} /><span>{node.name}<small>{categoryById.get(node.category)!.name}</small></span><ArrowUpRight size={15} /></button>; })}</div>
          <div className={styles.editorialNote}><CircleHelp size={17} /><p>영역은 이해를 돕기 위한 주 역할 분류입니다. 하나의 도구가 여러 역할을 할 수 있으며, 확인된 연결만 지도에 담았습니다.</p></div>
        </>}
      </div>
    </div>
    <div className={styles.footnote} inert={mobile && !!selected ? true : undefined}><span><Check size={13} />{scene?.edgeIds.length ?? ecosystemEdges.length}개 연결 · 공식 문서와 저장소를 근거로 편집</span><span>선정한 대표 항목의 지도이며, 전체 목록이나 인기 순위가 아닙니다.</span></div>
    {travel && <div ref={travelRef} aria-hidden="true" className={styles.travelCard} style={{ left: travel.left, top: travel.top, width: travel.width, height: travel.height, ...colors(categoryById.get(travel.node.category)!.color) }}><NodeIcon node={travel.node} /><strong>{travel.node.name}</strong><small>{travel.node.mapLabel}</small></div>}
  </main>;
}
