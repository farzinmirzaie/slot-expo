// Alien Tech Planet Levels — 8 levels
// Tile types: 0=empty, 1=blocker, 2=crater, 5=teleport
// teleports array: [{from:{x,y}, to:{x,y}}] — pairs of teleport pads

export const alienLevels = [
  {
    id: 1,
    name: "First Contact",
    chapter: 'alien',
    narrative: "The alien technology is strange. Step on a purple pad and you'll appear somewhere else entirely.",
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,5,0,5,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // Player (0,3) → right → hits teleport at (2,3) → appears at (4,3) → continues right → slides to (6,3) = goal
    playerStart: { x: 0, y: 3 },
    goal: { x: 6, y: 3 },
    collectibles: [],
    teleports: [{ from: { x: 2, y: 3 }, to: { x: 4, y: 3 } }]
  },
  {
    id: 2,
    name: "Quantum Jump",
    chapter: 'alien',
    narrative: "Two teleport pairs. Use them both to navigate the alien grid.",
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0],
      [0,0,5,0,0,0,0],
      [0,1,0,0,0,1,0],
      [0,0,0,0,5,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // Teleport at (2,2) → (4,4), (4,4) → (2,2) (bidirectional pair)
    playerStart: { x: 0, y: 2 },
    goal: { x: 6, y: 4 },
    collectibles: [],
    teleports: [{ from: { x: 2, y: 2 }, to: { x: 4, y: 4 } }]
  },
  {
    id: 3,
    name: "Phase Shift",
    chapter: 'alien',
    narrative: "Phase portals scatter the path. Only the right sequence completes the circuit.",
    grid: [
      [0,0,0,0,0,0,0],
      [0,1,0,5,0,1,0],
      [0,0,0,0,0,0,0],
      [0,5,0,0,0,5,0],
      [0,0,0,0,0,0,0],
      [0,1,0,5,0,1,0],
      [0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 3 },
    goal: { x: 6, y: 3 },
    collectibles: [],
    teleports: [
      { from: { x: 3, y: 1 }, to: { x: 1, y: 3 } },
      { from: { x: 5, y: 3 }, to: { x: 3, y: 5 } }
    ]
  },
  {
    id: 4,
    name: "Warp Matrix",
    chapter: 'alien',
    narrative: "The warp matrix has multiple entry and exit points. Map them in your mind before moving.",
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,5,0,0,0,0,5,0],
      [0,0,0,1,1,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,1,1,0,0,0],
      [0,5,0,0,0,0,5,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 0 },
    goal: { x: 7, y: 7 },
    collectibles: [{ x: 4, y: 0 }],
    teleports: [
      { from: { x: 1, y: 1 }, to: { x: 6, y: 6 } },
      { from: { x: 6, y: 1 }, to: { x: 1, y: 6 } }
    ]
  },
  {
    id: 5,
    name: "Alien Collector",
    chapter: 'alien',
    narrative: "Energy crystals are scattered across the teleport network. Collect them to power the escape craft.",
    grid: [
      [0,0,0,5,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0],
      [5,0,0,0,0,0,0,5],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,5,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal: { x: 7, y: 0 },
    collectibles: [{ x: 3, y: 7 }, { x: 7, y: 7 }],
    teleports: [
      { from: { x: 3, y: 0 }, to: { x: 0, y: 3 } },
      { from: { x: 7, y: 3 }, to: { x: 3, y: 6 } }
    ]
  },
  {
    id: 6,
    name: "Dimension Cross",
    chapter: 'alien',
    narrative: "Multiple dimensions intersect here. Each teleport shifts you to another plane.",
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,5,0,1,1,0,5,0],
      [0,0,0,0,0,0,0,0],
      [0,1,0,5,0,1,0,0],
      [0,0,0,0,5,0,0,0],
      [0,0,0,1,0,0,0,0],
      [0,5,0,0,0,0,5,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 4 },
    goal: { x: 7, y: 4 },
    collectibles: [{ x: 4, y: 0 }],
    teleports: [
      { from: { x: 1, y: 1 }, to: { x: 6, y: 6 } },
      { from: { x: 6, y: 1 }, to: { x: 3, y: 3 } },
      { from: { x: 4, y: 4 }, to: { x: 1, y: 6 } }
    ]
  },
  {
    id: 7,
    name: "Rift Network",
    chapter: 'alien',
    narrative: "The rift network spans the entire planet. Mastering it means mastering the alien technology.",
    grid: [
      [5,0,0,0,0,0,0,5],
      [0,0,1,0,0,1,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,1,0,0,1,0,0],
      [5,0,0,0,0,0,0,5],
    ],
    playerStart: { x: 3, y: 0 },
    goal: { x: 3, y: 7 },
    collectibles: [{ x: 0, y: 4 }, { x: 7, y: 3 }],
    teleports: [
      { from: { x: 0, y: 0 }, to: { x: 7, y: 7 } },
      { from: { x: 7, y: 0 }, to: { x: 0, y: 7 } }
    ]
  },
  {
    id: 8,
    name: "Final Transmission",
    chapter: 'alien',
    narrative: "The final alien puzzle. Every portal is interconnected. Find the one true path.",
    grid: [
      [0,5,0,1,1,0,5,0],
      [5,0,0,0,0,0,0,5],
      [0,0,0,0,0,0,0,0],
      [1,0,0,5,0,1,0,0],
      [0,0,1,0,5,0,0,1],
      [0,0,0,0,0,0,0,0],
      [5,0,0,0,0,0,0,5],
      [0,5,0,1,1,0,5,0],
    ],
    playerStart: { x: 0, y: 0 },
    goal: { x: 7, y: 7 },
    collectibles: [{ x: 3, y: 0 }, { x: 7, y: 0 }, { x: 0, y: 7 }],
    teleports: [
      { from: { x: 1, y: 0 }, to: { x: 6, y: 0 } },
      { from: { x: 0, y: 1 }, to: { x: 7, y: 6 } },
      { from: { x: 3, y: 3 }, to: { x: 4, y: 4 } },
      { from: { x: 6, y: 6 }, to: { x: 1, y: 7 } }
    ]
  }
]
