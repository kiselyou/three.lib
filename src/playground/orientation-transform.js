import * as core from '@core'

const appElement = document.getElementById('app')

const baseScene = core.BaseScene.get()

const light = new core.BaseSceneLight()

light
  .enableDirectionalLight()
  .enableHemisphereLight()

baseScene
  .add(light)
  .prepareRenderer()
  .prepareCamera()
  .prepareScene()
  .append(appElement)
  .animate()

new core.BaseSceneMapControls(baseScene)

const gridHelper = new core.GridHelper(10, 5)
baseScene.add(gridHelper)

const meshes = [coneMesh(), coneMesh(), coneMesh()]
meshes[0]['position']['x'] = -2
meshes[1]['position']['x'] = 0
meshes[2]['position']['x'] = 2

const targetGeometry = new core.SphereBufferGeometry(0.05)
const targetMaterial = new core.MeshBasicMaterial({ color: 0xff0000 })
const target = new core.Mesh(targetGeometry, targetMaterial)

const transformArray = []
for (const mesh of meshes) {
  transformArray.push(new core.OrientationTransform(mesh, 1.5))
}

baseScene
  .add(meshes[0])
  .add(meshes[1])
  .add(meshes[2])
  .add(target)
  .onAnimate((delta) => {
    for (const orientationTransform of transformArray) {
      orientationTransform.update(delta)
    }
  })

updateTargetPosition()

window.addEventListener('resize', () => {
  baseScene.onResize()
}, false)

function updateTargetPosition() {
  target.position.copy(core.Vector3Helper.randomVector3(2))
  for (const orientationTransform of transformArray) {
    orientationTransform.setTarget(target.position)
  }
  setTimeout(updateTargetPosition, 3000)
}

function coneMesh() {
  const geometry = new core.ConeBufferGeometry(0.1, 0.5, 8)
  geometry.rotateX(Math.PI * 0.5)
  const material = new core.MeshNormalMaterial()
  return new core.Mesh(geometry, material)
}