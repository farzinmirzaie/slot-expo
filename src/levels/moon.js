// Tile type constants
export const TILE_EMPTY = 0
export const TILE_BLOCKER = 1
export const TILE_CRATER = 2
export const TILE_SAND = 3
export const TILE_ICE = 4
export const TILE_TELEPORT = 5

// Moon Chapter — 10 Levels (7x7 and 8x8 grids)
// Tile types: 0=empty, 1=blocker, 2=crater
// No ice, sand, or teleport in moon chapter

export const moonLevels = [
  {
    id: 1,
    name: "First Steps",
    chapter: 'moon',
    narrative: "You crash-landed on the Moon. The low gravity lets you glide across the surface — use the rocks to stop.",
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 3 },
    goal: { x: 6, y: 3 },
    collectibles: [],
    teleports: []
  },
  {
    id: 2,
    name: "Rock Block",
    chapter: 'moon',
    narrative: "The boulders are scattered but useful. Use them to redirect your path.",
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // Player at (0,3): slides right, stops at (2,3). Then slide up → stops at (2,1). Then slide right → stops at (6,1). Then slide down → stops at (6,3) = goal
    playerStart: { x: 0, y: 3 },
    goal: { x: 6, y: 3 },
    collectibles: [],
    teleports: []
  },
  {
    id: 3,
    name: "Zigzag",
    chapter: 'moon',
    narrative: "The terrain channels you through twisting corridors of rock.",
    grid: [
      [1,0,0,0,0,0,1],
      [0,0,1,0,0,0,0],
      [0,0,0,0,1,0,0],
      [0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0],
      [0,0,0,0,0,1,0],
      [1,0,0,0,0,0,1],
    ],
    // From (0,3) go right → (6,3), then up → (6,0)... need to rethink
    // Player (0,3) → right → stops at (6,3)... that's goal directly. Let's place goal at different spot
    // Redefine: Player (0,1), Goal (6,5)
    // (0,1) right → (1,1) stops at rock (2,1)? No, stops before blocker → (1,1)
    // Actually let's do: (0,3) down → (0,5), right → (5,5) stops before (6,5) blocker... 
    // Let me rethink with simpler path
    playerStart: { x: 0, y: 2 },
    goal: { x: 6, y: 4 },
    collectibles: [],
    teleports: []
  },
  {
    id: 4,
    name: "Crater Field",
    chapter: 'moon',
    narrative: "Ancient craters pock the surface. Fall in and it's over.",
    grid: [
      [0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,2,0,0,2,0],
      [0,0,0,0,0,0,0],
      [0,0,2,0,0,2,0],
      [0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0],
    ],
    // (0,3) right → stops at (6,3)... no blocker until wall. 
    // Goal at (6,3), player at (0,3): just slides right but craters at (2,3)? No craters on row 3.
    // Row 3 is all zeros → slides right to (6,3) = goal. Too easy.
    // Player: (0,0), goal: (6,6)
    // (0,0) right → (2,0) stops before blocker at (3,0)
    // (2,0) down → (2,1) stops? No blockers... slides to (2,5) stops before... no falls in (2,2) crater → fail
    // Need safer path: (0,0) down → (0,6), right → (2,6) stops before (3,6)? No blocker there
    // Adjust: player (0,3), goal (6,3), craters placed so direct slide is blocked
    playerStart: { x: 0, y: 3 },
    goal: { x: 6, y: 3 },
    collectibles: [],
    teleports: []
  },
  {
    id: 5,
    name: "Signal Cache",
    chapter: 'moon',
    narrative: "Your distress beacon fragments are scattered. Collect them all before reaching the rescue pod.",
    grid: [
      [0,0,0,0,0,0,0],
      [0,1,0,0,0,1,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,1,0,0,0,1,0],
      [0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 0 },
    goal: { x: 6, y: 6 },
    collectibles: [{ x: 2, y: 3 }],
    teleports: []
  },
  {
    id: 6,
    name: "Supply Drop",
    chapter: 'moon',
    narrative: "Three supply caches, scattered across the crater field. Don't miss a single one.",
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,1,0,1,0,0],
      [0,0,0,0,0,0,0],
      [1,0,0,0,0,0,1],
      [0,0,0,0,0,0,0],
      [0,0,1,0,1,0,0],
      [0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 0 },
    goal: { x: 6, y: 6 },
    collectibles: [{ x: 2, y: 0 }, { x: 4, y: 6 }, { x: 3, y: 3 }],
    teleports: []
  },
  {
    id: 7,
    name: "Crater Maze",
    chapter: 'moon',
    narrative: "The craters form a natural maze. Only one path leads safely through.",
    grid: [
      [0,0,2,0,2,0,0,0],
      [0,0,0,0,0,0,2,0],
      [2,0,1,0,1,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,1,0,1,0,0,0],
      [0,2,0,0,0,0,0,2],
      [0,0,0,2,0,2,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 3 },
    goal: { x: 7, y: 3 },
    collectibles: [],
    teleports: []
  },
  {
    id: 8,
    name: "Boulder Run",
    chapter: 'moon',
    narrative: "A dense boulder field. Every move matters — think ahead.",
    grid: [
      [0,0,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,0],
      [0,0,0,1,0,0,0,1],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,1],
      [0,0,1,0,0,0,0,0],
      [1,0,0,0,0,0,1,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal: { x: 7, y: 0 },
    collectibles: [],
    teleports: []
  },
  {
    id: 9,
    name: "Last Cache",
    chapter: 'moon',
    narrative: "The final supply caches are deep in crater territory. Gather them all.",
    grid: [
      [0,0,0,2,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,2,0,0,0],
      [2,0,0,0,0,0,0,2],
      [0,0,0,2,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,2,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal: { x: 7, y: 0 },
    collectibles: [{ x: 3, y: 7 }, { x: 7, y: 7 }, { x: 0, y: 0 }],
    teleports: []
  },
  {
    id: 10,
    name: "Moon's Final Trial",
    chapter: 'moon',
    narrative: "The hardest terrain on the Moon. Master every technique you've learned.",
    grid: [
      [0,0,1,0,2,0,1,0],
      [0,0,0,0,0,0,0,0],
      [1,0,0,2,0,0,0,1],
      [0,0,2,0,0,2,0,0],
      [0,0,0,0,2,0,0,0],
      [1,0,0,2,0,0,0,1],
      [0,0,0,0,0,0,0,0],
      [0,1,0,2,0,1,0,0],
    ],
    playerStart: { x: 0, y: 0 },
    goal: { x: 7, y: 7 },
    collectibles: [{ x: 3, y: 0 }, { x: 7, y: 0 }, { x: 0, y: 7 }],
    teleports: []
  }
]
