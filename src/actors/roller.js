import Actor from '../actorsystem/Actor'

import {
  diceParse
} from '../calculator/diceparser'

import {
  toAST
} from '../calculator/ast'

import {
  evaluate
} from '../calculator/calculator'

const RollerActor = {
  init() {

  },
  receive(message) {

    switch (message.action) {
      case 'roll':
        console.time('roll')
        const ast = toAST(diceParse(message.arguments.dice.replace(/\s+/g, '')).value)
        //console.log(ast)
        console.log(evaluate(ast))
        console.timeEnd('roll')
        console.log('-----------------')
        
        /*Actor.sendFromWorker('ui', {
            action: 'update-result',
            arguments: calculateDice(message.arguments.dice.replace(/\s+/g, ''))
        })*/
        break

    }
  }
}

export default RollerActor