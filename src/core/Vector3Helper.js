import { Spherical, Vector3 } from 'three'

const vector = new Vector3()
const spherical = new Spherical()

class Vector3Helper {
  static randomVector3(radius = 10) {
    const random = Math.random()
    spherical.radius = radius
    spherical.theta = random * Math.PI * 2
    spherical.phi = Math.acos((2 * random) - 1)
    return vector.setFromSpherical(spherical).clone()
  }
}

export default Vector3Helper