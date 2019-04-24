import Stats from 'stats-js'

class StatusBaseScene {
  constructor() {
    /**
     * @type {Stats}
     */
    this.stats = new Stats()
  }

  /**
   *
   * @returns {StatusBaseScene}
   */
  show() {
    document.body.appendChild(this.stats.dom)
    return this
  }

  /**
   *
   * @returns {StatusBaseScene}
   */
  hide() {
    document.body.removeChild(this.stats.dom)
    return this
  }

  /**
   * Frames rendered in the last second. The higher the number the better.
   *
   * @returns {StatusBaseScene}
   */
  showFPSPanel() {
    this.stats.showPanel(0)
    return this
  }

  /**
   * Milliseconds needed to render a frame. The lower the number the better.
   *
   * @returns {StatusBaseScene}
   */
  showMSPanel() {
    this.stats.showPanel(1)
    return this
  }

  /**
   * MBytes of allocated memory. (Run Chrome with --enable-precise-memory-info)
   *
   * @returns {StatusBaseScene}
   */
  showMBPanel() {
    this.stats.showPanel(2)
    return this
  }

  /**
   *
   * @returns {StatusBaseScene}
   */
  begin() {
    this.stats.begin()
    return this
  }

  /**
   *
   * @returns {StatusBaseScene}
   */
  end() {
    this.stats.end()
    return this
  }
}

export default StatusBaseScene