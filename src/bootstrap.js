import Actor from './actorsystem/Actor'
import UIActor from './actors/ui'

const bootstrap = () => {
  Actor.create('ui', UIActor)

  Actor.startWorker('roller', 'roller-worker.js').then(() => {
    console.log('Roller Ready!')
  })
}

bootstrap()
