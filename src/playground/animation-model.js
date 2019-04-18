import * as core from '@core'

const appElement = document.getElementById('app')

core.BaseScene.get()
  .prepareRenderer()
  .prepareCamera()
  .prepareScene()
  .append(appElement)
  .animate()

const loader = new core.GLTFLoader()
loader.load('./src/playground/models/Soldier.glb', function (gltf) {
  console.log(gltf, gltf.scene)
  const model = gltf.scene

  core.BaseScene.get()
    .add(model)

  model.traverse(function (object) {
    if (object.isMesh) {
      object.castShadow = true
    }
  })
})

// core.BaseScene.get()
//   .add(mesh)
//   .onAnimate((delta) => {
//     mesh.rotation.x += 0.01
//     mesh.rotation.y += 0.02
//   })

window.addEventListener('resize', () => {
  core.BaseScene.get().onResize()
}, false)