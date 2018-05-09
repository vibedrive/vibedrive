import deepFreeze from 'deep-freeze'
import env from '../env'

const constants = {}

Object.keys(env).forEach(key => {
  constants[key] = env[key]
})

export default deepFreeze(constants)
