import * as THREE from 'three'

class GLTFAnimationPerson {
  constructor(gltf) {
    /**
     * @type {Object3D}
     */
    this.model = gltf.scene

    /**
     * @type {Array.<>}
     */
    this.animations = gltf.animations

    /**
     *
     * @type {AnimationMixer}
     */
    this.mixer = new THREE.AnimationMixer(this.model)

    /**
     *
     * @type {SkeletonHelper}
     */
    this.skeleton = new THREE.SkeletonHelper(this.model)

    /**
     *
     * @type {AnimationAction}
     * @private
     */
    this.idleAction = this.mixer.clipAction(this.animations[0])

    /**
     *
     * @type {AnimationAction}
     * @private
     */
    this.runAction = this.mixer.clipAction(this.animations[1])

    /**
     *
     * @type {AnimationAction}
     * @private
     */
    this.tPosAction = this.mixer.clipAction(this.animations[2])

    /**
     *
     * @type {AnimationAction}
     * @private
     */
    this.walkAction = this.mixer.clipAction(this.animations[3])
  }

  /**
   *
   * @returns {GLTFAnimationPerson}
   */
  idle() {
    this.idleAction.play()
    return this
  }

  /**
   *
   * @returns {GLTFAnimationPerson}
   */
  run() {
    this.runAction.play()
    return this
  }

  /**
   *
   * @returns {GLTFAnimationPerson}
   */
  tPos() {
    this.tPosAction.play()
    return this
  }

  /**
   *
   * @returns {GLTFAnimationPerson}
   */
  walk() {
    this.walkAction.play()
    return this
  }

  /**
   *
   * @param {Boolean} value
   * @returns {GLTFAnimationPerson}
   */
  castShadow(value = true) {
    this.model.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = value
      }
    })
    return this
  }

  /**
   *
   * @param {boolean} show
   * @returns {GLTFAnimationPerson}
   */
  skeletonHelper(show = true) {
    this.skeleton.visible = Boolean(show)
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {void}
   */
  animate(delta) {
    this.mixer.update(delta)
  }
}

export default GLTFAnimationPerson