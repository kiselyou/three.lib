import * as core from '@core'

const appElement = document.getElementById('app')

core.BaseScene.get()
  .prepareRenderer()
  .prepareCamera()
  .prepareScene()
  .append(appElement)
  .animate()

const geometry = new core.BoxGeometry(0.9, 0.9, 0.9)
const material = new core.MeshNormalMaterial()
const mesh = new core.Mesh(geometry, material)
mesh.position.z = -2

core.BaseScene.get()
  .add(mesh)
  .onAnimate(() => {
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.02
  })

window.addEventListener('resize', () => {
  core.BaseScene.get().onResize()
}, false)