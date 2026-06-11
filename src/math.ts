export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];
export function normalize(v: Vec2) {
  const len = Math.hypot(v[0], v[1]);
  if (len === 0) return;
  v[0] /= len;
  v[1] /= len;
}

export function distance(from: Vec2, to: Vec2): number {
  return Math.hypot(from[0] - to[0], from[1] - to[1])
}
export function lerp(v0: number, v1: number, t: number): number {
  return v0 + t * (v1 - v0);
}
export function collide(b: Rect, p: Point) {
  return (
    b.x < p.x && (b.x + b.w) > p.x &&
    b.y < p.y && (b.y + b.h) > p.y
  )
}

export function get_center(r: Rect) {
  return {
    x: r.x + (r.w / 2),
    y: r.y + (r.h / 2)
  }
}

// export function normalize([x, y]: Vec2) {
//   const len = Math.hypot(x, y);          // sqrt(x*x + y*y)
//   if (len === 0) return [0, 0];  // guard against divide-by-zero
//   return [x / len, y / len];
// }
export interface Point {
  x: number
  y: number
}
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}
