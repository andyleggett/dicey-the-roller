import EventEmitter from './EventEmitter'

const emitter = EventEmitter.create()

const actors = []

const Actor = {
  create(name, behaviour) {
    if (behaviour.init !== undefined) {
      behaviour.init()
    }

    const send = (name, message) => emitter.emit(name, message)
    
    const receive = (message) => behaviour.receive(message)

    emitter.subscribe(name, receive)
    
    const newActor = {
      name,
      send
    }

    actors.push(newActor)

    return newActor
  },
  createInWorker(name, behaviour) {
    if (behaviour.init !== undefined) {
      behaviour.init()
    }

    const send = (name, message) => postMessage({
      name, 
      message
    })

    addEventListener('message', (e) => behaviour.receive(e.data))
    
    return {
      name,
      send
    }
  },
  startWorker(name, path){
    const worker = new Worker(path)

    return new Promise((res, rej) => {

      const newActor = {
        name,
        send: (_, message) => worker.postMessage(message)
      }

      worker.addEventListener('message', (e) => this.send(e.data.name, e.data.message))

      actors.push(newActor)
  
      res(newActor)
    })

  },
  send(name, message) {
    //console.log(`Sending ${message.action} to ${name}`)

    actors.forEach((actor) => {
      if (actor.name === name){
        actor.send(name, message)
      }
    })
  },
  sendFromWorker(name, message){
    //console.log(`Worker - Sending ${message.action} to ${name}`)

    postMessage({
      name,
      message
    })
  }
}

export default Actor