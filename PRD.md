# 🚀 PRD: Glide Puzzle Game (Working Title)

---

# 1. 🧭 Overview

## 1.1 Summary
A minimalist, neon-styled puzzle game where the player controls an astronaut who glides in straight lines (up/down/left/right) until hitting an obstacle. The goal is to solve spatial puzzles by navigating through blockers, collecting items, and reaching an exit.

The game is structured into **chapters (planets)**, each introducing new mechanics that layer on top of the core glide system.

---

## 1.2 Core Principles

- **Simple to learn, hard to master**
- **Single consistent movement system (glide)**
- **Mechanics layer, not replace**
- **Short levels, deep puzzles**
- **Strong visual clarity (neon sci-fi)**

---

## 1.3 Target Platform
- Web (Three.js)
- Mobile-friendly (portrait/landscape adaptable)

---

# 2. 🎮 Core Gameplay

## 2.1 Player Movement

- Player can move:
  - Up / Down / Left / Right
- Movement behavior:
  - Player **glides until hitting an obstacle**
  - Cannot stop mid-way unless mechanic allows

---

## 2.2 Core Loop

1. Enter level
2. Analyze puzzle
3. Execute glide movements
4. Interact with mechanics
5. Collect required items
6. Reach goal
7. Progress to next level

---

## 2.3 Failure States

- Stuck in unwinnable position
- Hit hazard (if applicable)

---

## 2.4 Recovery

- Undo move (mandatory)
- Restart level

---

# 3. 🌌 Game Structure

## 3.1 Chapters (Planets)

Each chapter includes:
- 10–15 levels
- 1 new mechanic
- Unique visual identity
- Narrative goal (collect → escape)

---

## 3.2 Level Structure

Each level contains:
- Grid-based board
- Player spawn point
- Obstacles
- Optional/required collectibles
- Exit point

---

## 3.3 Chapter Progression

- Linear progression
- Levels unlocked sequentially
- Final level = reach exit (rocket/escape)

---

# 4. 🧩 Mechanics System

## 4.1 Base Mechanics

- Glide movement
- Static blockers
- Collectibles
- Goal tile

---

## 4.2 Planet Mechanics

### 🌕 Moon (Chapter 1)
- Static rocks
- Craters (holes)

---

### ❄️ Ice Planet
- Forced glide (cannot stop early)

---

### 🌵 Desert Planet
- Sand tiles (shorten glide / stop early)

---

### 🌿 Jungle Planet
- Growing blockers (expand after each move)

---

### 🔥 Volcanic Planet
- Moving hazards (lava shifts per turn)

---

### 👽 Alien Tech Planet
- Teleport tiles
- Laser blockers

---

### 🛰 Space Station
- Gravity direction zones
- Rotating tiles

---

## 4.3 Mechanics Combination

- Mechanics stack across chapters
- Later levels combine 2–3 mechanics
- No mechanic replaces glide

---

## 4.4 Optional Advanced Mechanic (Future)

**Momentum Tiles**
- Boost movement distance
- Redirect movement
- Store kinetic energy

---

# 5. 🎯 Objectives

## 5.1 Types

- Reach goal
- Collect all required items
- Collect items in order
- Avoid hazards
- Limited moves (optional)

---

## 5.2 Win Condition

- All required objectives completed
- Player reaches goal tile

---

# 6. 🧠 Difficulty Design

## 6.1 Curve

### Early Levels
- Introduce mechanic in isolation

### Mid Levels
- Combine 2 mechanics

### Late Levels
- Combine 3+ mechanics
- Tight solutions

### Final Level (Chapter)
- Full mechanic usage

---

## 6.2 Puzzle Design Principles

- Clear visual readability
- No randomness in solutions
- Deterministic outcomes
- Multiple attempts encouraged

---

# 7. 🎨 Visual Design

## 7.1 Style

- Low-poly
- Neon sci-fi
- Soft glow edges
- Dark space background

---

## 7.2 Visual Hierarchy

- Player = brightest focus
- Goal = strong highlight color
- Obstacles = muted but readable
- Interactive tiles = emissive glow

---

## 7.3 Planet Themes

Each planet defines:
- Color palette
- Lighting tone
- Tile design
- VFX (particles, glow)

---

# 8. 📖 Narrative

## 8.1 Structure

- Light narrative
- Delivered via short text per level
- Environmental storytelling

---

## 8.2 Example Arc

- Crash landing on Moon
- Collect ship components
- Escape planet
- Discover anomalies across planets

---

## 8.3 Delivery

- 1–2 lines per level (optional)
- No heavy dialogue

---

# 9. 🔄 Replayability

## 9.1 Drivers

- Increasing puzzle complexity
- Mechanic combinations
- Player mastery

---

## 9.2 Optional Additions (Future)

- Star ratings
- Time-based scoring
- Challenge modes

---

# 10. 🧱 Technical Overview

## 10.1 Engine

- Three.js

---

## 10.2 Core Systems

- Grid system
- Movement system (glide logic)
- Collision system
- Level data system (JSON-based)
- State management

---

## 10.3 Rendering

- Orthographic or perspective camera (slight angle)
- Static board per level
- Lightweight assets

---

# 11. 📦 Phased Development Plan

---

## Phase 1: Core Prototype

### Goal:
Validate core mechanic (glide puzzle)

### Scope:
- Grid system
- Player movement (glide)
- Basic blockers
- Goal tile
- Restart + undo

### Deliverable:
- Playable single level prototype

---

## Phase 2: Vertical Slice (Moon Chapter)

### Goal:
Complete first chapter experience

### Scope:
- 10–15 levels
- Rocks + craters
- Collectibles
- Basic UI (moves, restart)
- Neon visual style v1

### Deliverable:
- Fully playable Chapter 1

---

## Phase 3: Mechanics Expansion

### Goal:
Introduce system depth

### Scope:
- Ice mechanics
- Sand mechanics
- Teleport system
- Hazard system

### Deliverable:
- 2–3 chapters playable

---

## Phase 4: Content & Progression

### Goal:
Expand game content

### Scope:
- All planned planets
- Level progression system
- Narrative snippets
- Difficulty balancing

---

## Phase 5: Polish

### Goal:
Improve feel and clarity

### Scope:
- Animations (movement, impacts)
- VFX (glow, particles)
- Sound effects
- UI polish

---

## Phase 6: Optional Enhancements

### Scope:
- Hint system
- Scoring system
- Cosmetics
- Additional mechanics (momentum tiles)

---

# 12. ⚠️ Risks & Mitigation

## Risk: Repetitive gameplay
- Mitigation: mechanic layering + visual diversity

## Risk: Difficulty frustration
- Mitigation: undo system + gradual onboarding

## Risk: Visual clutter
- Mitigation: strict color hierarchy

---

# 13. ✅ Success Criteria

- Players understand movement instantly
- Increasing challenge feels fair
- Each chapter introduces meaningful variation
- Game remains readable at all times

---

# END
