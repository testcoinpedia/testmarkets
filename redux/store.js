import { createStore } from 'redux'
import reducer from './reducer.js'

const appStore = createStore(reducer)
export default appStore