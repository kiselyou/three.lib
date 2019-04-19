import MapControls from './controls/MapControls'

class BaseSceneMapControls extends MapControls {
  constructor(baseScene) {
    super(baseScene.camera, baseScene.renderer.domElement)

    this.minDistance = 5
    this.maxDistance = 25
    this.maxPolarAngle = Math.PI / 2.2
  }
}

export default BaseSceneMapControls