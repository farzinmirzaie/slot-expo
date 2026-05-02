// Desert Planet Levels — 8 levels
// Tile types: 0=empty, 1=blocker, 2=crater, 3=sand (stops player early)

export const desertLevels = [
  {
    id: 1,
    name: "Dune Landing",
    chapter: 'desert',
    narrative: "The desert planet's sand dunes act like natural brakes. Use them to stop where you need.",
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,3,0,0,0,3,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // Player (0,3) → right → stops ON sand at (1,3). Then down → slides to (1,6). Then right → slides to (6,6). Then up → slides to (6,0). 
    // Goal at (6,0). Simple path.
    playerStart: { x: 0, y: 3 },
    goal: { x: 6, y: 0 },
    collectibles: [],
    teleports: []
  },
  {
    id: 2,
    name: "Sand Trap",
    chapter: 'desert',
    narrative: "The sand traps your movement. Learn to use them as stepping stones.",
    grid: [
      [0,0,3,0,0,0,0],
      [0,0,0,0,0,0,0],
      [3,0,0,0,3,0,0],
      [0,0,0,0,0,0,0],
      [0,0,3,0,0,0,3],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 0 },
    goal: { x: 6, y: 6 },
    collectibles: [],
    teleports: []
  },
  {
    id: 3,
    name: "Oasis Path",
    chapter: 'desert',
    narrative: "Sand and rock form a complex corridor. Follow the oasis markers.",
    grid: [
      [0,0,0,0,0,0,0],
      [0,1,3,0,0,1,0],
      [0,0,0,0,0,0,0],
      [0,3,0,1,0,3,0],
      [0,0,0,0,0,0,0],
      [0,1,0,0,3,1,0],
      [0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 3 },
    goal: { x: 6, y: 3 },
    collectibles: [{ x: 3, y: 0 }],
    teleports: []
  },
  {
    id: 4,
    name: "Quicksand",
    chapter: 'desert',
    narrative: "Some sands are more treacherous than others. Watch out for the craters hidden beneath.",
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,3,0,3,0,0],
      [0,3,0,2,0,3,0],
      [0,0,2,0,2,0,0],
      [0,3,0,2,0,3,0],
      [0,0,3,0,3,0,0],
      [0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 0 },
    goal: { x: 6, y: 6 },
    collectibles: [],
    teleports: []
  },
  {
    id: 5,
    name: "Dune Collector",
    chapter: 'desert',
    narrative: "Ancient artifacts are buried across the dunes. Recover them all.",
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,1,0,3,0,0,1,0],
      [0,0,0,0,0,0,0,0],
      [3,0,0,0,0,0,0,3],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,3,0,1,0],
      [0,0,0,0,0,0,0,0],
      [0,0,3,0,0,3,0,0],
    ],
    playerStart: { x: 0, y: 0 },
    goal: { x: 7, y: 7 },
    collectibles: [{ x: 3, y: 0 }, { x: 7, y: 0 }, { x: 0, y: 7 }],
    teleports: []
  },
  {
    id: 6,
    name: "Sand Storm",
    chapter: 'desert',
    narrative: "The sand storm has rearranged the terrain. Nothing is where it should be.",
    grid: [
      [3,0,0,0,1,0,3,0],
      [0,0,1,0,0,0,0,0],
      [0,3,0,0,0,3,0,0],
      [0,0,0,0,0,0,0,1],
      [1,0,0,3,0,0,0,0],
      [0,0,3,0,0,1,0,0],
      [0,0,0,0,0,0,3,0],
      [3,1,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 4 },
    goal: { x: 7, y: 3 },
    collectibles: [{ x: 4, y: 0 }],
    teleports: []
  },
  {
    id: 7,
    name: "Desert Fortress",
    chapter: 'desert',
    narrative: "An ancient fortress made of sand and stone. Its walls guide your path.",
    grid: [
      [1,1,1,0,0,1,1,1],
      [1,0,0,0,0,0,0,1],
      [1,0,3,0,0,3,0,1],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [1,0,3,0,0,3,0,1],
      [1,0,0,0,0,0,0,1],
      [1,1,1,0,0,1,1,1],
    ],
    playerStart: { x: 3, y: 0 },
    goal: { x: 3, y: 7 },
    collectibles: [{ x: 1, y: 1 }, { x: 6, y: 6 }],
    teleports: []
  },
  {
    id: 8,
    name: "Desert's End",
    chapter: 'desert',
    narrative: "The final challenge of the desert planet. Every grain of sand matters.",
    grid: [
      [0,0,1,0,0,1,0,0],
      [0,3,0,0,0,0,3,0],
      [1,0,0,2,2,0,0,1],
      [0,0,2,3,3,2,0,0],
      [0,0,2,3,3,2,0,0],
      [1,0,0,2,2,0,0,1],
      [0,3,0,0,0,0,3,0],
      [0,0,1,0,0,1,0,0],
    ],
    playerStart: { x: 0, y: 0 },
    goal: { x: 7, y: 7 },
    collectibles: [{ x: 0, y: 7 }, { x: 7, y: 0 }],
    teleports: []
  }
]
