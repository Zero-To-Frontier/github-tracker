export interface MapFrame {
  sceneId: string | null;
  selectedId: string | null;
  scrollY: number;
  focusId: string | null;
  query: string;
  panelScrollTop: number;
}

export interface MapNavigation {
  history: MapFrame[];
  frame: MapFrame;
  returning: boolean;
}

export function enterMapScene(
  history: MapFrame[],
  current: MapFrame,
  targetSceneId: string,
): MapNavigation {
  if (current.sceneId === targetSceneId) {
    return { history, frame: current, returning: false };
  }

  // Revisiting an ancestor restores its saved view instead of creating a loop.
  const ancestorIndex = history.findIndex((frame) => frame.sceneId === targetSceneId);
  if (ancestorIndex !== -1) {
    return returnToMapScene(history, current, ancestorIndex);
  }

  return {
    history: [...history, current],
    frame: {
      sceneId: targetSceneId,
      selectedId: null,
      scrollY: 0,
      focusId: null,
      query: "",
      panelScrollTop: 0,
    },
    returning: false,
  };
}

export function returnToMapScene(
  history: MapFrame[],
  current: MapFrame,
  index: number = history.length - 1,
): MapNavigation {
  if (!Number.isInteger(index) || index < 0 || index >= history.length) {
    return { history, frame: current, returning: false };
  }

  return {
    history: history.slice(0, index),
    frame: history[index],
    returning: true,
  };
}
