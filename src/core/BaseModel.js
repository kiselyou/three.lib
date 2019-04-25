import { Object3D } from 'three'
import EventEmitter from 'events'
import * as THREE from "three/src/Three";

class BaseModel extends Object3D {
  constructor(object) {
    super()
    this.add(object)

    this.type = 'BaseModel'

    /**
     *
     * @type {EventEmitter}
     */
    this.events = new EventEmitter()
  }

  /**
   *
   * @returns {{isIntersectOnMouseClick: boolean, isIntersectOnMouseMove: boolean}}
   */
  getIntersectModelOptions() {
    const events = this.events.eventNames()
    return {
      isIntersectOnMouseClick: events.includes(BaseModel.EVENT_MOUSE_CLICK),
      isIntersectOnMouseMove: events.includes(BaseModel.EVENT_MOUSE_MOVE_UP) || events.includes(BaseModel.EVENT_MOUSE_MOVE_DOWN),
    }
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
   * @param {IntersectDetails|Object}
   * @callback mouseIntersectObject
   */

  /**
   *
   * @param {mouseIntersectObject} callback
   * @returns {BaseModel}
   */
  addEventMouseMoveUp(callback) {
    this.events.addListener(BaseModel.EVENT_MOUSE_MOVE_UP, callback)
    return this
  }

  /**
   *
   * @param {mouseIntersectObject} callback
   * @returns {BaseModel}
   */
  addEventMouseMoveDown(callback) {
    this.events.addListener(BaseModel.EVENT_MOUSE_MOVE_DOWN, callback)
    return this
  }

  /**
   *
   * @param {mouseIntersectObject} callback
   * @returns {BaseModel}
   */
  addEventMouseClick(callback) {
    this.events.addListener(BaseModel.EVENT_MOUSE_CLICK, callback)
    return this
  }

  /**
   *
   * @param {string} type
   * @param {IntersectDetails|Object} params
   * @returns {BaseModel}
   */
  emit(type, params) {
    this.events.emit(type, params)
    return this
  }

  /**
   *
   * @returns {string}
   */
  static get EVENT_MOUSE_CLICK() {
    return 'MOUSE_CLICK'
  }

  /**
   *
   * @returns {string}
   */
  static get EVENT_MOUSE_MOVE_UP() {
    return 'MOUSE_MOVE_UP'
  }

  /**
   *
   * @returns {string}
   */
  static get EVENT_MOUSE_MOVE_DOWN() {
    return 'MOUSE_MOVE_DOWN'
  }
}

export default BaseModel