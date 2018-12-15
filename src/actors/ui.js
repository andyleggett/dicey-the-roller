import Actor from '../actorsystem/Actor'

let dice
let roll
let result
let rolled

const UIActor = {
  init() {
    dice = document.querySelector('#dice')
    roll = document.querySelector('#roll')
    result = document.querySelector('#result')
    rolled = document.querySelector('#rolled')

    if (roll !== null){
        roll.addEventListener('click', () => {
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
        if (result !== null){
            result.innerText = message.arguments.result
        }

        if (rolled !== null){
            rolled.innerText = message.arguments.rolled
        }
        
        break

    }
  }
}

export default UIActor