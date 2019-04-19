import * as core from '@core'

const appElement = document.getElementById('app')

core.BaseScene.get()
  .prepareRenderer()
  .prepareCamera()
  .prepareScene()


const light = new core.BaseSceneLight()

light
  .enableDirectionalLight()
  .enableHemisphereLight()

const planeGeometry = new core.PlaneBufferGeometry(100, 100)
const planeMaterial = new core.MeshPhongMaterial({ color: 0x4E8440, depthWrite: false })
const plane = new core.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = - Math.PI / 2
plane.receiveShadow = true
core.BaseScene.get().add(plane)

const loader = new core.GLTFLoader()
loader.load('./src/playground/models/Soldier.glb', (gltf) => {

  const person = new core.GLTFAnimationPerson(gltf)
  person
    .castShadow(true)
    .skeletonHelper(true)
    .run()

  core.BaseScene.get()
    .add(light)
    .add(person.model)
    .add(person.skeleton)
    .onAnimate((delta) => {
      person.animate(delta)
    })
    .append(appElement)
    .animate()
})

window.addEventListener('resize', () => {
  core.BaseScene.get().onResize()
}, false)