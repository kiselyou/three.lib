import * as THREE from 'three'

class BaseSceneLight extends THREE.Group {
  constructor() {
    super()

    /**
     *
     * @type {HemisphereLight|Object3D}
     */
    this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444)

    /**
     * 
     * @type {DirectionalLight|Object3D}
     */
    this.directionalLight = new THREE.DirectionalLight(0xffffff)
  }

  /**
   *
   * @returns {BaseSceneLight}
   */
  enableHemisphereLight() {
    this.hemisphereLight.position.set(0, 20, 0)
    this.add(this.hemisphereLight)
    return this
  }

  /**
   *
   * @returns {BaseSceneLight}
   */
  enableDirectionalLight() {
    this.directionalLight.position.set(0, 20, 0)
    this.directionalLight.position.set(-3, 10, -10)
    this.directionalLight.castShadow = true
    this.directionalLight.shadow.camera.top = 2
    this.directionalLight.shadow.camera.bottom = - 2
    this.directionalLight.shadow.camera.left = - 2
    this.directionalLight.shadow.camera.right = 2
    this.directionalLight.shadow.camera.near = 0.1
    this.directionalLight.shadow.camera.far = 40
    this.add(this.directionalLight)
    return this
  }
}

export default BaseSceneLight