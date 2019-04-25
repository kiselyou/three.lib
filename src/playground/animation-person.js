import * as core from '@core'

const appElement = document.getElementById('app')
const baseScene = core.BaseScene.get()

const gt = new core.TextureLoader().load('./src/playground/textures/grass.jpg')
const gg = new core.PlaneBufferGeometry(500, 500)
const gm = new core.MeshPhongMaterial({ color: 0xffffff, map: gt })
const ground = new core.Mesh(gg, gm)
ground.rotation.x = - Math.PI / 2
ground.material.map.repeat.set(30, 30)
ground.material.map.wrapS = core.RepeatWrapping
ground.material.map.wrapT = core.RepeatWrapping
ground.receiveShadow = true

const loader = new core.GLTFLoader()
loader.load('./src/playground/models/Soldier.glb', (gltf) => {

  const light = new core.BaseSceneLight()

  light
    .enableDirectionalLight()
    .enableHemisphereLight()

  const person = new core.GLTFAnimationPerson(gltf)
  person
    .castShadow(true)
    .skeletonHelper(true)
    // .run()
    .walk()

  const mapControls = new core.BaseSceneMapControls(baseScene)
  const personModel = new core.BaseModel(person.model)
  personModel.children[0]['rotation']['y'] = Math.PI

  const modelControls = new core.BaseModelControls(personModel)

  const groundModel = new core.BaseModel(ground)
  groundModel
    .addEventMouseClick((intersect) => {
      modelControls.setTarget(intersect.point)
    })

  personModel
    .addEventMouseMoveUp((intersect) => {
      intersect.object.material.opacity = 0.5
      intersect.object.material.transparent = true
    })
    .addEventMouseMoveDown((intersect) => {
      intersect.object.material.opacity = 1
      intersect.object.material.transparent = false
    })
    .addEventMouseClick((intersect) => {
      intersect.object.material.opacity = 0
      intersect.object.material.transparent = true
    })

  const stats = new core.StatusBaseScene()
  stats
    .showMSPanel()
    .showMBPanel()
    .showFPSPanel()
    .show()

  baseScene
    .add(light)
    .add(personModel)
    .add(person.skeleton)
    .add(groundModel)
    .prepareRenderer()
    .prepareCamera()
    .prepareScene()
    .prepareCSS2DRenderer()
    .registrationEvents()
    .append(appElement)
    .render()
    .beforeFrameUpdate(() => {
      stats.begin()
    })
    .onFrameUpdate((delta) => {
      person.update(delta)
      modelControls.update(delta)
      mapControls.update()
    })
    .afterFrameUpdate(() => {
      stats.end()
    })
})