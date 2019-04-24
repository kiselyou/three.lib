
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
     * Объекты для расчеча пересечения при наведении курсора или потери.
     *
     * @type {Array.<Object3D>}
     */
    this.onMouseMove = []
  }

  /**
   *
   * @param {BaseModel} model
   * @returns {IntersectBaseModels}
   */
  remove(model) {
    this.removeFrom(this.onMouseClick, model)
    this.removeFrom(this.onMouseMove, model)
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
      this.onMouseClick.push(model)
    }
    if (options.isIntersectOnMouseMove) {
      this.onMouseMove.push(model)
    }
    return this
  }
}

export default IntersectBaseModels