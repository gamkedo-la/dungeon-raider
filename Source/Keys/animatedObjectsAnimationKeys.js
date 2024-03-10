export const drawbridgeAnimations = {
  open: {
    key: 'drawbridge-open-animation',
    frames: [0, 1, 2, 3, 4, 5, 6, 7],
    props: { frameRate: 8, repeat: 0 }
  },
  close: {
    key: 'drawbridge-close-animation',
    frames: [7, 6, 5, 4, 3, 2, 1, 0],
    props: { frameRate: 8, repeat: 0 }
  }
}

export const AnimatedObjectAnimations = {
  Drawbridge: drawbridgeAnimations
}

export default AnimatedObjectAnimations