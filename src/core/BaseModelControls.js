import * as THREE from 'three'
import OrientationTransform from './OrientationTransform'

class BaseModelControls {
  /**
   *
   * @param {BaseModel|Object} object
   */
  constructor(object) {
    /**
     *
     * @type {BaseModel|Object}
     */
    this.object = object

    /**
     *
     * @type {OrientationTransform}
     */
    this.orientationTransform = new OrientationTransform(this.object)

    /**
     *
     * @type {Vector3}
     * @private
     */
    this.target = new THREE.Vector3()

    /**
     *
     * @type {Vector3}
     * @private
     */
    this._tmp = new THREE.Vector3()

    /**
     *
     * @type {number}
     */
    this.orientationSpeed = 2

    /**
     *
     * @type {number}
     */
    this.directSpeed = 1.7
  }

  /**
   *
   * @param {Vector3} vector
   * @returns {BaseModelControls}
   */
  setTarget(vector) {
    this.target.copy(vector)
    return this
  }

  /**
   * Направление объекта мире.
   *
   * @returns {Vector3}
   */
  getDirection() {
    this._tmp.applyQuaternion(this.object.quaternion)
    this.object.getWorldDirection(this._tmp)
    return this._tmp.clone()
  }

  /**
   *
   * @param {number} delta
   * @returns {void}
   */
  update(delta) {
    this.object.position.addScaledVector(this.getDirection(), this.directSpeed * delta)
    // Запустить скрипт после проверки текущей позиции с таргет позицией
    this.orientationTransform
      .setSpeed(this.orientationSpeed)
      .setTarget(this.target)
      .update(delta)
  }
}

export default BaseModelControls