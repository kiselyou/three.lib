import * as core from '@core'

const appElement = document.getElementById('app')

core.BaseScene.get()
  .prepareRenderer()
  .prepareCamera()
  .prepareScene()
  .append(appElement)
  .animate()

const hemiLight = new core.HemisphereLight(0xffffff, 0x444444)
hemiLight.position.set(0, 20, 0)
core.BaseScene.get().add(hemiLight)

const dirLight = new core.DirectionalLight(0xffffff)
dirLight.position.set(-3, 10, -10)
dirLight.castShadow = true
dirLight.shadow.camera.top = 2
dirLight.shadow.camera.bottom = - 2
dirLight.shadow.camera.left = - 2
dirLight.shadow.camera.right = 2
dirLight.shadow.camera.near = 0.1
dirLight.shadow.camera.far = 40
core.BaseScene.get().add(dirLight)

// GROUND
const mesh = new core.Mesh(new core.PlaneBufferGeometry(100, 100), new core.MeshPhongMaterial({ color: 0x4E8440, depthWrite: false }))
mesh.rotation.x = - Math.PI / 2
mesh.receiveShadow = true
core.BaseScene.get().add(mesh)

const loader = new core.GLTFLoader()
loader.load('./src/playground/models/Soldier.glb', (gltf) => {

  const person = new core.GLTFAnimationPerson(gltf)
  person
    .castShadow(true)
    .skeletonHelper(true)
    .run()

  core.BaseScene.get()
    .add(person.model)
    .add(person.skeleton)
    .onAnimate((delta) => {
      person.animate(delta)
    })
})

window.addEventListener('resize', () => {
  core.BaseScene.get().onResize()
}, false)