import Actor from '../actorsystem/Actor'

import {
    isRight
  } from '../functions/Either'

let dice
let roll
let result
let rolled
let error

const UIActor = {
  init() {
    dice = document.querySelector('#dice')
    roll = document.querySelector('#roll')
    result = document.querySelector('#result')
    rolled = document.querySelector('#rolled')
    error = document.querySelector('#error')

    if (roll !== null){
        roll.addEventListener('click', () => {
            error.innerText = ''
            
            Actor.send('roller', {
                action: 'roll',
                arguments: {
                    dice: (dice !== null) ? dice.value : ''
                }
            })
        })
    }
  },
  receive(message) {

    switch (message.action) {
      case 'update-result':

        if (isRight(message.arguments)){    
            result.innerText = message.arguments.value.result
            rolled.innerText = message.arguments.value.rolled
        } else {
            error.innerText = message.arguments.value
        }
        
        break

    }
  }
}

export default UIActor