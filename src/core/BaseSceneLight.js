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

    /**
     *
     * @type {AmbientLight|Object3D}
     */
    this.ambientLight = new THREE.AmbientLight(0x222222)

    /**
     *
     * @type {Array.<SpotLight|Object3D>}
     */
    this.spotLights = [
      new THREE.SpotLight( 0xffffff, 5, 1000 ),
      new THREE.SpotLight( 0xffffff, 5, 1000 )
    ]
  }

  /**
   *
   * @returns {BaseSceneLight}
   */
  enableSpotLights() {
    this.spotLights[0].position.set(10, 25, 150)
    this.spotLights[1].position.set(- 50, 75, 175)
    for (const light of this.spotLights) {
      light.angle = 0.5
      light.penumbra = 0.5
      light.castShadow = true
      light.shadow.mapSize.width = 1024
      light.shadow.mapSize.height = 1024
      this.add(light)
    }
    return this
  }

  /**
   *
   * @returns {BaseSceneLight}
   */
  enableAmbientLight() {
    this.add(this.ambientLight)
    return this
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