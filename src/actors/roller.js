import Actor from '../actorsystem/Actor'

import {calculateDice} from '../calculator/calculator' 

const RollerActor = {
  init() {
    
  },
  receive(message) {

    switch (message.action) {
      case 'roll':
        Actor.sendFromWorker('ui', {
            action: 'update-result',
            arguments: calculateDice(message.arguments.dice.replace(/\s+/g, ''))
        })
        break

    }
  }
}

export default RollerActor