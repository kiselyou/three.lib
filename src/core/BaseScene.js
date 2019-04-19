import * as THREE from 'three'
import EventEmitter from 'events'

let inst = null
const ANIMATION = 'base-scene-animation'

class BaseScene {
  constructor() {
    if (inst) {
      throw Error('BasScene instance has already exists. Try to use static method BaseScene.get()')
    }

    /**
     *
     * @type {HTMLElement|?}
     */
    this.appElement = null

    /**
     *
     * @type {Clock}
     */
    this.clock = new THREE.Clock()

    /**
     *
     * @type {Camera|PerspectiveCamera}
     */
    this.camera = new THREE.PerspectiveCamera()

    /**
     *
     * @type {Scene}
     */
    this.scene = new THREE.Scene()

    /**
     *
     * @type {WebGLRenderer}
     */
    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    /**
     *
     * @type {EventEmitter}
     */
    this.animationEvents = new EventEmitter()
  }

  /**
   *
   * @returns {BaseScene}
   */
  static get() {
    return inst || (inst = new BaseScene())
  }

  /**
   *
   * @param {Object3D} object3D
   * @returns {BaseScene}
   */
  add(object3D) {
    this.scene.add(object3D)
    return this
  }

  /**
   * @param {number} delta
   * @callback baseSceneAnimation
   */

  /**
   *
   * @param {baseSceneAnimation} callback
   * @returns {BaseScene}
   */
  onAnimate(callback) {
    this.animationEvents.on(ANIMATION, callback)
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  prepareRenderer() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.renderer.gammaOutput = true;
    this.renderer.gammaInput = true
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  prepareCamera() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.camera.fov = 45
    this.camera.aspect = width / height
    this.camera.near = 1
    this.camera.far = 1000
    this.camera.lookAt(0, -4, -10)
    this.camera.position.set(0, 5, 10)
    this.camera.updateProjectionMatrix()
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  prepareScene() {
    this.scene.background = new THREE.Color(0x050505)
    this.scene.fog = new THREE.Fog(0x050505, 10, 50)
    return this
  }

  /**
   *
   * @param {HTMLElement} appElement
   * @returns {BaseScene}
   */
  append(appElement) {
    this.appElement = appElement
    this.appElement.appendChild(this.renderer.domElement)
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  animate() {
    const delta = this.clock.getDelta()
    requestAnimationFrame(() => this.animate())
    this.animationEvents.emit(ANIMATION, delta)
    this.renderer.render(this.scene, this.camera)
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  onResize() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    return this
  }
}

export default BaseScene