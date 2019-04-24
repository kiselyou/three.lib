
class IntersectBaseModels {
  /**
   * List objects to calculate intersection.
   *
   */
  constructor() {
    /**
     * Объекты для расчеча пересечения при клике.
     *
     * @type {Array.<Object3D>}
     */
    this.onMouseClick = []

    /**
     * Объекты для расчеча пересечения рекурсивно при клике.
     *
     * @type {Array.<Object3D>}
     */
    this.onMouseClickRecursive = []

    /**
     * Объекты для расчеча пересечения при наведении курсора или потери.
     *
     * @type {Array.<Object3D>}
     */
    this.onMouseMove = []

    /**
     * Объекты для расчеча пересечения рекурсивно при наведении курсора или потери.
     *
     * @type {Array.<Object3D>}
     */
    this.onMouseMoveRecursive = []
  }

  /**
   *
   * @param {BaseModel} model
   * @returns {IntersectBaseModels}
   */
  remove(model) {
    this.removeFrom(this.onMouseClick, model)
    this.removeFrom(this.onMouseClickRecursive, model)
    this.removeFrom(this.onMouseMove, model)
    this.removeFrom(this.onMouseMoveRecursive, model)
    return this
  }

  /**
   *
   * @param {Array} array - from which to remove the value
   * @param {BaseModel} model
   * @returns {IntersectBaseModels}
   */
  removeFrom(array, model) {
    const index = array.indexOf(model)
    array.splice(index, 1)
    return this
  }

  /**
   *
   * @param {BaseModel} model
   */
  add(model) {
    const options = model.getIntersectModelOptions()
    if (options.isIntersectOnMouseClick) {
      this.addMouseClick(model, options.isIntersectRecursive)
    }
    if (options.isIntersectOnMouseMove) {
      this.addMouseMove(model, options.isIntersectRecursive)
    }
    return this
  }

  /**
   *
   * @param {BaseModel} model
   * @param {boolean} recursive
   * @returns {IntersectBaseModels}
   */
  addMouseClick(model, recursive) {
    if (recursive) {
      this.onMouseClickRecursive.push(model)
      this.removeFrom(this.onMouseClick, model)
    } else {
      this.onMouseClick.push(model)
      this.removeFrom(this.onMouseClickRecursive, model)
    }
    return this
  }

  /**
   *
   * @param {BaseModel} model
   * @param {boolean} recursive
   * @returns {IntersectBaseModels}
   */
  addMouseMove(model, recursive) {
    if (recursive) {
      this.onMouseMoveRecursive.push(model)
      this.removeFrom(this.onMouseMove, model)
    } else {
      this.onMouseMove.push(model)
      this.removeFrom(this.onMouseMoveRecursive, model)
    }
    return this
  }
}

export default IntersectBaseModels