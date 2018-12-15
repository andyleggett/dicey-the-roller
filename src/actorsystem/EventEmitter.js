
let subscribers = []

const EventEmitter = {
    create(){
        const subscribe = (name, onmessage) => {
            subscribers.push({
                name,
                onMessage: onmessage
            })
            
            return () => {
                subscribers.splice(subscribers.length - 1, 1)
            }
        }

        const emit = (name, message) => {

            subscribers.forEach((subscriber) => {
                if (subscriber.name === name){
                    subscriber.onMessage(message)
                }
            })
            return 
        }

        return {
            subscribe,
            emit
        }
    }
}

export default EventEmitter