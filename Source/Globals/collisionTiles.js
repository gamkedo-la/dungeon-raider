const collisionTiles = [
// GIDs for tiles that should be collidable.  GIDs start at 1, not 0.
// The Master Tile sheet has a large number of empty tiles with their GID drawn on them
// In Tiled, clicking on a tile in the tile sheet (right side) will show its GID
// in the properties window (left side) as the "ID"
  32, 33, 34, 35, 36, 37, 38, 39,
  64, 65, 66, 67, 68, 69, 70, 71,
  96, 97, 98, 99, 100, 101, 102, 103, 104,
  128, 129, 130, 131, 132, 133, 134,
  160, 161, 162, 163, 164, 165,
  192, 193, 194, 195,
  226, 258, 290, 322, 354, 386, 418, 450, // animated vertical water tiles
  227, 259, 291, 323, 355, 387, 419, 451, // animated vertical acid tiles
  228, 260, 292, 324, 356, 388, 420, 452, 484, 516, 548, 580, 612, 644, 676, 708, // animated vertical lava tiles
  229, 261, 293, 325, 357, 389, 421, 453, // animated vertical water 2 tiles
  40, // exit (so we get the collision event)
  72 // door
]

export default collisionTiles