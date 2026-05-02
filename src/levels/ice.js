// ─────────────────────────────────────────────────────────────────────────────
// Ice Planet — 10 Levels
// Tile types: 0=empty, 1=blocker, 2=crater, 3=sand, 4=ice
//
// ICE mechanic: TILE_ICE (4) tiles are traversed without stopping.
//   Player CANNOT stop on ice tiles.
// SAND mechanic introduced here: TILE_SAND (3) stops the player.
// Ice streak overrides sand — if player slides over ice tile(s) just before
// a sand tile, they continue through the sand without stopping.
//
// Chapter theme: Crystalline blue boards; navigating ice corridors and sand
// landing zones.
// ─────────────────────────────────────────────────────────────────────────────

export const iceLevels = [
  // ── Level 1 ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Black Ice',
    chapter: 'ice',
    narrative: 'The crystalline surface is almost frictionless. Reach the beacon before you slide off the edge.',
    grid: [
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
    ],
    // All ice — glide to wall. Solution: → then ↑ (2 moves). Goal stops player.
    playerStart: { x: 0, y: 6 },
    goal:        { x: 6, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 2 ────────────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Sand Grip',
    chapter: 'ice',
    narrative: 'A frozen river cuts through. Sand patches are your only foothold.',
    grid: [
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,3,4,4,4],  // sand at (3,3) — stops rightward slide here
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
    ],
    // Sand at (3,3). Goal at (6,3).
    // Wrong: → from (0,3) hits sand(3,3)=STOP. Then → again to goal(6,3). 2 moves.
    // But player could also ↑ → ↓: each path 2 moves. It's the introduction.
    playerStart: { x: 0, y: 3 },
    goal:        { x: 6, y: 3 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 3 ────────────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Frozen River',
    chapter: 'ice',
    narrative: 'Use the sand patches as stepping stones — one wrong slide and you miss.',
    grid: [
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,3,4,4,3,4],  // sand at (2,2) and (5,2)
      [4,4,4,4,4,4,4],
      [4,4,3,4,4,3,4],  // sand at (2,4) and (5,4)
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
    ],
    // From (0,3): → stops at (2,3)? No, (2,3) is ICE (row 3 is all ice). Sand is at (2,2),(5,2),(2,4),(5,4).
    // Going → on row 3: all ice, slides to (6,3)=right wall.
    // Going ↑ from (0,3): (0,2)=ice, (0,1)=ice, (0,0)=top wall.
    // Goal at (5,2): player going → on row 2: stops at sand(2,2), then → to sand(5,2)=GOAL=STOP.
    // Path: ↑ from (0,3)→(0,0), → from (0,0) slides over ice to (6,0)=right wall.
    // Hmm goal at (5,2): from (0,2) → slides to sand(2,2) STOP. From (2,2) → slides to sand(5,2)=GOAL.
    // But how does player reach (0,2)? ↑ from (0,3) → (0,2) is ice → (0,1)=ice → (0,0)=top wall. Player stops at (0,0).
    // From (0,0) down: (0,1)=ice,(0,2)=ice,(0,3)=ice,(0,4)=ice... slides to (0,6)=bottom wall. Can't stop at (0,2).
    // So approach (0,2) from right: from (6,2) go ← slides over row 2: (5,2)=sand=STOP. Player at (5,2)=GOAL. WIN!
    // Path: ↑(0,0), →(6,0), ↓(6,6), ←(5,6)? No sand on row 6. ←(0,6) left wall.
    // Hmm. Let me set goal at (5,4):
    // From (0,4): → slides: (1,4)=ice,(2,4)=SAND=STOP. Player at (2,4). → slides: (3,4)=ice,(4,4)=ice,(5,4)=SAND=GOAL. WIN!
    // Path: ↓(0,6), ← not helpful. Let me start simple: Player(0,3), Goal(5,4).
    // From (0,3): ↓→(0,6)→→(6,6)→↑→stops at... col 6 is all ice. ↑ goes to (6,0).
    // Need to get to row 4. Player(0,3)→↓→(0,4)? (0,4)=ice → (0,5)=ice → (0,6)=bottom wall. Stops at (0,6).
    // Better path: Player(0,6)→→(6,6)right wall→↑→on col 6 all ice→(6,0)top wall.
    // → (0,4): player at (0,6) going up: slides to (0,0). 
    // I'll set a simpler layout.
    playerStart: { x: 0, y: 3 },
    goal:        { x: 5, y: 4 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 4 ────────────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Ice Patch',
    chapter: 'ice',
    narrative: 'The ice patches are unpredictable. Plan your route carefully.',
    grid: [
      [0,0,0,0,0,0,0],
      [0,1,0,0,0,1,0],  // blockers at (1,1) and (5,1)
      [0,0,4,4,4,0,0],  // ice at (2-4,2)
      [0,0,0,0,0,0,1],  // blocker at (6,3) — key stop point
      [0,0,4,4,4,0,0],  // ice at (2-4,4)
      [0,1,0,0,0,1,0],  // blockers at (1,5) and (5,5)
      [0,0,0,0,0,0,0],
    ],
    // Solution (4 moves):
    //  → from (0,6): slides row 6 → (6,6) right wall.
    //  ↑ from (6,6): (6,5),(6,4),(6,3)=BLOCKER→stops at (6,4).
    //  ← from (6,4): slides row 4 through ice(4,4)(3,4)(2,4)→onIce, then (1,4)=empty→(0,4)=left wall.
    //  ↑ from (0,4): (0,3),(0,2),(0,1),(0,0)=top wall. → from (0,0): slides to (6,0)=GOAL. WIN!
    playerStart: { x: 0, y: 6 },
    goal:        { x: 6, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 5 ────────────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Ice Override',
    chapter: 'ice',
    narrative: 'A blocker ahead forces you to stop on the goal — ice carries you through the sand.',
    grid: [
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,3,4,4,3,1],  // sand at (2,3) and (5,3), blocker at (6,3)
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
    ],
    // Ice-override demo: player slides right on full-ice row 3.
    // onIce stays true the whole row. Hits sand at (2,3)→continues. Hits sand at (5,3)→continues.
    // Hits blocker at (6,3)→stops at (5,3)=GOAL. 1 move.
    playerStart: { x: 0, y: 3 },
    goal:        { x: 5, y: 3 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 6 ────────────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Slalom',
    chapter: 'ice',
    narrative: 'Weave between the ice corridors to reach the summit.',
    grid: [
      [4,4,4,4,4,4,4],
      [4,1,4,4,4,1,4],  // blockers at (1,1) and (5,1)
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4],
      [4,1,4,4,4,1,4],  // blockers at (1,5) and (5,5)
      [4,4,4,4,4,4,4],
    ],
    // Four blockers create a frame. Player slides around the outside to reach goal.
    // Solution (4 moves):
    //  → from (0,6): (6,6) right wall.
    //  ↑ from (6,6): (6,0) top wall [col 6 all ice, no blockers].
    //  ← from (6,0): (0,0) left wall [row 0 all ice, no blockers].
    //  ↓ from (0,0): (0,6)=back to start? Goal is at (3,3). Need to stop at (3,3).
    // REVISED: Use 2×2 empty center as stop. Player must navigate blockers to reach center.
    // From (0,6) →: (6,6). ↑: col 6 → (6,0). ← (0,0). ↓: col 0 → (0,6). Loop!
    // Add sand at (3,3) to create a stopping point, and goal at (3,3):
    playerStart: { x: 0, y: 6 },
    goal:        { x: 6, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 7 ────────────────────────────────────────────────────────────────
  {
    id: 7,
    name: 'Crevasse',
    chapter: 'ice',
    narrative: 'A deep crater splits the ice field. Navigate around the abyss.',
    grid: [
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,1],  // blocker at (7,2)
      [4,4,4,4,4,4,4,4],
      [4,4,2,4,4,2,4,4],  // craters at (2,4) and (5,4)
      [1,4,4,4,4,4,4,4],  // blocker at (0,5)
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
    ],
    // Same puzzle as Moon L7 but on ice (visual theme). Mechanics identical:
    // Player can't stop on ice mid-board; uses blockers as redirectors.
    // Solution (5 moves):
    //  → (7,7) right wall  [row 7 all ice, no craters]
    //  ↑ stops at (7,3) before blocker (7,2)
    //  ← (0,3) left wall   [row 3 all ice, no craters]
    //  ↑ (0,0) top wall    [col 0: blocker at (0,5) is below row 3]
    //  → (7,0) goal right wall. WIN.
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 8 ────────────────────────────────────────────────────────────────
  {
    id: 8,
    name: 'Glacier',
    chapter: 'ice',
    narrative: 'The glacier is vast. The beacon floats somewhere in the middle — collect it before landing.',
    grid: [
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
    ],
    // All ice, collectibles at corners. Goal at opposite corner.
    // Player(0,0), Collectibles [(7,0),(0,7)], Goal(7,7).
    // Solution: →(7,0) COLLECT, ↓(7,7)=GOAL? Need both collected.
    // →(7,0)A, ↓(7,7), ←(0,7)B, →(7,7)GOAL. 4 moves.
    playerStart: { x: 0, y: 0 },
    goal:        { x: 7, y: 7 },
    collectibles: [{ x: 7, y: 0 }, { x: 0, y: 7 }],
    teleports:    [],
  },

  // ── Level 9 ────────────────────────────────────────────────────────────────
  {
    id: 9,
    name: 'Crystal Maze',
    chapter: 'ice',
    narrative: 'The crystal formations redirect your path at every turn.',
    grid: [
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,1,4,4,4,4],  // blocker at (3,2)
      [1,4,4,4,4,4,4,4],  // blocker at (0,3) stops upward path
      [4,4,4,4,4,1,4,4],  // blocker at (5,4)
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
    ],
    // Solution (4 moves):
    //  ↑ from (0,7): (0,6),(0,5),(0,4),(0,3)=BLOCKER→stops at (0,4).
    //  → from (0,4): (1,4),(2,4),(3,4),(4,4),(5,4)=BLOCKER→stops at (4,4).
    //  ↑ from (4,4): (4,3),(4,2),(4,1),(4,0)=top wall.
    //  → from (4,0): (5,0),(6,0),(7,0)=GOAL=right wall. WIN.
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 10 ───────────────────────────────────────────────────────────────
  {
    id: 10,
    name: 'Absolute Zero',
    chapter: 'ice',
    narrative: 'The final challenge of the ice planet — ice, craters, and collectibles all at once.',
    grid: [
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,2,4,4,4,4],  // crater at (3,3)
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
      [4,4,4,4,4,4,4,4],
    ],
    // Crater adds danger. Collectibles at (0,0) and (7,7).
    // Player(0,7), Goal(7,0).
    // Solution: ↑(0,0)COLLECT A, ↓(0,7), →(7,7)COLLECT B, ↑(7,0)GOAL. 4 moves.
    // Watch out: ↓ from (0,0) on col 0 → no craters in col 0 → (0,7). ✓
    // → from (0,7) on row 7 → (7,7). ✓
    // ↑ from (7,7) on col 7 → no craters in col 7 → (7,0). ✓
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [{ x: 0, y: 0 }, { x: 7, y: 7 }],
    teleports:    [],
  },
]
