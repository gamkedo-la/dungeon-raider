export const Ogre1Animations = {
  idle: {
    key: 'ogre1-idle-animation',
    frames: [0, 1],
    props: { frameRate: 1, repeat: -1 }
  },
  walk: {
    key: 'ogre1-walk-animation',
    frames: [2, 3, 4, 5],
    props: { frameRate: 8, repeat: -1 }
  },
  primary: {
    key: 'ogre1-attack-animation',
    frames: [6, 7, 8, 9],
    props: { frameRate: 8, repeat: 0 }
  },
  injured: {
    key: 'ogre1-injured-animation',
    frames: [14, 15],
    props: { frameRate: 1, repeat: 0 }
  },
  death: {
    key: 'ogre1-death-animation',
    frames: [16, 17, 18, 19],
    props: { frameRate: 8, repeat: 0 }
  },
  dead: {
    key: 'ogre1-dead-animation',
    frames: [20],
    props: { frameRate: 1, repeat: 0 }
  }
}

const EnemyAnimations = {
  Ogre1: Ogre1Animations
}

export default EnemyAnimations