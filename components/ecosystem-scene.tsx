"use client";

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { ArrowUpRight, Check, ChevronRight, Focus, Layers3, Network } from "lucide-react";
import { allEcosystemNodes, allEcosystemEdges, type EcosystemScene } from "@/lib/ecosystem-scenes";
import { ecosystemCategories } from "@/lib/ecosystem";
import type { EcosystemEdge } from "@/lib/ecosystem-types";
import styles from "./ecosystem-scene.module.css";

const nodes = new Map(allEcosystemNodes.map(node => [node.id, node]));
const categories = new Map(ecosystemCategories.map(category => [category.id, category]));
type SceneLine = { edge: EcosystemEdge; path: string; x: number; y: number; showLabel: boolean; labelWidth: number };
type Props = {
  scene: EcosystemScene;
  selectedId: string | null;
  previousNodeIds: Set<string>;
  leaving: boolean;
  onSelect: (id: string, event: MouseEvent<HTMLButtonElement>) => void;
  onEnter: (id: string) => void;
};

// Layout coordinates stay stable while the reveal animation transforms the cards.
function layoutRect(element: HTMLElement, root: HTMLElement) {
  let x = 0, y = 0;
  let current: HTMLElement | null = element;
  while (current && current !== root) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return { x, y, width: element.offsetWidth, height: element.offsetHeight };
}

