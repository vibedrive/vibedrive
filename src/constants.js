import env from '../env'

const constants = {}

Object.keys(env).forEach(key => {
  constants[key] = env[key]
})

export default constants
