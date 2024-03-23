export const IndestructibleWalls = [
// GIDs for tiles that should be collidable.  GIDs start at 1, not 0.
// The Master Tile sheet has a large number of empty tiles with their GID drawn on them
// In Tiled, clicking on a tile in the tile sheet (right side) will show its GID
// in the properties window (left side) as the "ID"
32, 33, 34, 35, 36, 37, 38, 39,
64, 65, 66, 67, 68, 69, 70, 71,
96, 97, 98, 99, 100, 101, 102, 103, 104,
128, 129, 130, 131, 132, 133, 134,
160, 161, 162, 163, 164, 165,
192, 193, 194, 195
]

export const DestructibleWalls1 = [
  42, 43, 44, 45, 46, 47, 48, 49,
  74, 75, 76, 77, 78, 79, 80, 81,
  106, 107, 108, 109, 110, 111, 112, 113, 114,
  138, 139, 140, 141, 142, 143, 144,
  170, 171, 172, 173, 174, 175,
  202, 203, 204, 205
]

export const DestructibleWalls2 = [
  52, 53, 54, 55, 56, 57, 58, 59,
  84, 85, 86, 87, 88, 89, 90, 91,
  116, 117, 118, 119, 120, 121, 122, 123, 124,
  148, 149, 150, 151, 152, 153, 154,
  180, 181, 182, 183, 184, 185,
  212, 213, 214, 215
]

export const DestructibleWalls = [...DestructibleWalls1, ...DestructibleWalls2]

export const Walls = [...IndestructibleWalls, ...DestructibleWalls]

export const Water = [
  226, 258, 290, 322, 354, 386, 418, 450, // animated vertical water tiles
  229, 261, 293, 325, 357, 389, 421, 453 // animated vertical water 2 tiles  
]

export const Acid = [
  227, 259, 291, 323, 355, 387, 419, 451 // animated vertical acid tiles
]

export const Lava = [
  228, 260, 292, 324, 356, 388, 420, 452, 484, 516, 548, 580, 612, 644, 676, 708 // animated vertical lava tiles
]

export const Liquids = [...Acid, ...Lava, ...Water]

export const Exit = 40
export const Door = 72
export const BridgeIndex = 483

const collisionTiles = [Exit, Door, ...Walls, ...Liquids]
export default collisionTiles