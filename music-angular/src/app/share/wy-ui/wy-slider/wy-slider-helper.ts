export function sliderEvent(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}

export function inArray(arr: any[], target: any): boolean {
  return arr.indexOf(target) !== -1;
}

export function getElementOffset(
  el: HTMLElement
): { top: number; left: number } {
  if (!el.getClientRects().length) {
    return {
      top: 0,
      left: 0,
    };
  }

  const rect = el.getBoundingClientRect();

  const win = el.ownerDocument.defaultView;
  // 返回位置信息
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  };
}

export function limitNumberInRange(
  val: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(val, min), max);
}
