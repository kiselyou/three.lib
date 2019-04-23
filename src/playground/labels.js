import * as core from '@core'

const appElement = document.getElementById('app')

core.BaseScene.get()
  .prepareRenderer()
  .prepareCSS2DRenderer()
  .prepareCSS3DRenderer()
  .prepareCamera()
  .prepareScene()
  .registrationEvents()
  .append(appElement)
  .animate()

const meshAnd2DLabel = generateObjectAnd2DLabel()
meshAnd2DLabel.position.z = -2

const meshAnd3DObjectLabel = generateObjectAnd3DObjectLabel()
meshAnd3DObjectLabel.position.z = -10
meshAnd3DObjectLabel.position.x = 5

const meshAnd3DSpriteLabel = generateObjectAnd3DSpriteLabel()
meshAnd3DSpriteLabel.position.z = -10
meshAnd3DSpriteLabel.position.x = -5

core.BaseScene.get()
  .add(meshAnd2DLabel)
  .add(meshAnd3DObjectLabel)
  .add(meshAnd3DSpriteLabel)
  .onAnimate((delta) => {
    meshAnd2DLabel.rotation.x += 0.01
    meshAnd2DLabel.rotation.y += 0.01
    meshAnd2DLabel.rotation.z += 0.01

    meshAnd3DObjectLabel.rotation.x += 0.01
    meshAnd3DObjectLabel.rotation.y += 0.01
    meshAnd3DObjectLabel.rotation.z += 0.01

    meshAnd3DSpriteLabel.rotation.x += 0.01
    meshAnd3DSpriteLabel.rotation.y += 0.01
    meshAnd3DSpriteLabel.rotation.z += 0.01
  })
  .onMouseUp((object) => {console.log(object, 'up')})
  .onMouseDown((object) => {console.log(object, 'down')})

function generateObjectAnd2DLabel() {
  const geometry = new core.BoxGeometry(0.9, 0.9, 0.9)
  const material = new core.MeshNormalMaterial()
  const mesh = new core.Mesh(geometry, material)

  const divElement = document.createElement('div')
  divElement.className = 'label'
  divElement.textContent = 'Label CSS2DObject'
  const label = new core.CSS2DObject(divElement)
  label.position.set(0, 0.9, 0)
  mesh.add(label)
  return mesh
}

function generateObjectAnd3DObjectLabel() {
  const geometry = new core.BoxGeometry(0.9, 0.9, 0.9)
  const material = new core.MeshNormalMaterial()
  const mesh = new core.Mesh(geometry, material)

  const divElement = document.createElement('div')
  divElement.className = 'label'
  divElement.textContent = 'Label CSS3DObject'
  const label = new core.CSS3DObject(divElement)
  label.scale.set(0.02, 0.02, 0.02)
  label.position.set(0, 0.9, 0)
  mesh.add(label)
  return mesh
}

function generateObjectAnd3DSpriteLabel() {
  const geometry = new core.BoxGeometry(0.9, 0.9, 0.9)
  const material = new core.MeshNormalMaterial()
  const mesh = new core.Mesh(geometry, material)

  const divElement = document.createElement('div')
  divElement.className = 'label'
  divElement.textContent = 'Label CSS3DSprite'
  const label = new core.CSS3DSprite(divElement)
  label.scale.set(0.02, 0.02, 0.02)
  label.position.set(0, 0.9, 0)
  mesh.add(label)
  return mesh
}