export function EcosystemSceneView({ scene, selectedId, previousNodeIds, leaving, onSelect, onEnter }: Props) {
  const board = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<SceneLine[]>([]);
  const [size, setSize] = useState({ width: 1, height: 1 });
  const sceneEdges = useMemo(() => allEcosystemEdges.filter(edge => scene.edgeIds.includes(edge.id)), [scene]);
  const connectedIds = useMemo(() => new Set(sceneEdges.filter(edge => edge.from === selectedId || edge.to === selectedId).flatMap(edge => [edge.from, edge.to])), [sceneEdges, selectedId]);
  const center = nodes.get(scene.centerId)!;

  useLayoutEffect(() => {
    const root = board.current;
    if (!root) return;
    const measure = () => {
      const rects = new Map([...root.querySelectorAll<HTMLElement>("[data-node-id]")].map(element => [element.dataset.nodeId!, layoutRect(element, root)]));
      setSize({ width: root.clientWidth, height: root.clientHeight });
      const obstacles = [...rects.values(), ...[...root.querySelectorAll<HTMLElement>("[data-scene-group] > div:first-child, button:not([data-node-id])")].map(element => layoutRect(element, root))];
      const labels: {x: number; y: number; width: number; height: number}[] = [];
      setLines(sceneEdges.flatMap((edge, index) => {
        const from = rects.get(edge.from), to = rects.get(edge.to);
        if (!from || !to) return [];
        const vertical = Math.abs(from.x - to.x) < 30;
        const rightward = to.x > from.x;
        let sx = from.x + (vertical || rightward ? from.width : 0);
        let tx = to.x + (vertical || !rightward ? to.width : 0);
        let sy = from.y + from.height / 2, ty = to.y + to.height / 2;
        const bend = vertical ? 24 + index % 3 * 9 : Math.max(28, Math.abs(tx - sx) * .48);
        let c1 = sx + (vertical || rightward ? bend : -bend), c1y = sy;
        let c2 = tx + (vertical || !rightward ? bend : -bend), c2y = ty;
        // Give upper/lower branches their own center ports. This keeps their
        // explanations in the open center column instead of on adjacent cards.
        const fromCenter = edge.from === scene.centerId;
        if (fromCenter || edge.to === scene.centerId) {
          const centerRect = fromCenter ? from : to;
          const other = fromCenter ? to : from;
          const otherY = other.y + other.height / 2;
          const above = otherY < centerRect.y - 12;
          const below = otherY > centerRect.y + centerRect.height + 12;
          if (root.clientWidth > 650 && (above || below)) {
            const left = other.x + other.width / 2 < centerRect.x + centerRect.width / 2;
            const ox = other.x + (left ? other.width : 0);
            const cx = centerRect.x + centerRect.width * (left ? .28 : .72);
            const cy = centerRect.y + (above ? 0 : centerRect.height);
            const otherControl = ox + (left ? 70 : -70);
            const centerControlY = cy + (above ? -48 : 48);
            if (fromCenter) { sx=cx; sy=cy; c1=cx; c1y=centerControlY; c2=otherControl; c2y=otherY; tx=ox; ty=otherY; }
            else { sx=ox; sy=otherY; c1=otherControl; c1y=otherY; c2=cx; c2y=centerControlY; tx=cx; ty=cy; }
          }
        }
        const point = (t: number) => ({ x: (1-t)**3*sx + 3*(1-t)**2*t*c1 + 3*(1-t)*t*t*c2 + t**3*tx, y: (1-t)**3*sy + 3*(1-t)**2*t*c1y + 3*(1-t)*t*t*c2y + t**3*ty });
        const labelWidth = Math.max(52, edge.label.length * 10 + 16);
        const active = edge.from === selectedId || edge.to === selectedId;
        const candidates = Array.from({length: 85}, (_, n) => .08 + n * .01).sort((a,b) => Math.abs(a-.5) - Math.abs(b-.5));
        const label = active ? candidates.map(point).find(({x,y}) => x - labelWidth/2 > 4 && x + labelWidth/2 < root.clientWidth - 4 && [...obstacles, ...labels].every(rect => x+labelWidth/2+4 < rect.x || x-labelWidth/2-4 > rect.x+rect.width || y+14 < rect.y || y-14 > rect.y+rect.height)) : undefined;
        if (label) labels.push({x: label.x-labelWidth/2-4, y:label.y-14, width:labelWidth+8, height:28});
        return [{ edge, path: `M ${sx} ${sy} C ${c1} ${c1y}, ${c2} ${c2y}, ${tx} ${ty}`, ...(label ?? point(.5)), showLabel: !!label, labelWidth }];
      }));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.querySelectorAll<HTMLElement>("[data-node-id]").forEach(node => observer.observe(node));
    measure();
    return () => observer.disconnect();
  }, [sceneEdges, selectedId]);

  return <div className={`${styles.scene} ${leaving ? styles.leaving : ""}`} style={{ "--scene-color": scene.color } as CSSProperties} data-testid="ecosystem-scene" data-scene-id={scene.id}>
    <div className={styles.sceneIntro}>
      <span className={styles.sceneEyebrow}><Focus size={13} /> ECOSYSTEM CLOSE-UP</span>
      <h2 id="scene-heading" tabIndex={-1}>{scene.title}</h2>
      <p>{scene.subtitle}</p>
      <span className={styles.sceneCount}>{scene.groups.reduce((count, group) => count + group.nodeIds.length, 1)}<small>지도 항목</small></span>
    </div>
    <div ref={board} className={styles.layout}>
      <svg className={styles.connections} viewBox={`0 0 ${size.width} ${size.height}`} width="100%" height="100%" aria-hidden="true">
        <defs><marker id="scene-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M 0 0 L 6 3 L 0 6 z" fill={scene.color} /></marker></defs>
        {lines.map((line, index) => {
          const active = !!selectedId && (line.edge.from === selectedId || line.edge.to === selectedId);
          return <g key={line.edge.id} className={`${styles.edge} ${active ? styles.activeEdge : ""} ${selectedId && !active ? styles.mutedEdge : ""}`} style={{ "--edge-delay": `${220 + index * 35}ms` } as CSSProperties} data-edge={line.edge.id}>
            <path d={line.path} className={styles.edgeUnderlay} />
            <path d={line.path} pathLength="1" className={styles.edgeStroke} markerEnd="url(#scene-arrow)" />
          </g>;
        })}
      </svg>
      <svg className={styles.labels} viewBox={`0 0 ${size.width} ${size.height}`} width="100%" height="100%" aria-hidden="true">
        {lines.filter(line => line.showLabel).map(line => <g key={line.edge.id} transform={`translate(${line.x},${line.y})`}><rect x={-line.labelWidth/2} y={-11} width={line.labelWidth} height={22} rx={5} /><text textAnchor="middle" dy={3.5}>{line.edge.label}</text></g>)}
      </svg>
      <div className={styles.centerCell}>
        <div className={styles.centerHalo} aria-hidden="true" />
        <button className={`${styles.center} ${selectedId === center.id ? styles.selected : ""}`} data-node-id={center.id} data-scene-center="true" onClick={event => onSelect(center.id, event)} aria-label={`${center.name} 상세 보기`} aria-pressed={selectedId === center.id} aria-controls="ecosystem-detail">
          <span className={styles.centerEyebrow}><Network size={12} />지금 탐색하는 중심</span>
          <span className={styles.centerMark}>{center.mark}</span><strong>{center.name}</strong><span className={styles.centerRole}>{center.mapLabel}</span>
          <span className={styles.centerAction}>역할과 연결 보기 <ArrowUpRight size={12} /></span>
        </button>
      </div>
      {scene.groups.map((group, groupIndex) => <section key={group.id} className={styles.group} data-scene-group={group.id} style={{ "--group-index": groupIndex, "--pull-x": groupIndex % 2 ? "-48px" : "48px", "--pull-y": groupIndex < 2 ? "32px" : "-32px", gridColumn: groupIndex % 2 ? 3 : 1, gridRow: groupIndex < 2 ? 1 : 2 } as CSSProperties} aria-labelledby={`scene-group-${group.id}`}>
        <div className={styles.groupHeading}><span>{String(groupIndex + 1).padStart(2, "0")}</span><div><h3 id={`scene-group-${group.id}`}>{group.title}</h3><p>{group.description}</p></div></div>
        <div className={styles.groupNodes}>{group.nodeIds.map((id, nodeIndex) => {
          const node = nodes.get(id)!;
          const expandable = !!scene.entrances[id];
          const isNew = !previousNodeIds.has(id);
          return <div key={id} className={styles.nodeWrap} style={{ "--node-index": nodeIndex } as CSSProperties}>
            <button data-node-id={id} className={`${styles.node} ${selectedId === id ? styles.selected : ""} ${connectedIds.has(id) ? styles.connected : ""} ${selectedId && selectedId !== id && !connectedIds.has(id) ? styles.dimmed : ""}`} style={{ "--node-color": categories.get(node.category)!.color } as CSSProperties} onClick={event => onSelect(id, event)} onDoubleClick={expandable ? () => onEnter(id) : undefined} aria-label={`${node.name} 상세 보기`} aria-pressed={selectedId === id} aria-controls="ecosystem-detail" aria-describedby={expandable ? "drilldown-instructions" : undefined}>
              <span className={styles.mark}>{node.mark}</span><span className={styles.nodeText}><strong>{node.name}</strong><small>{node.mapLabel}</small></span>{selectedId === id ? <Check size={13} /> : <ChevronRight size={12} />}
              {isNew && <span className={styles.newDot} title="이전 지도에 없던 항목" aria-label="이전 지도에 없던 항목" />}
            </button>
            {expandable && <button className={styles.diveButton} onClick={() => onEnter(id)} aria-label={`${node.name} 세부지도 보기`}><Layers3 size={12} />세부지도 보기<ArrowUpRight size={12} /></button>}
          </div>;
        })}</div>
      </section>)}
    </div>
    <div className={styles.sceneFooter}><span><i /> 이전 지도에서 새로 드러난 항목</span><span>카드를 눌러 연결의 의미와 근거를 확인하세요.</span></div>
  </div>;
}
