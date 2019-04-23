import * as THREE from 'three'

class Mouse3D {
  constructor() {
    /**
     *
     * @type {Raycaster}
     */
    this.raycaster = new THREE.Raycaster()

    /**
     *
     * @type {Vector2|Object}
     */
    this.position = new THREE.Vector2(100000, 100000)

    /**
     *
     * @type {Object3D|?}
     */
    this.intersectedObject = null
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {Mouse3D}
   */
  updateMousePosition(event) {
    this.position.x = (event.clientX / window.innerWidth) * 2 - 1
    this.position.y = - (event.clientY / window.innerHeight) * 2 + 1
    return this
  }

  /**
   * @param {Object|?} intersect
   * @callback IntersectCallback
   */

  /**
   *
   * @param {Camera} camera
   * @param {Array} objects
   * @param {boolean} recursive
   * @param {IntersectCallback} onMouseUp - Объект с которым пересикается курсор.
   * @param {IntersectCallback} onMouseDown - Объект с которого убран курсор.
   */
  moveIntersect(camera, objects, recursive, onMouseUp, onMouseDown) {
    const intersected = this.getIntersectedObject(camera, objects, recursive)
    if (intersected) {
      if (!this.intersectedObject || this.intersectedObject['object'] !== intersected['object']) {
        if (this.intersectedObject) {
          onMouseDown(this.intersectedObject)
        }
        this.intersectedObject = intersected
        onMouseUp(this.intersectedObject)
      }
    } else {
      if (this.intersectedObject) {
        onMouseDown(this.intersectedObject)
        this.intersectedObject = null
      }
    }
  }

  /**
   *
   * @param {Camera} camera
   * @param {Array} objects
   * @param {boolean} recursive
   * @returns {Object|?}
   */
  getIntersectedObject(camera, objects, recursive) {
    this.raycaster.setFromCamera(this.position, camera)
    const intersects = this.raycaster.intersectObjects(objects, recursive)
    if (intersects.length > 0) {
      return intersects[0]
    }
    return null
  }
}

export default Mouse3D