import * as THREE from 'three'

class OrientationTransform {
  /**
   *
   * @param {Object3D} mesh
   * @param {number} [speed]
   */
  constructor(mesh, speed = 5) {
    /**
     *
     * @type {Object3D}
     */
    this.mesh = mesh

    /**
     *
     * @type {number}
     */
    this.speed = speed

    /**
     *
     * @type {Matrix4}
     */
    this.rotationMatrix = new THREE.Matrix4()

    /**
     *
     * @type {Quaternion}
     */
    this.targetRotation = new THREE.Quaternion()

    /**
     *
     * @type {Vector3}
     */
    this.target = new THREE.Vector3()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._v = new THREE.Vector3()
  }

  /**
   * TODO: move this methos
   * Направление текущего объекта мире.
   *
   * @returns {Vector3}
   */
  getDirection() {
    this._v.applyQuaternion(this.mesh.quaternion)
    this.mesh.getWorldDirection(this._v)
    return this._v.clone()
  }

  /**
   *
   * @param {number} value
   * @returns {OrientationTransform}
   */
  setSpeed(value) {
    this.speed = value
    return this
  }

  /**
   *
   * @param {Object|Vector3} vector
   * @returns {OrientationTransform}
   */
  setTarget(vector) {
    this.target.copy(vector)
    this.rotationMatrix.lookAt(this.target, this.mesh.position, this.mesh.up)
    this.targetRotation.setFromRotationMatrix(this.rotationMatrix)
    return this
  }

  /**
   *
   * @param {number} delta
   * @returns {void}
   */
  update(delta) {
    const step = this.speed * delta
    if (!this.mesh.quaternion.equals(this.targetRotation)) {
      this.mesh.quaternion.rotateTowards(this.targetRotation, step)
    }
    // TODO: move this line
    this.mesh.position.addScaledVector(this.getDirection(), step)
  }
}

export default OrientationTransform