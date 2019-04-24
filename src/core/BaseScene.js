import * as THREE from 'three'
import EventEmitter from 'events'
import CSS2DRenderer from './css-renderer/CSS2DRenderer'
import CSS3DRenderer from './css-renderer/CSS3DRenderer'
import Mouse3D from './mouse/Mouse3D'
import IntersectBaseModels from './IntersectBaseModels'
import BaseModel from './BaseModel'

let inst = null
const ANIMATION = 'base-scene-animation'
const MOUSE_MOVE_UP = 'mouse_move_up'
const MOUSE_MOVE_DOWN = 'mouse_move_down'
const MOUSE_CLICK = 'mouse_click'

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
     * @type {CSS2DRenderer}
     */
    this.css2DRenderer = new CSS2DRenderer()

    /**
     *
     * @type {CSS3DRenderer}
     */
    this.css3DRenderer = new CSS3DRenderer()

    /**
     *
     * @type {Mouse3D}
     */
    this.mouse = new Mouse3D()

    /**
     * List objects to calculate intersection.
     *
     * @type {IntersectBaseModels}
     */
    this.intersectBaseModels = new IntersectBaseModels()

    /**
     *
     * @type {EventEmitter}
     */
    this.events = new EventEmitter()

    this._options = {
      css2DRendererEnabled: false,
      css3DRendererEnabled: false,
    }
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
   * @param {BaseModel|Object3D} object3D
   * @returns {BaseScene}
   */
  add(object3D) {
    this.scene.add(object3D)
    if (object3D instanceof BaseModel) {
      this.intersectBaseModels.add(object3D)
    }
    return this
  }

  /**
   * @param {number} delta
   * @callback baseSceneAnimation
   */

  /**
   * Срабатывает при генерации каждого кадра.
   *
   * @param {baseSceneAnimation} callback
   * @returns {BaseScene}
   */
  eventFrame(callback) {
    this.events.on(ANIMATION, callback)
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
  prepareCSS2DRenderer() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.css2DRenderer.setSize(width, height)
    this.css2DRenderer.domElement.style.position = 'absolute'
    this.css2DRenderer.domElement.style.top = 0
    document.body.appendChild(this.css2DRenderer.domElement)
    this._options.css2DRendererEnabled = true
    return this
  }

  /**
   *
   * @returns {BaseScene}
   */
  prepareCSS3DRenderer() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.css3DRenderer.setSize(width, height)
    this.css3DRenderer.domElement.style.position = 'absolute'
    this.css3DRenderer.domElement.style.top = 0
    document.body.appendChild(this.css3DRenderer.domElement)
    this._options.css3DRendererEnabled = true
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
    this.scene.background = new THREE.Color(0xFFFFFF)
    this.scene.fog = new THREE.Fog(0xFFFFFF, 10, 50)
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
   * @param {Array.<Object3D>} objects
   * @param {boolean} recursive
   * @param {Function} onMouseUp
   * @param {Function} onMouseDown
   * @returns {BaseScene}
   */
  mouseMoveIntersect(objects, recursive, onMouseUp, onMouseDown) {
    if (objects.length > 0) {
      this.mouse.moveIntersect(this.camera, objects, recursive, onMouseUp, onMouseDown)
    }
    return this
  }

  /**
   * This is main method to animate scene.
   *
   * @returns {BaseScene}
   */
  animate() {
    const delta = this.clock.getDelta()
    requestAnimationFrame(() => this.animate())
    this.events.emit(ANIMATION, delta)
    this.renderer.render(this.scene, this.camera)
    if (this._options.css2DRendererEnabled) {
      this.css2DRenderer.render(this.scene, this.camera)
    }
    if (this._options.css3DRendererEnabled) {
      this.css3DRenderer.render(this.scene, this.camera)
    }

    this.mouseMoveIntersect(this.intersectBaseModels.onMouseMove, false,
      (object) => this.events.emit(MOUSE_MOVE_UP, object),
      (object) => this.events.emit(MOUSE_MOVE_DOWN, object)
    )

    this.mouseMoveIntersect(this.intersectBaseModels.onMouseMoveRecursive, true,
      (object) => this.events.emit(MOUSE_MOVE_UP, object),
      (object) => this.events.emit(MOUSE_MOVE_DOWN, object)
    )

    return this
  }

  /**
   * Use this method inside 'resize' event listener or use method 'registrationEvents' instead.
   *
   * @returns {BaseScene}
   */
  updateSizeScene() {
    const width = window.innerWidth
    const height = window.innerHeight
    this.renderer.setSize(width, height)
    this.css2DRenderer.setSize(width, height)
    this.css3DRenderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    return this
  }

  /**
   * Use this method inside 'mousemove' event listener or use method 'registrationEvents' instead.
   *
   * @param {MouseEvent} event
   * @returns {BaseScene}
   */
  updateMousePosition(event) {
    event.preventDefault()
    this.mouse.updateMousePosition(event)
    return this
  }

  /**
   * @param {MouseEvent} event
   * @returns {BaseScene}
   */
  mouseClick(event) {
    this.updateMousePosition(event)
    const objects = []
    if (this.intersectBaseModels.onMouseClick.length > 0) {
      const object = this.mouse.getIntersectedObject(this.camera, this.intersectBaseModels.onMouseClick, false)
      if (object) {
        objects.push(object)
      }
    }

    if (this.intersectBaseModels.onMouseClickRecursive.length > 0) {
      const object = this.mouse.getIntersectedObject(this.camera, this.intersectBaseModels.onMouseClickRecursive, true)
      console.log(object)
      if (object) {
        objects.push(object)
      }
    }

    objects.sort((a, b) => {
      return a.distance < b.distance ? -1 : 1
    })

    if (objects.length > 0) {
      this.events.emit(MOUSE_CLICK, objects[0])
    }
  }

  /**
   * This method registration all necessary event to scene.
   *
   * @returns {BaseScene}
   */
  registrationEvents() {
    window.addEventListener('resize', () => this.updateSizeScene(), false)
    window.addEventListener('mousemove', (event) => this.updateMousePosition(event), false)
    this.renderer.domElement.addEventListener('click', (event) => this.mouseClick(event), false)
    return this
  }
}

export default BaseScene