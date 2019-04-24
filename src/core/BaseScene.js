import * as THREE from 'three'
import EventEmitter from 'events'
import CSS2DRenderer from './css-renderer/CSS2DRenderer'
import CSS3DRenderer from './css-renderer/CSS3DRenderer'
import Mouse3D from './mouse/Mouse3D'
import IntersectBaseModels from './IntersectBaseModels'
import BaseModel from './BaseModel'
import objectPath from 'object-path'

let inst = null
const BEFORE_FRAME_UPDATE = 'BEFORE_FRAME_UPDATE'
const AFTER_FRAME_UPDATE = 'AFTER_FRAME_UPDATE'
const FRAME_UPDATE = 'FRAME_UPDATE'

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
  onFrameUpdate(callback) {
    this.events.addListener(FRAME_UPDATE, callback)
    return this
  }

  /**
   *
   * @param {baseSceneAnimation} callback
   * @returns {BaseScene}
   */
  beforeFrameUpdate(callback) {
    if (this.events.listenerCount(BEFORE_FRAME_UPDATE) === 0) {
      this.events.addListener(BEFORE_FRAME_UPDATE, callback)
    } else {
      throw new Error('beforeFrameUpdate listener has already exists.')
    }
    return this
  }

  /**
   *
   * @param {baseSceneAnimation} callback
   * @returns {BaseScene}
   */
  afterFrameUpdate(callback) {
    if (this.events.listenerCount(AFTER_FRAME_UPDATE) === 0) {
      this.events.addListener(AFTER_FRAME_UPDATE, callback)
    } else {
      throw new Error('afterFrameUpdate listener has already exists.')
    }
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
   * @typedef {Object} IntersectDetails
   * @property {number} distance
   * @property {Face3} face
   * @property {number} faceIndex
   * @property {Object3D} object
   * @property {Vector3} point
   * @property {Vector2} uv
   */

  /**
   * @param {IntersectDetails} intersect
   * @callback IntersectCallback
   */

  /**
   *
   * @param {Array.<Object3D>} objects
   * @param {boolean} recursive
   * @param {IntersectCallback} onMouseUp
   * @param {IntersectCallback} onMouseDown
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
  render() {
    const delta = this.clock.getDelta()
    this.events.emit(BEFORE_FRAME_UPDATE, delta)
    this.events.emit(FRAME_UPDATE, delta)
    this.mouseMoveIntersect(this.intersectBaseModels.onMouseMove, false,
      (intersect) => {
        const baseModel = this.findBaseModel(intersect.object)
        baseModel.emit(BaseModel.EVENT_MOUSE_MOVE_UP, intersect)
      },
      (intersect) => {
        const baseModel = this.findBaseModel(intersect.object)
        baseModel.emit(BaseModel.EVENT_MOUSE_MOVE_DOWN, intersect)
      }
    )

    this.mouseMoveIntersect(this.intersectBaseModels.onMouseMoveRecursive, true,
      (intersect) => {
        const baseModel = this.findBaseModel(intersect.object)
        baseModel.emit(BaseModel.EVENT_MOUSE_MOVE_UP, intersect)
      },
      (intersect) => {
        const baseModel = this.findBaseModel(intersect.object)
        baseModel.emit(BaseModel.EVENT_MOUSE_MOVE_DOWN, intersect)
      }
    )
    if (this._options.css2DRendererEnabled) {
      this.css2DRenderer.render(this.scene, this.camera)
    }
    if (this._options.css3DRendererEnabled) {
      this.css3DRenderer.render(this.scene, this.camera)
    }
    this.renderer.render(this.scene, this.camera)
    this.events.emit(AFTER_FRAME_UPDATE, delta)
    requestAnimationFrame(() => this.render())
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
    const intersects = []
    if (this.intersectBaseModels.onMouseClick.length > 0) {
      const intersect = this.mouse.getIntersectedObject(this.camera, this.intersectBaseModels.onMouseClick, false)
      if (intersect) {
        intersects.push(intersect)
      }
    }

    if (this.intersectBaseModels.onMouseClickRecursive.length > 0) {
      const intersect = this.mouse.getIntersectedObject(this.camera, this.intersectBaseModels.onMouseClickRecursive, true)
      if (intersect) {
        intersects.push(intersect)
      }
    }

    if (intersects.length > 0) {
      intersects.sort((a, b) => {
        return a.distance < b.distance ? -1 : 1
      })

      const object = objectPath.get(intersects, [0, 'object'])
      const baseModel = this.findBaseModel(object)
      baseModel.emit(BaseModel.EVENT_MOUSE_CLICK, intersects[0])
    }
  }

  /**
   *
   * @param {Object3D|BaseModel|?} object
   * @returns {BaseModel|?}
   */
  findBaseModel(object) {
    if (object instanceof BaseModel) {
      return object
    }
    if (object) {
      const parent = objectPath.get(object, 'parent', null)
      return this.findBaseModel(parent)
    }
    return null
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